# Multi-Tenant Storage Architecture

## Overview

A secure, scalable file storage system designed for multi-tenant SaaS applications with thousands of users. Built on Supabase Storage with automatic tenant isolation via Row-Level Security.

## Storage Buckets

### 1. tenant-assets (Private)

**Purpose**: User-uploaded files and source materials

**Configuration:**
- **Access**: Private (authenticated users only)
- **Size Limit**: 100MB per file
- **Path Structure**: `/{tenant_id}/{user_id}/{asset_type}/{filename}`
- **Allowed Types**: Images, videos, audio, documents, PDFs

**Example Paths:**
```
/550e8400-e29b-41d4-a716-446655440000/abc123/images/product-photo.jpg
/550e8400-e29b-41d4-a716-446655440000/abc123/videos/raw-footage.mp4
/550e8400-e29b-41d4-a716-446655440000/def456/documents/script.pdf
```

**Use Cases:**
- User profile pictures
- Product photography uploads
- Video footage for editing
- Audio files for processing
- Reference images for character generation

### 2. tenant-generations (Private)

**Purpose**: AI-generated media outputs

**Configuration:**
- **Access**: Private (authenticated users only)
- **Size Limit**: 500MB per file (large videos)
- **Path Structure**: `/{tenant_id}/generations/{generation_id}/{filename}`
- **Allowed Types**: Images, videos, audio

**Example Paths:**
```
/550e8400-e29b-41d4-a716-446655440000/generations/gen-123/output.mp4
/550e8400-e29b-41d4-a716-446655440000/generations/gen-456/image.webp
/550e8400-e29b-41d4-a716-446655440000/generations/gen-789/audio.mp3
```

**Use Cases:**
- Generated images from Image Studio
- Generated videos from Video Studio
- AI-enhanced media from Edit Studio
- Upscaled content from Upscale Studio

### 3. tenant-thumbnails (Public)

**Purpose**: Preview images and thumbnails

**Configuration:**
- **Access**: Public (CDN-ready)
- **Size Limit**: 10MB per file
- **Path Structure**: `/{tenant_id}/thumbnails/{resource_type}/{filename}`
- **Allowed Types**: Images only (JPEG, PNG, WebP, GIF)

**Example Paths:**
```
/550e8400-e29b-41d4-a716-446655440000/thumbnails/projects/project-thumb.webp
/550e8400-e29b-41d4-a716-446655440000/thumbnails/generations/gen-preview.jpg
/550e8400-e29b-41d4-a716-446655440000/thumbnails/assets/asset-preview.png
```

**Use Cases:**
- Project preview images
- Generation thumbnails in library
- Asset preview in file picker
- User avatar thumbnails

### 4. shared-content (Public)

**Purpose**: Publicly shared content via share links

**Configuration:**
- **Access**: Public (anonymous read)
- **Size Limit**: 100MB per file
- **Path Structure**: `/shared/{share_token}/{filename}`
- **Allowed Types**: Images, videos

**Example Paths:**
```
/shared/abc123xyz789/shared-video.mp4
/shared/def456uvw123/shared-image.jpg
```

**Use Cases:**
- Shareable generation links
- Portfolio content
- Public showcase videos
- Social media embeds

## Storage Security (RLS Policies)

### Tenant Isolation

All private buckets enforce tenant isolation through folder paths:

```sql
-- Users can only access files in their tenant folder
(storage.foldername(name))[1] IN (
  SELECT tenant_id::text FROM user_profiles WHERE id = auth.uid()
)
```

### Access Control Matrix

| Bucket | Public Read | Authenticated Upload | User Update Own | User Delete Own |
|--------|-------------|---------------------|-----------------|-----------------|
| **tenant-assets** | ❌ | ✅ (own tenant) | ✅ | ✅ |
| **tenant-generations** | ❌ | ✅ (own tenant) | ✅ (own tenant) | ✅ (own tenant) |
| **tenant-thumbnails** | ✅ | ✅ (own tenant) | ✅ (own tenant) | ✅ (own tenant) |
| **shared-content** | ✅ | ✅ | ✅ (own files) | ✅ (own files) |

### Security Features

✅ **Path-based isolation** - Tenant ID in folder structure
✅ **RLS policies** - Automatic access control
✅ **File type validation** - MIME type restrictions
✅ **Size limits** - Per-bucket maximums
✅ **Owner verification** - Users can only modify own files
✅ **Public/Private separation** - Clear bucket boundaries

## Storage Quotas

### Plan-Based Limits

