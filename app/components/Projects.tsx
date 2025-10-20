import type { Project } from "~/types/sanity";
import PixelizeImage from "./PixelizeImage";

interface ProjectsProps {
  projects: Project[];
  error: string | null;
}

// No hardcoded projects - all projects now come from Sanity

export default function Projects({ projects, error }: ProjectsProps) {
  // Debug: Log what projects we're getting
  console.log('Projects received:', projects);
  
  return (
    <section id="work" className="px-3 md:px-10 py-16 bg-white">
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      
      {/* Debug: Show project count */}
      <div className="mb-4 text-sm text-gray-600">
        Found {projects.length} project(s): {projects.map(p => p.title).join(', ')}
      </div>
      
      {/* Projects Header */}
      <div className="flex items-start mb-8 border-b border-black pb-0 justify-center">
        <h2 
          className="text-projects-heading-small md:text-projects-heading font-editorial font-light text-black mr-4"
        >
          Projects
        </h2>
        <span 
          className="md:text-projects-subheading text-projects-subheading-small font-editorial font-light text-black"
        >
          01
        </span>
      </div>
      
      {/* All Projects from Sanity */}
      {projects.map((project: Project, projectIndex: number) => {
        // Define fallback images for specific projects
        const getProjectImages = (project: Project) => {
          if (project.title === "CIAO") {
            return {
              main: project.mainImageUrl || "/images/ciao_main.png",
              secondary: project.secondaryImageUrl || "/images/ciao_secondary.png", 
              tertiary: project.tertiaryImageUrl || "/images/ciao_mobile.png"
            };
          }
          return {
            main: project.mainImageUrl || "/images/placeholder.png",
            secondary: project.secondaryImageUrl,
            tertiary: project.tertiaryImageUrl
          };
        };

        const projectImages = getProjectImages(project);
        
        return (
        <div key={project._id} className={`${projectIndex === 0 ? 'mb-20 md:mb-40' : 'mb-16'} flex flex-col gap-5`}>
          <PixelizeImage 
            src={projectImages.main} 
            alt={project.title || "Project image"} 
            className="w-full h-auto object-cover rounded-[20px]"
          />
          <div className="flex flex-row-reverse">
            <div className="flex flex-col-reverse md:flex-row gap-5 items-start">
              <div className="flex flex-col-reverse w-full">
                {/* Project Details */}
                <div>
                  <div className="flex items-center mb-6 mt-3 md:mt-10">
                    <h3 className="text-project-title-small md:text-project-title font-editorial font-light text-black mr-2">
                      {project.title}
                    </h3>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(project.tags || []).map((tag: string, index: number) => (
                      <span 
                        key={index} 
                        className="px-4 py-2 border border-[#9F9F9F] text-[#9F9F9F] rounded-btn-bdrd text-type-small"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Standardized Buttons */}
                  <div className="flex gap-2 mb-6">
                    <button 
                      className="px-6 py-2 bg-black text-white rounded-btn-bdrd text-type-small"
                      onClick={() => {
                        const projectUrl = project.slug ? `/${project.slug}` : project.websiteUrl || '#';
                        if (projectUrl.startsWith('/')) {
                          window.location.href = projectUrl;
                        } else {
                          window.open(projectUrl, '_blank');
                        }
                      }}
                    >
                      View Project
                    </button>
                    <button 
                      className="px-6 py-2 bg-black text-white rounded-btn-bdrd text-type-small"
                      onClick={() => window.location.href = '/contact'}
                    >
                      Work Together
                    </button>
                  </div>
                  
                  {/* Description */}
                  {project.description && (
                    <p className="mb-6 text-black text-type-small">
                      {project.description}
                    </p>
                  )}
                  
                  {/* Website Link */}
                  {project.websiteUrl && (
                    <a 
                      href={project.websiteUrl} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block border-b border-black text-black"
                    >
                      {project.websiteUrl.startsWith('/') ? 'View project' : 'Visit website'}
                    </a>
                  )}
                </div>
                
                {/* Secondary Image */}
                {projectImages.secondary && (
                  <div className="space-y-6">
                    <PixelizeImage 
                      src={projectImages.secondary} 
                      alt={`${project.title} secondary image`}
                      className="w-full h-auto object-cover rounded-[20px]"
                    />
                  </div>
                )}
              </div>
              
              {/* Tertiary Image */}
              {projectImages.tertiary && (
                <PixelizeImage 
                  src={projectImages.tertiary}
                  alt={`${project.title} tertiary image`}
                  className="w-full h-auto object-cover rounded-[20px]"
                />
              )}
            </div>
          </div>
        </div>
        );
      })}
      
    </section>
  );
}
