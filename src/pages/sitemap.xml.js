import { getSitemapXml } from '../lib/site.mjs';

export function GET() {
  return new Response(getSitemapXml(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