| Plan | Storage Limit | File Size Limit | Monthly Transfer |
|------|---------------|-----------------|------------------|
| **Free** | 10 GB | 100 MB | 50 GB |
| **Pro** | 100 GB | 500 MB | 500 GB |
| **Enterprise** | 1 TB+ | 500 MB | 5 TB |

### Quota Enforcement

```javascript
// Check before upload
const withinQuota = await supabase.rpc('check_storage_quota', {
  tenant_id_param: tenant.id
});

if (!withinQuota) {
  throw new Error('Storage quota exceeded. Please upgrade your plan.');
}
```

### Usage Tracking

```javascript
// Get current usage
const { data } = await supabase.rpc('get_tenant_storage_usage', {
  tenant_id_param: tenant.id
});

// Returns:
// [
//   { bucket_name: 'tenant-assets', file_count: 150, total_gb: 2.5 },
//   { bucket_name: 'tenant-generations', file_count: 500, total_gb: 15.3 }
// ]
```

## Usage Examples

### 1. Upload User Asset

```javascript
async function uploadAsset(file, assetType) {
  const user = await getCurrentUser();
  const tenant = await getUserTenant();

  // Check quota
  const withinQuota = await supabase.rpc('check_storage_quota', {
    tenant_id_param: tenant.id
  });

  if (!withinQuota) {
    throw new Error('Storage quota exceeded');
  }

  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExt}`;
  const filePath = `${tenant.id}/${user.id}/${assetType}/${fileName}`;

  // Upload to storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('tenant-assets')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('tenant-assets')
    .getPublicUrl(filePath);

  // Create database record
  const { data: asset, error: dbError } = await supabase
    .from('assets')
    .insert({
      tenant_id: tenant.id,
      user_id: user.id,
      file_name: file.name,
      file_path: filePath,
      file_size_bytes: file.size,
      mime_type: file.type,
      asset_type: assetType,
      metadata: {
        original_name: file.name,
        uploaded_at: new Date().toISOString()
      }
    })
    .select()
    .single();

  if (dbError) throw dbError;

  return { asset, publicUrl };
}
```

### 2. Save Generated Output

```javascript
async function saveGenerationOutput(generationId, blob, fileType) {
  const tenant = await getUserTenant();

  // Generate filename
  const fileExt = fileType === 'video' ? 'mp4' : 'webp';
  const fileName = `output.${fileExt}`;
  const filePath = `${tenant.id}/generations/${generationId}/${fileName}`;

  // Upload to storage
  const { data, error } = await supabase.storage
    .from('tenant-generations')
    .upload(filePath, blob, {
      contentType: fileType === 'video' ? 'video/mp4' : 'image/webp',
      upsert: false
    });

  if (error) throw error;

  // Get public URL (signed for private bucket)
  const { data: { signedUrl } } = await supabase.storage
    .from('tenant-generations')
    .createSignedUrl(filePath, 3600); // 1 hour

  // Update generation record
  await supabase
    .from('generation_history')
    .update({
      output_url: filePath,
      status: 'completed',
      completed_at: new Date().toISOString()
    })
    .eq('id', generationId);

  return { filePath, signedUrl };
}
```

### 3. Generate and Upload Thumbnail

```javascript
async function generateThumbnail(sourceFile, resourceType, resourceId) {
  const tenant = await getUserTenant();

  // Create thumbnail (resize to 400x300)
  const thumbnail = await createThumbnail(sourceFile, 400, 300);

  // Upload to public bucket
  const fileName = `${resourceId}-thumb.webp`;
  const filePath = `${tenant.id}/thumbnails/${resourceType}/${fileName}`;

  const { data, error } = await supabase.storage
    .from('tenant-thumbnails')
    .upload(filePath, thumbnail, {
      contentType: 'image/webp',
      upsert: true
    });

  if (error) throw error;

  // Get public URL (no signature needed for public bucket)
  const { data: { publicUrl } } = supabase.storage
    .from('tenant-thumbnails')
    .getPublicUrl(filePath);

  return publicUrl;
}
```

### 4. Share Content Publicly

```javascript
async function shareContent(generationId) {
  const user = await getCurrentUser();
  const tenant = await getUserTenant();

  // Get generation
  const { data: generation } = await supabase
    .from('generation_history')
    .select('output_url')
    .eq('id', generationId)
    .single();

  // Copy to shared bucket
  const shareToken = crypto.randomUUID();
  const sourceFile = await downloadFile(generation.output_url);
  const sharedPath = `shared/${shareToken}/content.mp4`;

  const { error } = await supabase.storage
    .from('shared-content')
    .upload(sharedPath, sourceFile);

  if (error) throw error;

  // Create share record
  const { data: share } = await supabase
    .from('shared_content')
    .insert({
      tenant_id: tenant.id,
      shared_by: user.id,
      content_type: 'generation',
      content_id: generationId,
      share_token: shareToken,
      share_type: 'public',
      permissions: ['view', 'download']
    })
    .select()
    .single();

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('shared-content')
    .getPublicUrl(sharedPath);

  return {
    shareUrl: `${window.location.origin}/shared/${shareToken}`,
    publicUrl
  };
}
```

### 5. Delete Asset with Storage Cleanup

```javascript
async function deleteAsset(assetId) {
  // Get asset record
  const { data: asset } = await supabase
    .from('assets')
    .select('file_path')
    .eq('id', assetId)
    .single();

  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from('tenant-assets')
    .remove([asset.file_path]);

  if (storageError) throw storageError;

  // Delete database record
  const { error: dbError } = await supabase
    .from('assets')
    .delete()
    .eq('id', assetId);

  if (dbError) throw dbError;

  return true;
}
```

### 6. Get Storage Usage Dashboard

```javascript
async function getStorageUsage() {
  const tenant = await getUserTenant();

  // Get usage per bucket
  const { data: usage } = await supabase.rpc('get_tenant_storage_usage', {
    tenant_id_param: tenant.id
  });

  // Calculate totals
  const totalFiles = usage.reduce((sum, b) => sum + b.file_count, 0);
  const totalGB = usage.reduce((sum, b) => sum + b.total_gb, 0);
  const maxGB = tenant.max_storage_gb;
  const usagePercent = (totalGB / maxGB) * 100;

  return {
    buckets: usage,
    total: {
      files: totalFiles,
      used_gb: totalGB,
      max_gb: maxGB,
      usage_percent: usagePercent,
      remaining_gb: maxGB - totalGB
    }
  };
}
```

## CDN & Performance

### Public Buckets (CDN-Enabled)

Public buckets (`tenant-thumbnails`, `shared-content`) are automatically CDN-cached:

```javascript
// Direct CDN URL (cached globally)
const publicUrl = supabase.storage
  .from('tenant-thumbnails')
  .getPublicUrl('path/to/file.webp');

