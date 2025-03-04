// src/routes/sitemap.xml/+server.js
import prisma from '$lib/prisma';

export async function GET() {
    try {
        // Récupération de tous les articles publiés
        const articles = await prisma.articles.findMany({
            where: { status: 'PUBLISHED' },
            select: {
                id: true,
                title: true,
                publish_date: true,
                update_date: true
            }
        });

        // Récupération de toutes les catégories
        const categories = await prisma.categories.findMany({
            select: { name: true }
        });

        // Date actuelle pour les pages statiques
        const now = new Date().toISOString();

        // Création du XML
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Pages statiques -->
  <url>
    <loc>https://lespetitscadrans.com/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://lespetitscadrans.com/articles</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Articles -->
  ${articles.map(article => `
  <url>
    <loc>https://lespetitscadrans.com/articles/${article.id}</loc>
    <lastmod>${new Date(article.update_date ?? article.publish_date ?? new Date()).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n  ')}
  
  <!-- Catégories -->
  ${categories.map(category => `
  <url>
    <loc>https://lespetitscadrans.com/articles?category=${encodeURIComponent(category.name)}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n  ')}
</urlset>`;

        return new Response(sitemap, {
            headers: {
                'Content-Type': 'application/xml'
            }
        });
    } catch (error) {
        console.error('Error generating sitemap:', error);
        return new Response('Error generating sitemap', { status: 500 });
    }
}