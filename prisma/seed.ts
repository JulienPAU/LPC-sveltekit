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
	const records: Record<string, string>[] = [];
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
		// Nettoyer la base de données par ordre de dépendance
		await prisma.$transaction([
			prisma.articleWatches.deleteMany(),
			prisma.articleTags.deleteMany(),
			prisma.favorites.deleteMany(),
			prisma.comments.deleteMany(),
			prisma.watchStraps.deleteMany(),
			prisma.straps.deleteMany(),
			prisma.articles.deleteMany(),
			prisma.tags.deleteMany(),
			prisma.watches.deleteMany(),
			prisma.categories.deleteMany(),
			prisma.verificationToken.deleteMany(),
			prisma.user_Role.deleteMany(),
			prisma.user.deleteMany(),
			prisma.lexical.deleteMany()
		]);

		// Categories
		const lexical = await readCSV('lexical.csv');
		for (const definition of lexical) {
			await prisma.lexical.create({
				data: {
					id: parseInt(definition.id),
					title: definition.title,
					content: definition.content
				}
			});
		}

		const straps = await readCSV('straps.csv');
		for (const strap of straps) {
			await prisma.straps.create({
				data: {
					id: parseInt(strap.id),
					material: strap.material
				}
			});
		}

		// Users
		if (!process.env.SEED) {
			throw new Error('SEED environment variable is not defined');
		}
		const hashedPassword = await bcrypt.hash(process.env.SEED, 10);

		await prisma.user.create({
			data: {
				email: 'julien.paulus@neuf.fr',
				first_name: 'Julien',
				last_name: 'Paulus',
				username: 'Ely_jun',
				password: hashedPassword,
				createdAt: new Date(),
				User_Role: {
					create: {
						role: 'ADMIN'
					}
				}
			}
		});
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
