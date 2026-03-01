import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const depts = await prisma.department.findMany({
        orderBy: { name: 'asc' }
    });
    console.log('Current Departments:', JSON.stringify(depts, null, 2));
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
