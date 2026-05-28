import { getStructuredDataJson } from '../lib/site.mjs';

export function GET() {
  return new Response(getStructuredDataJson(), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}
