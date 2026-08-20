export const config = { matcher: ['/lp-v1', '/lp-v1-aberta'] };

export default function middleware(request: Request) {
  const url = new URL(request.url);
  const cookies = request.headers.get('cookie') ?? '';
  const match = cookies.match(/co_variant=(a|b)/);

  const variant = match ? match[1] : Math.random() < 0.7 ? 'a' : 'b';

  if (url.pathname === '/lp-v1-aberta') {
    url.pathname = variant === 'a' ? '/lp-a-aberta' : '/lp-b-aberta';
  } else {
    url.pathname = variant === 'a' ? '/lp-a' : '/lp-b';
  }

  return new Response(null, {
    status: 307,
    headers: {
      Location: url.toString(),
      'Set-Cookie': `co_variant=${variant}; Max-Age=${60 * 60 * 24 * 30}; Path=/`,
    },
  });
}