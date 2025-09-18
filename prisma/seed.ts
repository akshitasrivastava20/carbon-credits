import { PrismaClient, UsageType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const emissionFactors = [
    { type: UsageType.ELECTRICITY, factor: 0.82, unit: "kg CO₂ per kWh" },
    { type: UsageType.DIESEL, factor: 2.68, unit: "kg CO₂ per liter" },
    { type: UsageType.PETROL, factor: 2.31, unit: "kg CO₂ per liter" },
    { type: UsageType.NATURAL_GAS, factor: 2.75, unit: "kg CO₂ per m³" },
  ];

  for (const factor of emissionFactors) {
    await prisma.emissionFactor.upsert({
      where: { type: factor.type },
      update: { factor: factor.factor, unit: factor.unit },
      create: factor,
    });
  }
}

main()
  .then(() => console.log("Emission factors seeded ✅"))
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
