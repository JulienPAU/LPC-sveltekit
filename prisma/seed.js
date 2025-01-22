import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import { parse } from 'csv-parse';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function readCSV(filename) {
	const records = [];
	const parser = fs.createReadStream(path.join(__dirname, `data/${filename}`)).pipe(
		parse({
			columns: true,
			skip_empty_lines: true
		})
	);

	for await (const record of parser) {
		records.push(record);
	}

	return records;
}

async function main() {
	try {
		// Nettoyer la base de données
		await prisma.$transaction([
			prisma.articleTags.deleteMany(),
			prisma.articleWatches.deleteMany(),
			prisma.favorites.deleteMany(),
			prisma.comments.deleteMany(),
			prisma.articles.deleteMany(),
			prisma.tags.deleteMany(),
			prisma.watches.deleteMany(),
			prisma.categories.deleteMany(),
			prisma.user.deleteMany()
		]);

		// Categories
		const categories = await readCSV('categories.csv');
		for (const category of categories) {
			await prisma.categories.create({
				data: {
					id: parseInt(category.id),
					name: category.name,
					type: category.type
				}
			});
		}

		// Users
		const users = await readCSV('users.csv');
		for (const user of users) {
			const hashedPassword = await bcrypt.hash(user.password, 12); // Hachage du mot de passe

			await prisma.user.create({
				data: {
					id: user.id,
					last_name: user.last_name,
					first_name: user.first_name,
					username: user.username,
					email: user.email,
					password: hashedPassword,
					role: user.role,
					User_Role: {
						create: {
							role: user.role
						}
					}
				}
			});
		}

		// Watches
		const watches = await readCSV('watches.csv');
		for (const watch of watches) {
			await prisma.watches.create({
				data: {
					id: parseInt(watch.id),
					brand: watch.brand,
					model: watch.model,
					movement: watch.movement,
					water_resistance: watch.water_resistance,
					case_material: watch.case_material,
					strap_material: watch.strap_material,
					type: watch.type
				}
			});
		}

		// Articles
		const articles = await readCSV('articles.csv');
		for (const article of articles) {
			const createdArticle = await prisma.articles.create({
				data: {
					id: parseInt(article.id),
					title: article.title,
					introduction: article.introduction,
					body: article.body,
					ending: article.ending,
					publish_date: new Date(article.publish_date),
					user_id: article.user_id,
					category_id: parseInt(article.category_id),
					status: article.status,
					article_type: article.article_type
				}
			});
			if (article.images) {
				const imagePaths = article.images.split(','); // Si plusieurs images, elles sont séparées par des virgules
				for (const imagePath of imagePaths) {
					await prisma.articleImage.create({
						data: {
							article_id: createdArticle.id,
							url: imagePath.trim(), // On retire les espaces inutiles
							public_id: imagePath.trim() // Ou ici tu peux mettre un autre ID pour la gestion des images
						}
					});
				}
			}
		}

		// Comments
		const comments = await readCSV('comments.csv');
		for (const comment of comments) {
			await prisma.comments.create({
				data: {
					id: parseInt(comment.id),
					content: comment.content,
					comment_date: new Date(comment.comment_date),
					user_id: comment.user_id,
					article_id: parseInt(comment.article_id)
				}
			});
		}

		// Tags
		const tags = await readCSV('tags.csv');
		for (const tag of tags) {
			await prisma.tags.create({
				data: {
					id: parseInt(tag.id),
					name: tag.name
				}
			});
		}

		// Favorites
		const favorites = await readCSV('favorites.csv');
		for (const favorite of favorites) {
			await prisma.favorites.create({
				data: {
					user_id: favorite.user_id,
					article_id: parseInt(favorite.article_id)
				}
			});
		}

		// ArticleTags
		const articleTags = await readCSV('article_tags.csv');
		for (const articleTag of articleTags) {
			await prisma.articleTags.create({
				data: {
					article_id: parseInt(articleTag.article_id),
					tag_id: parseInt(articleTag.tag_id)
				}
			});
		}

		// ArticleWatches
		const articleWatches = await readCSV('article_watches.csv');
		for (const articleWatch of articleWatches) {
			await prisma.articleWatches.create({
				data: {
					article_id: parseInt(articleWatch.article_id),
					watch_id: parseInt(articleWatch.watch_id)
				}
			});
		}
	} catch (error) {
		console.error('Error seeding database:', error);
		throw error;
	}
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
