export async function POST(req) {
  try {
    const body = await req.json();

    const apiKey = process.env.MUAPI_API_KEY;

    if (!apiKey) {
      return Response.json({ error: 'Missing API key' }, { status: 500 });
    }

    const endpoint = body.endpoint || 'nano-banana';

    const payload = {
      prompt: body.prompt,
    };

    if (body.aspect_ratio) payload.aspect_ratio = body.aspect_ratio;
    if (body.resolution) payload.resolution = body.resolution;
    if (body.quality) payload.quality = body.quality;
    if (body.image_url) payload.image_url = body.image_url;
    if (body.strength !== undefined) payload.strength = body.strength;
    if (body.seed !== undefined) payload.seed = body.seed;

    const res = await fetch(`https://api.muapi.ai/api/v1/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    console.log('MUAPI ENDPOINT:', endpoint);
    console.log('MUAPI RESPONSE:', JSON.stringify(data, null, 2));

    return Response.json(data, { status: res.status });
  } catch (err) {
    console.error('GENERATE ROUTE ERROR:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}