"use client";
import { useState } from "react";
import { ArrowRight, Leaf, MapPin, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import InvestmentModal from "@/components/InvestmentModal";

interface CarbonProject {
  id: string;
  title: string;
  summary: string;
  author: string; // This will be the location
  published: string;
  image: string;
  tags?: string[];
  // Additional fields for carbon projects
  pricePerCredit: number;
  availableCredits: number;
  totalCredits: number;
  location: string;
}

interface CarbonProjectsDisplayProps {
  heading?: string;
  description?: string;
  projects?: CarbonProject[];
}

const CarbonProjectsDisplay = ({
  heading = "Carbon Credit Projects",
  description = "Invest in verified environmental projects that generate carbon credits.",
  projects = [],
}: CarbonProjectsDisplayProps) => {
  const [selectedProject, setSelectedProject] = useState<CarbonProject | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInvestClick = (project: CarbonProject) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <>
      <section className="py-32">
        <div className="container flex flex-col items-center gap-16">
          <div className="text-center">
            <h2 className="mx-auto mb-6 text-pretty text-3xl font-semibold text-gray-900 md:text-4xl lg:max-w-3xl">
              {heading}
            </h2>
            <p className="mx-auto max-w-2xl text-gray-700 md:text-lg">
              {description}
            </p>
          </div>

          <div className="grid gap-y-10 sm:grid-cols-12 sm:gap-y-12 md:gap-y-16 lg:gap-y-20">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="order-last border-0 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 sm:order-first sm:col-span-12 lg:col-span-10 lg:col-start-2"
              >
                <div className="grid gap-y-6 sm:grid-cols-10 sm:gap-x-5 sm:gap-y-0 md:items-center md:gap-x-8 lg:gap-x-12 p-6">
                  <div className="sm:col-span-5">
                    {/* Tags */}
                    <div className="mb-4 md:mb-6">
                      <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wider">
                        {project.tags?.map((tag) => (
                          <span 
                            key={tag} 
                            className="px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-semibold text-gray-900 md:text-2xl lg:text-3xl mb-4">
                      {project.title}
                    </h3>

                    {/* Summary */}
                    <p className="text-gray-700 mb-4">
                      {project.summary}
                    </p>

                    {/* Project Details */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="size-4 mr-2 text-gray-500" />
                        <span>{project.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="size-4 mr-2 text-gray-500" />
                        <span>${project.pricePerCredit} per credit</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Leaf className="size-4 mr-2 text-gray-500" />
                        <span>{project.availableCredits.toLocaleString()} of {project.totalCredits.toLocaleString()} credits available</span>
                      </div>
                    </div>

                    {/* Publication Date */}
                    <div className="flex items-center space-x-4 text-sm mb-6">
                      <span className="text-gray-500">Published {project.published}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleInvestClick(project)}
                        className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200"
                      >
                        <DollarSign className="mr-2 size-4" />
                        <span>Invest Now</span>
                      </button>
                      
                      <a
                        href={`/projects/${project.id}`}
                        className="inline-flex items-center font-semibold text-gray-700 hover:text-green-600 transition-colors duration-200"
                      >
                        <span>View Details</span>
                        <ArrowRight className="ml-2 size-4" />
                      </a>
                    </div>
                  </div>

                  {/* Project Image */}
                  <div className="order-first sm:order-last sm:col-span-5">
                    <div className="aspect-[16/9] overflow-clip rounded-lg border border-gray-200">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {projects.length === 0 && (
            <div className="text-center py-12">
              <Leaf className="mx-auto size-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Projects Available</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                There are currently no carbon credit projects available for investment. Check back soon for new opportunities!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Investment Modal */}
      {selectedProject && (
        <InvestmentModal
          isOpen={isModalOpen}
          onClose={closeModal}
          project={{
            id: selectedProject.id,
            title: selectedProject.title,
            pricePerCredit: selectedProject.pricePerCredit,
            availableCredits: selectedProject.availableCredits,
            location: selectedProject.location,
          }}
        />
      )}
    </>
  );
};

export { CarbonProjectsDisplay };
