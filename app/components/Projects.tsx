import { Link } from "@remix-run/react";
import type { Project } from "~/types/sanity";
import PixelizeImage from "./PixelizeImage";

interface ProjectsProps {
  projects: Project[];
  error: string | null;
}

// This is a configurable second project that can be easily modified
const secondProject = {
  title: "EDistrict",
  mainImageUrl: "/images/edistrict_main_port.png",
  secondaryImageUrl: "/images/edistrict_stats_port.png",
  tertiaryImageUrl: "/images/edistrict_mobile_port.png",
  tags: ["Design assistant", "Development lead"],
  buttons: [
    { text: "View project", url: "#" },
    { text: "Source code", url: "#" }
  ],
  description: "A complete redesign of a portfolio website with a focus on modern design principles, responsive layouts, and optimized performance. The project showcases skills in both design and development, with careful attention to typography, spacing, and user experience.",
  websiteUrl: "#"
};

export default function Projects({ projects, error }: ProjectsProps) {
  return (
    <section id="work" className="px-3 sm:px-10 py-16 bg-white">
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      
      {/* Projects Header */}
      <div className="flex items-start mb-8 border-b border-black pb-4 justify-center">
        <h2 className="text-projects-heading-small sm:text-projects-heading font-editorial font-light text-black mr-4">Projects</h2>
        <span className="sm:text-projects-subheading text-projects-subheading-small font-editorial font-light text-black">01</span>
      </div>
      
      {/* Featured Project */}
      {projects.length > 0 && (
        <div className="mb-20 sm:mb-40 flex flex-col gap-5">
          <PixelizeImage 
            src={projects[0].mainImageUrl || 'https://via.placeholder.com/1200x600'} 
            alt={projects[0].title || "Project image"} 
            className="w-full h-auto object-cover rounded-[20px]"
          />
          <div className="flex flex-row-reverse">
          <div className="flex flex-col-reverse sm:flex-row gap-5 items-start">
          
            <div className="flex flex-col-reverse w-full">
            {/* Project Details */}
            <div>
              <div className="flex items-center mb-6 mt-3 sm:mt-10">
                <h3 className="text-project-title-small sm:text-project-title font-editorial font-light text-black mr-2">
                  {projects[0].title || "Ship Your Car Safely"}
                </h3>
                
            
               
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-2">
                {(projects[0].tags || ["Development lead", "Design assistant", "Digital assets"]).map((tag: string, index: number) => (
                  <span 
                    key={index} 
                    className="px-4 py-2 border border-[#9F9F9F] text-[#9F9F9F] rounded-full text-type-small"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              {/* Buttons */}
              <div className="flex gap-2 mb-6">
                {(projects[0].buttons || [
                  { text: "View project" },
                  { text: "Work together" }
                ]).map((button: { text: string; url?: string }, index: number) => (
                  <button 
                    key={index} 
                    className="px-6 py-2 bg-black text-white rounded-full text-type-small"
                    onClick={() => button.url && window.open(button.url, '_blank')}
                  >
                    {button.text}
                  </button>
                ))}
              </div>
              
              {/* Description */}
              <p className="mb-6 text-black">
                {projects[0].description || "Lorem ipsum dolor sit amet consectetur. Facilisis eu rutrum phasellus luctus tempus nisl tellus dictumst. Faucibus lorem pellentesque magna sapien placerat consequat adipiscing convallis quisque. Non erat cursus platea at quis purus. Sed mauris ornare auctor dolor adipiscing in nunc erat gravida. Non tellus tortor nibh felis pellentesque."}
              </p>
              
              {/* Website Link */}
              {projects[0].websiteUrl && (
                <a 
                  href={projects[0].websiteUrl} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block border-b border-black text-black"
                >
                  Visit website
                </a>
              )}
            </div>
            
            {/* Secondary and Tertiary Images */}
            <div className="space-y-6">
              {/* Secondary Image */}
              <PixelizeImage 
                src="/images/car_card_port.png" 
                alt="Car card"
                className="w-full h-auto object-cover rounded-[20px]"
              />
              </div>
              </div>
              
              {/* Tertiary Image */}
                <PixelizeImage 
                  src="/images/car_mobile_port.png"
                  alt="Car mobile"
                  className="w-full h-auto object-cover rounded-[20px]"
                />
                
              
            </div>
            </div>
          </div>
        
      )}
      
      {/* Second Project (Configurable) */}
      <div className="mb-16 flex flex-col gap-5">
        <PixelizeImage 
          src={secondProject.mainImageUrl} 
          alt={secondProject.title} 
          className="w-full h-auto object-cover rounded-[20px]"
        />
        <div className="flex flex-row-reverse">
          <div className="flex flex-col-reverse sm:flex-row gap-5 items-start">
            <div className="flex flex-col-reverse w-full">
              {/* Project Details */}
              <div>
                <div className="flex items-center mb-6 mt-3 sm:mt-10">
                  <h3 className="text-project-title-small sm:text-project-title font-editorial font-light text-black mr-2">
                    {secondProject.title}
                  </h3>
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {secondProject.tags.map((tag: string, index: number) => (
                    <span 
                      key={index} 
                      className="px-4 py-2 border border-[#9F9F9F] text-[#9F9F9F] rounded-full text-type-small"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* Buttons */}
                <div className="flex gap-2 mb-6">
                  {secondProject.buttons.map((button: { text: string; url?: string }, index: number) => (
                    <button 
                      key={index} 
                      className="px-6 py-2 bg-black text-white rounded-full text-type-small"
                      onClick={() => button.url && window.open(button.url, '_blank')}
                    >
                      {button.text}
                    </button>
                  ))}
                </div>
                
                {/* Description */}
                <p className="mb-6 text-black">
                  {secondProject.description}
                </p>
                
                {/* Website Link */}
                {secondProject.websiteUrl && (
                  <a 
                    href={secondProject.websiteUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block border-b border-black text-black"
                  >
                    Visit website
                  </a>
                )}
              </div>
              
              {/* Secondary Image */}
              <div className="space-y-6">
                <PixelizeImage 
                  src={secondProject.secondaryImageUrl} 
                  alt="Secondary image"
                  className="w-full h-auto object-cover rounded-[20px]"
                />
              </div>
            </div>
            
            {/* Tertiary Image */}
            <PixelizeImage 
              src={secondProject.tertiaryImageUrl}
              alt="Tertiary image"
              className="w-full h-auto object-cover rounded-[20px]"
            />
          </div>
        </div>
      </div>

      
    </section>
  );
}
