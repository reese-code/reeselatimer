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
    { text: "View website", url: "https://edistrict.com/" },
    { text: "Work together", url: "/contact" }
  ],
  description: "A modern redesign for a commercial office space platform, focused on clean design, intuitive navigation, and responsive performance. The site was restructured to improve user flow, making it easier for potential tenants to explore leasing opportunities, amenities, and location benefits. With attention to clarity and visual hierarchy, the result is a refined user experience that communicates professionalism and accessibility across devices.",
  websiteUrl: "#"
};

export default function Projects({ projects, error }: ProjectsProps) {
  return (
    <section id="work" className="px-3 md:px-10 py-16 bg-white">
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      
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
      
      {/* Featured Project */}
      {projects.length > 0 && (
        <div className="mb-20 md:mb-40 flex flex-col gap-5">
          <PixelizeImage 
            src="/images/big_image_car.png" 
            alt={projects[0].title || "Project image"} 
            className="w-full h-auto object-cover rounded-[20px]"
          />
          <div className="flex flex-row-reverse">
          <div className="flex flex-col-reverse md:flex-row gap-5 items-start">
          
            <div className="flex flex-col-reverse w-full">
            {/* Project Details */}
            <div>
              <div className="flex items-center mb-6 mt-3 md:mt-10">
                <h3 className="text-project-title-small md:text-project-title font-editorial font-light text-black mr-2">
                  {projects[0].title || "Ship Your Car Safely"}
                </h3>
                
            
               
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-2">
                {(projects[0].tags || ["Development lead", "Design assistant", "Digital assets"]).map((tag: string, index: number) => (
                  <span 
                    key={index} 
                    className="px-4 py-2 border border-[#9F9F9F] text-[#9F9F9F] rounded-btn-bdrd "
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              {/* Buttons */}
              <div className="flex gap-2 mb-6">
                {(projects[0].buttons || [
                  { text: "View website", url: "https://shipyourcarsafely.com/" },
                  { text: "Work together", url: "/contact" },
                 
                ]).map((button: { text: string; url?: string }, index: number) => (
                  <button 
                    key={index} 
                    className="px-6 py-2 bg-black text-white rounded-btn-bdrd text-type-small"
                    onClick={() => button.url && window.open(button.url, '_blank')}
                  >
                    {button.text}
                  </button>
                ))}
              </div>
              
              {/* Description */}
              <p className="mb-6 text-black text-type-small">
                {projects[0].description || "From strategy to execution, I delivered end-to-end web development and web design for Ship Your Car Safely, a nationwide auto transport service. The site was built with performance, clarity, and conversion in mind. I integrated AI-powered image generation to create custom visuals tailored to the brand’s identity, enhancing user trust and engagement. The responsive layout ensures a seamless experience across devices, while persistent contact elements—like a sticky phone number and always-accessible quote form—maximize lead capture and make scheduling effortless. The result is a fully optimized, conversion-ready website built to scale."}
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
          <div className="flex flex-col-reverse md:flex-row gap-5 items-start">
            <div className="flex flex-col-reverse w-full">
              {/* Project Details */}
              <div>
                <div className="flex items-center mb-6 mt-3 md:mt-10">
                  <h3 className="text-project-title-small md:text-project-title font-editorial font-light text-black mr-2">
                    {secondProject.title}
                  </h3>
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {secondProject.tags.map((tag: string, index: number) => (
                    <span 
                      key={index} 
                      className="px-4 py-2 border border-[#9F9F9F] text-[#9F9F9F] rounded-btn-bdrd text-type-small"
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
                      className="px-6 py-2 bg-black text-white rounded-btn-bdrd text-type-small"
                      onClick={() => button.url && window.open(button.url, '_blank')}
                    >
                      {button.text}
                    </button>
                  ))}
                </div>
                
                {/* Description */}
                <p className="mb-6 text-black text-type-small">
                  {secondProject.description}
                </p>
                
                
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
