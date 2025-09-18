// lib/calculateCredits.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function calculateCarbonCredits(companyId: string) {
  // 1. Get all usage for this company
  const usages = await prisma.usage.findMany({
    where: { companyId },
  });

  // 2. Get emission factors
  const factors = await prisma.emissionFactor.findMany();
  const factorMap = Object.fromEntries(
    factors.map((f) => [f.type, f.factor])
  );

  // 3. Calculate total emissions
  let totalKgCO2 = 0;
  for (const u of usages) {
    const factor = factorMap[u.type];
    if (factor) {
      totalKgCO2 += u.amount * factor;
    }
  }

  // 4. Convert to tCO₂e
  const totalTons = totalKgCO2 / 1000;

  // 5. Credits = ceil of total tons
  const creditsNeeded = Math.ceil(totalTons);

  return { totalKgCO2, totalTons, creditsNeeded };
}
