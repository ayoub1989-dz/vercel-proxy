   export const config = {
     runtime: 'edge',
   };

   export default async function handler(request) {
     const url = new URL(request.url);
     // Forward the incoming request straight to your VPS
     const targetUrl = `http://fr.connfull.org:9443${url.pathname}${url.search}`;
     
     return fetch(targetUrl, {
       method: request.method,
       headers: request.headers,
       body: request.body
     });
   }
