import type { Handler } from '@netlify/functions';

export const handler: Handler = async () => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const mapId = process.env.GOOGLE_MAPS_MAP_ID;
  const designId = process.env.GOOGLE_MAPS_DESIGN_ID;

  return {
    statusCode: 200,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
    body: JSON.stringify({ apiKey, mapId, designId })
  };
};
