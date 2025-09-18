#!/usr/bin/env tsx
/**
 * Script to set up carbon credit projects in the database
 * Run this to populate your database with sample projects
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sampleProjects = [
  {
    title: "Amazon Rainforest Conservation",
    description: "Protect 1000 hectares of Amazon rainforest from deforestation. Each credit represents 1 ton of CO2 absorbed through forest preservation.",
    location: "Amazon Basin, Acre State",
    country: "Brazil",
    pricePerCredit: 25.00,
    availableCredits: 5000,
    totalCredits: 10000,
    projectImages: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800"
    ],
    // Enhanced fields
    projectType: "Reforestation",
    methodology: "VCS VM0006",
    certificationStandard: "VCS",
    projectDeveloper: "Amazon Conservation Alliance",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2034-12-31"),
    estimatedCO2Reduction: 250000,
    coordinates: "-9.9777, -67.8099",
    additionalBenefits: "Biodiversity preservation, indigenous community support, watershed protection",
    riskFactors: "Climate change, illegal logging, political instability. Mitigation through local community partnerships and government support."
  },
  {
    title: "Solar Farm Development - Kenya",
    description: "Build clean solar energy infrastructure in rural Kenya, replacing diesel generators and providing sustainable power to 500 households.",
    location: "Nairobi County",
    country: "Kenya",
    pricePerCredit: 18.50,
    availableCredits: 3000,
    totalCredits: 5000,
    projectImages: [
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800",
      "https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=800"
    ],
    // Enhanced fields
    projectType: "Solar Energy",
    methodology: "CDM AMS-I.A",
    certificationStandard: "Gold Standard",
    projectDeveloper: "Kenya Solar Initiative",
    startDate: new Date("2024-03-01"),
    endDate: new Date("2029-02-28"),
    estimatedCO2Reduction: 90000,
    coordinates: "-1.2921, 36.8219",
    additionalBenefits: "Rural electrification, job creation, improved healthcare and education access",
    riskFactors: "Equipment theft, weather damage, grid integration challenges. Mitigation through insurance and community engagement."
  },
  {
    title: "Mangrove Restoration Project",
    description: "Restore 500 hectares of mangrove forests in coastal Indonesia. Mangroves are highly effective carbon sinks and protect coastlines.",
    location: "North Sumatra Province",
    country: "Indonesia",
    pricePerCredit: 22.00,
    availableCredits: 4000,
    totalCredits: 8000,
    projectImages: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800"
    ],
    // Enhanced fields
    projectType: "Mangrove Restoration",
    methodology: "VCS VM0033",
    certificationStandard: "VCS",
    projectDeveloper: "Indonesian Coastal Restoration Foundation",
    startDate: new Date("2024-06-01"),
    endDate: new Date("2044-05-31"),
    estimatedCO2Reduction: 176000,
    coordinates: "3.5952, 98.6722",
    additionalBenefits: "Coastal protection, fisheries restoration, marine biodiversity conservation",
    riskFactors: "Sea level rise, storms, aquaculture pressure. Mitigation through community-based management and early warning systems."
  },
  {
    title: "Wind Energy Farm - Texas",
    description: "Large-scale wind energy project generating clean electricity for 10,000 homes in rural Texas.",
    location: "Wise County, Texas",
    country: "United States",
    pricePerCredit: 15.75,
    availableCredits: 2500,
    totalCredits: 6000,
    projectImages: [
      "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800",
      "https://images.unsplash.com/photo-1548337138-e87d889cc369?w=800"
    ],
    // Enhanced fields
    projectType: "Wind Energy",
    methodology: "CAR US WP",
    certificationStandard: "CAR",
    projectDeveloper: "Texas Wind Power LLC",
    startDate: new Date("2024-09-01"),
    endDate: new Date("2034-08-31"),
    estimatedCO2Reduction: 120000,
    coordinates: "33.1951, -97.7521",
    additionalBenefits: "Local tax revenue, rural economic development, energy independence",
    riskFactors: "Wind variability, grid integration, equipment failure. Mitigation through advanced forecasting and maintenance programs."
  },
  {
    title: "Community Reforestation - India",
    description: "Plant native trees on degraded agricultural land in rural India, involving local communities in sustainable forest management.",
    location: "Maharashtra State",
    country: "India",
    pricePerCredit: 12.25,
    availableCredits: 6000,
    totalCredits: 15000,
    projectImages: [
      "https://images.unsplash.com/photo-1441906363162-903afd0d3d52?w=800",
      "https://images.unsplash.com/photo-1574482620772-7b4c2e5e8e2d?w=800"
    ],
    // Enhanced fields
    projectType: "Afforestation",
    methodology: "VCS VM0005",
    certificationStandard: "VCS",
    projectDeveloper: "Green India Foundation",
    startDate: new Date("2024-04-15"),
    endDate: new Date("2054-04-14"),
    estimatedCO2Reduction: 375000,
    coordinates: "19.7515, 75.7139",
    additionalBenefits: "Soil restoration, water table improvement, rural employment, biodiversity enhancement",
    riskFactors: "Drought, pests, human-wildlife conflict. Mitigation through drought-resistant species and community training programs."
  }
];

async function setupProjects() {
  console.log("🌱 Setting up carbon credit projects...\n");

  try {
    // Clear existing projects
    await prisma.project.deleteMany();
    console.log("🗑️ Cleared existing projects\n");

    for (const projectData of sampleProjects) {
      console.log(`Creating project: ${projectData.title}`);
      
      // Create project in database with all the enhanced fields
      const project = await prisma.project.create({
        data: {
          title: projectData.title,
          description: projectData.description,
          location: projectData.location,
          country: projectData.country,
          pricePerCredit: projectData.pricePerCredit,
          availableCredits: projectData.availableCredits,
          totalCredits: projectData.totalCredits,
          projectImages: projectData.projectImages,
          // Enhanced carbon credit fields
          projectType: projectData.projectType,
          methodology: projectData.methodology,
          certificationStandard: projectData.certificationStandard,
          projectDeveloper: projectData.projectDeveloper,
          startDate: projectData.startDate,
          endDate: projectData.endDate,
          estimatedCO2Reduction: projectData.estimatedCO2Reduction,
          coordinates: projectData.coordinates,
          additionalBenefits: projectData.additionalBenefits,
          riskFactors: projectData.riskFactors,
        }
      });

      console.log(`✅ Created project: ${project.title} (ID: ${project.id})`);
      console.log(`🌍 Type: ${project.projectType} | Standard: ${project.certificationStandard}`);
      console.log(`💰 Price: $${project.pricePerCredit} per credit`);
      console.log(`📊 Available: ${project.availableCredits}/${project.totalCredits} credits`);
      console.log(`🏭 CO₂ Reduction: ${project.estimatedCO2Reduction.toLocaleString()} tonnes`);
      console.log("─".repeat(70));
    }

    console.log("\n🎉 Successfully set up all carbon credit projects!");
    console.log("\n📋 Summary:");
    
    const allProjects = await prisma.project.findMany();
    console.log(`Total projects: ${allProjects.length}`);
    console.log(`Total available credits: ${allProjects.reduce((sum, p) => sum + p.availableCredits, 0).toLocaleString()}`);
    console.log(`Total CO₂ reduction potential: ${allProjects.reduce((sum, p) => sum + p.estimatedCO2Reduction, 0).toLocaleString()} tonnes`);
    console.log(`Price range: $${Math.min(...allProjects.map(p => p.pricePerCredit))} - $${Math.max(...allProjects.map(p => p.pricePerCredit))}`);

    console.log("\n🔗 Next steps:");
    console.log("1. Visit your app's /projects page to see the projects");
    console.log("2. Test the enhanced /addProject form to add new projects");
    console.log("3. Set up products in Dodo Payments dashboard for payment integration");

  } catch (error) {
    console.error("❌ Error setting up projects:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the setup
setupProjects().catch(console.error);
