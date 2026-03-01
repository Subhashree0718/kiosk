import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const DEPARTMENTS = [
    { name: 'Electricity / विद्युत', code: 'ELEC', description: 'Electricity Department Grievances' },
    { name: 'Water Supply / जल सेवा', code: 'WATER', description: 'Water Department Grievances' },
    { name: 'Gas Service / गैस सेवा', code: 'GAS', description: 'Gas Department Grievances' },
    { name: 'Municipal / नगर निगम', code: 'MUNI', description: 'Municipality Grievances' }
];

async function main() {
    console.log('Ensuring departments exist...');
    for (const dept of DEPARTMENTS) {
        await prisma.department.upsert({
            where: { code: dept.code },
            update: { name: dept.name, description: dept.description },
            create: dept
        });
        console.log(`- Upserted ${dept.code}: ${dept.name}`);
    }
    console.log('Done.');
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
