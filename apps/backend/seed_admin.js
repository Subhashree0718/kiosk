import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding ADMIN user for Kiosk portal testing...');
    const adminMobile = '9999999999';

    const user = await prisma.user.upsert({
        where: { mobile: adminMobile },
        update: { role: 'ADMIN' },
        create: {
            mobile: adminMobile,
            name: 'Suvidha System Admin',
            role: 'ADMIN',
        },
    });

    console.log(`Successfully ensured user details:\nMobile: ${user.mobile}\nRole: ${user.role}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
