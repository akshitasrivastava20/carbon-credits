import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Mock API - Received request body:', JSON.stringify(body, null, 2));

    // Mock recommendations data
    const mockResponse = {
      recommendations: [
        {
          id: 1,
          name: "Amazon Rainforest Conservation",
          type: "Forest Protection",
          location: "Brazil",
          description: "Protect 10,000 hectares of Amazon rainforest from deforestation",
          pricePerCredit: 25,
          availableCredits: 5000,
          verificationStandard: "VCS",
          impactMetrics: {
            co2Reduced: "50,000 tons/year",
            biodiversityProtected: "500 species",
            communityJobs: 150
          },
          matchScore: 0.95,
          matchReason: "High carbon offset potential matches your company's energy usage patterns"
        },
        {
          id: 2,
          name: "Solar Farm Development",
          type: "Renewable Energy",
          location: "California, USA",
          description: "100MW solar farm providing clean energy to local communities",
          pricePerCredit: 30,
          availableCredits: 3000,
          verificationStandard: "Gold Standard",
          impactMetrics: {
            co2Reduced: "75,000 tons/year",
            energyGenerated: "200 GWh/year",
            homesSupplied: 45000
          },
          matchScore: 0.88,
          matchReason: "Renewable energy aligns with IT sector sustainability goals"
        },
        {
          id: 3,
          name: "Mangrove Restoration",
          type: "Blue Carbon",
          location: "Philippines",
          description: "Restore coastal mangrove ecosystems for carbon sequestration",
          pricePerCredit: 35,
          availableCredits: 2000,
          verificationStandard: "VCS",
          impactMetrics: {
            co2Reduced: "30,000 tons/year",
            coastlineProtected: "50 km",
            fishermenSupported: 200
          } ,  
          matchScore: 0.82,
          matchReason: "Coastal protection provides long-term carbon storage suitable for medium-scale operations"
        }
      ],
      carbonFootprintAnalysis: {
        totalEmissions: 1500,
        estimatedAnnualEmissions: 1500,
        offsetRecommendation: 1200,
        emissionsByCategory: {
          energy: 900,
          transportation: 600
        },
        comparisonToIndustryAverage: "15% above average for IT companies of similar size",
        reductionPotential: "Up to 40% reduction possible with renewable energy transition"
      },
      sustainabilityInsights: {
        currentScore: 6.5,
        industryBenchmark: 7.2,
        recommendations: [
          "Consider transitioning to renewable energy sources",
          "Implement energy-efficient technologies",
          "Offset remaining emissions through verified carbon credits"
        ],
        improvementAreas: [
          "Energy efficiency",
          "Transportation optimization",
          "Supply chain sustainability"
        ]
      }
    };

    console.log('Mock API - Returning response:', JSON.stringify(mockResponse, null, 2));
    return NextResponse.json(mockResponse);

  } catch (error) {
    console.error('Mock API error:', error);
    return NextResponse.json(
      { 
        error: 'Mock API failed', 
        message: error instanceof Error ? error.message : 'Unknown error',
        recommendations: [],
        carbonFootprintAnalysis: null,
        sustainabilityInsights: null
      },
      { status: 500 }
    );
  }
}
