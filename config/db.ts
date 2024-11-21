import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient().$extends(withAccelerate())

export const db = async () => {
    try {
        await prisma.$connect()
        console.log('Conexión a la base de datos establecida')
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error)
    }
}