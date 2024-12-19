import { PrismaClient } from '@prisma/client'

interface CustomNodeJsGlobal {
    prisma: PrismaClient
    log: ['query', 'info', 'warn', 'error'],

}

declare const global: CustomNodeJsGlobal

const prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV === 'development') global.prisma = prisma

export default prisma