// Fast delivery via Supabase CDN
// No authentication required
```

### Private Buckets (Signed URLs)

Private buckets require signed URLs with expiration:

```javascript
// Generate temporary signed URL
const { data } = await supabase.storage
  .from('tenant-assets')
  .createSignedUrl('path/to/file.jpg', 3600); // 1 hour

// Use signed URL in <img> or <video> tags
const signedUrl = data.signedUrl;
```

### Image Transformations

Supabase Storage supports on-the-fly image transformations:

```javascript
// Get resized image
const { data } = supabase.storage
  .from('tenant-thumbnails')
  .getPublicUrl('path/to/image.jpg', {
    transform: {
      width: 800,
      height: 600,
      resize: 'cover',
      quality: 80
    }
  });
```

## File Organization Best Practices

### Folder Structure

```
tenant-assets/
├── {tenant-id-1}/
│   ├── {user-id-1}/
│   │   ├── images/
│   │   │   ├── 2024-03-14-uuid1.jpg
│   │   │   └── 2024-03-14-uuid2.png
│   │   ├── videos/
│   │   │   └── 2024-03-14-uuid3.mp4
│   │   └── documents/
│   │       └── 2024-03-14-uuid4.pdf
│   └── {user-id-2}/
│       └── images/
│           └── 2024-03-14-uuid5.jpg
└── {tenant-id-2}/
    └── ...

tenant-generations/
├── {tenant-id-1}/
│   └── generations/
│       ├── {gen-id-1}/
│       │   ├── output.mp4
│       │   └── thumbnail.jpg
│       └── {gen-id-2}/
│           └── output.webp
└── {tenant-id-2}/
    └── ...
```

### Naming Conventions

```javascript
// Use timestamp + UUID for uniqueness
const timestamp = Date.now();
const uuid = crypto.randomUUID();
const fileName = `${timestamp}-${uuid}.${extension}`;

// Example: 1710432000000-550e8400-e29b-41d4-a716.jpg
```

### File Type Mapping

```javascript
const ASSET_TYPE_MAP = {
  'image/jpeg': 'images',
  'image/png': 'images',
  'image/webp': 'images',
  'video/mp4': 'videos',
  'video/webm': 'videos',
  'audio/mpeg': 'audio',
  'audio/wav': 'audio',
  'application/pdf': 'documents'
};

function getAssetType(mimeType) {
  return ASSET_TYPE_MAP[mimeType] || 'other';
}
```

## Maintenance & Cleanup

### Orphaned File Detection

```sql
-- Find files without database records
SELECT obj.name, obj.created_at, obj.metadata
FROM storage.objects obj
WHERE obj.bucket_id = 'tenant-assets'
  AND NOT EXISTS (
    SELECT 1 FROM assets a
    WHERE a.file_path = obj.name
  );
