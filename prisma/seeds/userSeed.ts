/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()


async function main() {
    const password = await bcrypt.hash('admin123', 10)

    const user = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            name: 'Administrador',
            email: 'admin@exemplo.com',
            password,
            createdBy: 1,
        },
    })

    console.log({ user })
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    }) 