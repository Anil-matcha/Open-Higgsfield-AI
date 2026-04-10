export async function GET(request, { params }) {
  try {
    const apiKey = process.env.MUAPI_API_KEY;

    if (!apiKey) {
      return Response.json({ error: 'Missing API key' }, { status: 500 });
    }

    const id = params.id;

    const res = await fetch(`https://api.muapi.ai/api/v1/predictions/${id}/result`, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      cache: 'no-store',
    });

    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}