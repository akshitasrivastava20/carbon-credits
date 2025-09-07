require('dotenv').config();
const { PrismaClient } = require('../src/generated/prisma');

const prisma = new PrismaClient();

const sampleProjects = [
  {
    title: "Amazon Rainforest Conservation",
    description: "Protecting 10,000 hectares of pristine rainforest in Brazil. This project prevents deforestation and supports local indigenous communities while generating verified carbon credits through forest conservation.",
    location: "Amazon Basin, Brazil",
    pricePerCredit: 25.00,
    totalCredits: 50000,
    availableCredits: 50000,
    projectImages: [
      "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800"
    ],
    projectType: "Forest Conservation",
    methodology: "VCS VM0006",
    certificationStandard: "VCS",
    projectDeveloper: "Amazon Conservation Alliance",
    country: "Brazil",
    estimatedCO2Reduction: 125000.0,
    holderType: "ORGANIZATION",
    paymentEmail: "amazon@example.com"
  },
  {
    title: "Solar Farm Initiative",
    description: "Large-scale solar energy project generating clean electricity and carbon credits. Located in sunny regions with optimal solar conditions, this project offsets 100,000 tons of CO2 annually.",
    location: "Arizona, USA",
    pricePerCredit: 30.00,
    totalCredits: 75000,
    availableCredits: 75000,
    projectImages: [
      "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800",
      "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800"
    ],
    projectType: "Solar Energy",
    methodology: "CDM AMS-I.D",
    certificationStandard: "Gold Standard",
    projectDeveloper: "SolarTech Solutions",
    country: "United States",
    estimatedCO2Reduction: 100000.0,
    holderType: "COMPANY",
    paymentEmail: "solar@example.com"
  },
  {
    title: "Mangrove Restoration Project",
    description: "Restoring coastal mangrove ecosystems that serve as carbon sinks and protect coastal communities from storms. This project combines environmental restoration with community development.",
    location: "Philippines",
    pricePerCredit: 22.00,
    totalCredits: 30000,
    availableCredits: 30000,
    projectImages: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800"
    ],
    projectType: "Coastal Restoration",
    methodology: "VCS VM0033",
    certificationStandard: "VCS",
    projectDeveloper: "Coastal Communities Foundation",
    country: "Philippines",
    estimatedCO2Reduction: 45000.0,
    holderType: "ORGANIZATION",
    paymentEmail: "mangrove@example.com"
  }
];

async function addSampleProjects() {
  try {
    console.log('🌱 Adding sample carbon credit projects...');
    
    for (const projectData of sampleProjects) {
      const project = await prisma.project.create({
        data: projectData
      });
      console.log(`✅ Created project: ${project.title}`);
    }
    
    console.log('\n🎉 Successfully added sample projects!');
    console.log('Visit your website to see them: http://localhost:3000/projects');
    
  } catch (error) {
    console.error('❌ Error adding projects:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addSampleProjects();
