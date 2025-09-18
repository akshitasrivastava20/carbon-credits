const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  
  try {
    const factors = await prisma.emissionFactor.findMany();
    console.log('📊 Current Emission Factors in Database:');
    console.log('==========================================');
    factors.forEach(f => {
      console.log(`✅ ${f.type}: ${f.factor} ${f.unit}`);
    });
    console.log('==========================================');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
