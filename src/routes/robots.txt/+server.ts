// src/routes/robots.txt/+server.js
export function GET() {
    const robotsTxt = `User-agent: *
  Allow: /
  
  # Interdire l'accès à des sections privées si nécessaire
  Disallow: /api/
  Disallow: /dashboard/
  
  # Sitemap
  Sitemap: https://lespetitscadrans.com/sitemap.xml
  `;

    return new Response(robotsTxt, {
        headers: {
            'Content-Type': 'text/plain'
        }
    });
}