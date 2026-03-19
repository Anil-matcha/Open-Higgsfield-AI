import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://your-production-domain.com",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('[videoagent] Missing required environment variables');
}

interface ProcessRequest {
  action: 'auto-edit' | 'create-shorts' | 'scene-detection' | 'clip-segmentation' | 'highlight-detection';
  videoId?: string;
  videoUrl: string;
  options?: Record<string, any>;
}

interface JobRecord {
  id: string;
  action: string;
  videoId?: string;
  videoUrl: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  currentStep: number;
  totalSteps: number;
  steps: string[];
  result?: any;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

const jobsStore = new Map<string, JobRecord>();

const PIPELINE_STEPS = {
  'auto-edit': [
    'Scene Detection',
    'Highlight Detection', 
    'Clip Generation',
    'Subtitle Generation',
    'B-Roll & Overlays',
    'Final Export'
  ],
  'create-shorts': [
    'Video Analysis',
    'Highlight Extraction',
    'Clip Generation',
    'Caption Generation',
    'Thumbnail Creation',
    'Social Export'
  ],
  'scene-detection': ['Scene Detection', 'Scene Segmentation', 'Export Results'],
  'clip-segmentation': ['Video Analysis', 'Clip Boundaries', 'Clip Extraction'],
  'highlight-detection': ['Video Analysis', 'Highlight Detection', 'Highlight Extraction']
};

function generateJobId(): string {
  return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  const url = new URL(req.url);
  const jobId = url.searchParams.get('jobId');

  if (req.method === "GET" && jobId) {
    const job = jobsStore.get(jobId);
    
    if (!job) {
      return new Response(
        JSON.stringify({ error: 'Job not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        jobId: job.id,
        status: job.status,
        currentStep: job.currentStep,
        totalSteps: job.totalSteps,
        steps: job.steps,
        result: job.result,
        error: job.error
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  if (req.method === "POST") {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    try {
      const body: ProcessRequest = await req.json();
      const { action, videoId, videoUrl, options } = body;

      if (!action || !videoUrl) {
        return new Response(
          JSON.stringify({ error: 'action and videoUrl are required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const validActions = ['auto-edit', 'create-shorts', 'scene-detection', 'clip-segmentation', 'highlight-detection'];
      if (!validActions.includes(action)) {
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const newJobId = generateJobId();
      const steps = PIPELINE_STEPS[action] || PIPELINE_STEPS['auto-edit'];

      const job: JobRecord = {
        id: newJobId,
        action,
        videoId: videoId || '',
        videoUrl,
        status: 'processing',
        currentStep: 0,
        totalSteps: steps.length,
        steps,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      jobsStore.set(newJobId, job);

      processJobAsync(newJobId, action, videoUrl, options);

      console.log(`[videoagent] Created job: ${newJobId} for action: ${action}`);

      return new Response(
        JSON.stringify({
          success: true,
          jobId: newJobId,
          status: 'processing',
          message: `Started ${action} pipeline`
        }),
        { status: 202, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (error) {
      console.error('[videoagent] Error:', error);

      return new Response(
        JSON.stringify({
          error: 'Internal server error',
          message: error.message
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }

  return new Response(
    JSON.stringify({ error: 'Method not allowed' }),
    { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
});

async function processJobAsync(jobId: string, action: string, videoUrl: string, options?: Record<string, any>) {
  const job = jobsStore.get(jobId);
  if (!job) return;

  const steps = PIPELINE_STEPS[action] || PIPELINE_STEPS['auto-edit'];

  for (let i = 0; i < steps.length; i++) {
    job.currentStep = i + 1;
    job.updatedAt = new Date().toISOString();
    jobsStore.set(jobId, job);

    console.log(`[videoagent] Job ${jobId}: Processing step ${i + 1}/${steps.length} - ${steps[i]}`);

    try {
      await simulateProcessingStep(steps[i], videoUrl, action);
    } catch (error) {
      job.status = 'failed';
      job.error = error.message;
      job.updatedAt = new Date().toISOString();
      jobsStore.set(jobId, job);
      console.error(`[videoagent] Job ${jobId} failed at step ${steps[i]}:`, error);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  job.status = 'completed';
  job.currentStep = steps.length;
  job.result = {
    outputUrl: videoUrl,
    processed: true,
    action,
    timestamp: new Date().toISOString()
  };
  job.updatedAt = new Date().toISOString();
  jobsStore.set(jobId, job);

  console.log(`[videoagent] Job ${jobId} completed successfully`);
}

async function simulateProcessingStep(stepName: string, videoUrl: string, action: string) {
  console.log(`[videoagent] Simulating: ${stepName}`);
  
  if (action === 'create-shorts' && stepName.includes('Clip Generation')) {
    return {
      clips: [
        { start: 0, end: 15, platform: 'tiktok' },
        { start: 15, end: 45, platform: 'youtube_shorts' },
        { start: 45, end: 60, platform: 'instagram_reels' }
      ]
    };
  }
  
  if (action === 'auto-edit' && stepName.includes('Final Export')) {
    return {
      outputUrl: videoUrl,
      format: 'mp4',
      quality: 'hd'
    };
  }
  
  return { success: true, step: stepName };
}
