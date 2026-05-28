import { getRobotsTxt } from '../lib/site.mjs';

export function GET() {
  return new Response(getRobotsTxt(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
