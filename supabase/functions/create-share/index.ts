import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://your-production-domain.com", // Replace with actual domain
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// Environment validation
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('[create-share] Missing required environment variables');
}

// Simple SHA-256 hash for password storage (use proper bcrypt in production)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

interface CreateShareRequest {
  resourceType: 'generation' | 'project' | 'storyboard' | 'character';
  resourceId: string;
  expiresIn?: number;
  password?: string;
  allowDownload?: boolean;
}

function generateShareToken(): string {
  return crypto.randomUUID().replace(/-/g, '');
}

// Rate limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 30;
const RATE_LIMIT_WINDOW_MS = 60000;

function checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(clientId);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(clientId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  
  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }
  
  record.count++;
  return true;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  // Check environment
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(
      JSON.stringify({ error: 'Server configuration error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }

  // Rate limiting by IP
  const clientIp = req.headers.get('cf-connecting-ip') || 'unknown';
  if (!checkRateLimit(clientIp)) {
    return new Response(
      JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
      {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': '60' }
      }
    );
  }

  const url = new URL(req.url);
  const token = url.searchParams.get('token');

  if (req.method === "GET" && token) {
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

      // Validate token format
      if (!/^[a-f0-9]{32}$/.test(token)) {
        return new Response(
          JSON.stringify({ error: 'Invalid share token format' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      const { data: share, error } = await supabase
        .from('shared_content')
        .select('*')
        .eq('share_token', token)
        .eq('is_active', true)
        .maybeSingle();

      if (error || !share) {
        return new Response(
          JSON.stringify({ error: 'Share not found or expired' }),
          {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      if (share.expires_at && new Date(share.expires_at) < new Date()) {
        return new Response(
          JSON.stringify({ error: 'Share link has expired' }),
          {
            status: 410,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      await supabase
        .from('shared_content')
        .update({ view_count: share.view_count + 1 })
        .eq('id', share.id);

      return new Response(
        JSON.stringify({
          success: true,
          share: {
            resourceType: share.resource_type,
            resourceId: share.resource_id,
            allowDownload: share.allow_download,
            viewCount: share.view_count + 1,
            hasPassword: !!share.password_hash
          }
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );

    } catch (error) {
      console.error('[create-share] GET error:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
  }

  if (req.method === "POST") {
    try {
      const body: CreateShareRequest = await req.json();
      const { resourceType, resourceId, expiresIn, password, allowDownload } = body;

      if (!resourceType || !resourceId) {
        return new Response(
          JSON.stringify({ error: 'resourceType and resourceId are required' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // Validate resourceType
      const validResourceTypes = ['generation', 'project', 'storyboard', 'character'];
      if (!validResourceTypes.includes(resourceType)) {
        return new Response(
          JSON.stringify({ error: 'Invalid resourceType' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

      const shareToken = generateShareToken();

      let expiresAt = null;
      if (expiresIn && expiresIn > 0) {
        // Limit max expiry to 30 days
        const safeExpiresIn = Math.min(expiresIn, 720);
        const expireDate = new Date();
        expireDate.setHours(expireDate.getHours() + safeExpiresIn);
        expiresAt = expireDate.toISOString();
      }

      // Hash password if provided
      let passwordHash = null;
      if (password) {
        // Minimum password length
        if (password.length < 4) {
          return new Response(
            JSON.stringify({ error: 'Password must be at least 4 characters' }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
        passwordHash = await hashPassword(password);
      }

      const { data: share, error } = await supabase
        .from('shared_content')
        .insert({
          resource_type: resourceType,
          resource_id: resourceId,
          share_token: shareToken,
          expires_at: expiresAt,
          password_hash: passwordHash,
          allow_download: allowDownload !== false,
          is_active: true,
          view_count: 0
        })
        .select()
        .single();

      if (error) {
        console.error('[create-share] Insert error:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to create share link' }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      const shareUrl = `${SUPABASE_URL}/functions/v1/create-share?token=${shareToken}`;

      console.log(`[create-share] Created share link: ${shareToken}`);

      return new Response(
        JSON.stringify({
          success: true,
          shareUrl,
          shareToken,
          expiresAt: share.expires_at
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );

    } catch (error) {
      console.error('[create-share] POST error:', error);

      return new Response(
        JSON.stringify({
          error: 'Internal server error',
          message: error.message
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
  }

  return new Response(
    JSON.stringify({ error: 'Method not allowed' }),
    {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
});
