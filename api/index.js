export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  // Your configured SSH WebSocket server and port
  const UPSTREAM_SERVER = "us1.sshws.net:80"; 

  const url = new URL(request.url);
  // Using http:// because port 80 is cleartext HTTP WebSocket
  const targetUrl = `http://${UPSTREAM_SERVER}${url.pathname}${url.search}`;
  
  const newHeaders = new Headers(request.headers);
  newHeaders.set('Host', 'us1.sshws.net');

  // Grab the Upgrade header safely, converting it to lowercase
  const upgradeHeader = request.headers.get('Upgrade') || '';
  
  if (upgradeHeader.toLowerCase() === 'websocket') {
    try {
      return await fetch(targetUrl, {
        method: request.method,
        headers: newHeaders,
        body: request.body,
        redirect: 'manual'
      });
    } catch (err) {
      return new Response(`Proxy Connection Failed: ${err.message}`, { status: 502 });
    }
  }

  // Force-forward non-upgrade requests to the SSH endpoint to let it handle handshakes natively
  try {
    return await fetch(targetUrl, {
      method: request.method,
      headers: newHeaders,
      body: request.body,
      redirect: 'manual'
    });
  } catch (err) {
    return new Response("Vercel proxy connected, but us1.sshws.net is unreachable.", { status: 502 });
  }
}