```

### Storage Cleanup Script

```javascript
async function cleanupOrphanedFiles(bucketName, tableName) {
  // Get all files from bucket
  const { data: files } = await supabase.storage
    .from(bucketName)
    .list('', { limit: 1000 });

  // Get all file paths from database
  const { data: records } = await supabase
    .from(tableName)
    .select('file_path');

  const dbPaths = new Set(records.map(r => r.file_path));

  // Find orphaned files
  const orphaned = files.filter(f => !dbPaths.has(f.name));

  // Delete orphaned files
  if (orphaned.length > 0) {
    const paths = orphaned.map(f => f.name);
    await supabase.storage
      .from(bucketName)
      .remove(paths);
  }

  return orphaned.length;
}
```

### Scheduled Maintenance

```javascript
// Run weekly via cron job or Supabase Edge Function
async function weeklyStorageMaintenance() {
  // 1. Clean up orphaned assets
  const orphanedAssets = await cleanupOrphanedFiles('tenant-assets', 'assets');

  // 2. Clean up orphaned generations
  const orphanedGens = await cleanupOrphanedFiles('tenant-generations', 'generation_history');

  // 3. Remove expired shared content
  const { data: expired } = await supabase
    .from('shared_content')
    .select('id, content_id')
    .lt('expires_at', new Date().toISOString())
    .eq('is_active', true);

  for (const share of expired) {
    // Deactivate share
    await supabase
      .from('shared_content')
      .update({ is_active: false })
      .eq('id', share.id);
  }

  return {
    orphaned_assets: orphanedAssets,
    orphaned_generations: orphanedGens,
    expired_shares: expired.length
  };
}
```

## Monitoring & Analytics

### Storage Metrics to Track

1. **Usage per Tenant** - Storage consumption by organization
2. **Upload Rate** - Files uploaded per day/month
3. **Download Rate** - Files accessed per day/month
4. **Quota Alerts** - Tenants approaching limits
5. **Error Rates** - Failed uploads/downloads
6. **Average File Size** - Per bucket and tenant

### Alerting Rules

```javascript
// Alert when tenant exceeds 80% of quota
async function checkStorageAlerts() {
  const { data: tenants } = await supabase
    .from('tenants')
    .select('id, name, max_storage_gb');

  for (const tenant of tenants) {
    const { data: usage } = await supabase.rpc('get_tenant_storage_usage', {
      tenant_id_param: tenant.id
    });

    const totalGB = usage.reduce((sum, b) => sum + b.total_gb, 0);
    const usagePercent = (totalGB / tenant.max_storage_gb) * 100;

    if (usagePercent >= 80) {
      // Send notification
      await supabase.rpc('create_notification', {
        user_id_param: tenant.owner_id,
        notification_type_param: 'storage_warning',
        title_param: 'Storage Quota Warning',
        message_param: `You're using ${usagePercent.toFixed(1)}% of your storage quota`
      });
    }
  }
}
```

## Cost Optimization

### Storage Cost Breakdown

Supabase Storage pricing (as of 2024):
- Storage: $0.021/GB/month
- Transfer: $0.09/GB (after free tier)
- Free tier: 100GB storage, 200GB transfer

### Optimization Strategies

1. **Use WebP for Images** - 25-35% smaller than JPEG/PNG
2. **Compress Videos** - Use efficient codecs (H.264, H.265)
3. **Generate Thumbnails** - Store small previews, load full on demand
4. **Lazy Loading** - Only load files when needed
5. **CDN Caching** - Reduce transfer costs via public buckets
6. **Cleanup Policy** - Delete old temporary files
7. **Quota Enforcement** - Prevent unlimited growth

## Security Checklist

✅ **Tenant isolation** via folder paths
✅ **RLS policies** on all buckets
✅ **File type restrictions** via MIME types
✅ **Size limits** per bucket
✅ **Signed URLs** for private content
✅ **Quota enforcement** prevents abuse
✅ **Audit logging** for file operations
✅ **Secure deletion** removes both storage and DB records

## Conclusion

This multi-tenant storage system provides:

- **Scalable** - Handles thousands of tenants and millions of files
- **Secure** - Automatic tenant isolation via RLS
- **Fast** - CDN integration for public content
- **Flexible** - Multiple buckets for different use cases
- **Cost-effective** - Quota limits and cleanup automation
- **Production-ready** - Complete with monitoring and maintenance

Your AI Media Generation Platform now has enterprise-grade file storage to complement the database architecture.
