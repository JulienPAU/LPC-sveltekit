// src/routes/sitemap.xml/+server.js

import prisma from '$lib/prisma';

export async function GET() {
	const articles = await prisma.articles.findMany({
		where: { status: 'PUBLISHED' },
		select: { id: true, title: true, publish_date: true }
	});

	const staticPages = [
		'',
		'/articles',
		'/contact',
		'/mentions-legales',
		'/politique-de-confidentialite'
	];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	${staticPages
		.map(
			(page) => `
	<url>
		<loc>https://lespetitscadrans.com${page}</loc>
		<changefreq>weekly</changefreq>
		<priority>${page === '' ? '1.0' : '0.8'}</priority>
	</url>`
		)
		.join('')}
	${articles
		.map(
			(article) => `
	<url>
		<loc>https://lespetitscadrans.com/articles/${article.id}</loc>
		<lastmod>${new Date(article.publish_date || new Date()).toISOString()}</lastmod>
		<changefreq>monthly</changefreq>
		<priority>0.6</priority>
	</url>`
		)
		.join('')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
}
