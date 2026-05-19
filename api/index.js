export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  // ⚠️ CHANGE THIS to your real VPS IP and WebSocket port
  const UPSTREAM_SERVER = "us1.sshws.net:80"; 

  const url = new URL(request.url);
  const targetUrl = `http://${UPSTREAM_SERVER}${url.pathname}${url.search}`;
  const newHeaders = new Headers(request.headers);
  newHeaders.set('Host', UPSTREAM_SERVER);

  if (request.headers.get('Upgrade') === 'websocket') {
    try {
      return await fetch(targetUrl, {
        method: request.method,
        headers: newHeaders,
        body: request.body,
        redirect: 'manual'
      });
    } catch (err) {
      return new Response(`Proxy Error: ${err.message}`, { status: 502 });
    }
  }

  return new Response("Proxy is active.", { status: 200 });
}
