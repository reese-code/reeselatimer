import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import type { Project, Hero } from "~/types/sanity";
import WavesBackground from "~/components/AWaves.jsx";
import TargetIcon from "~/components/TargetIcon.jsx";

export const meta: MetaFunction = () => {
  return [
    { title: "Reese Latimer - Portfolio" },
    { name: "description", content: "Portfolio of Reese Latimer" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const response = await fetch(request.url.replace(/\/?$/, '/api/sanity'));
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { 
      projects: data.projects || [], 
      hero: data.hero || null,
      error: null 
    };
  } catch (error: unknown) {
    console.error('Error fetching data:', error);
    return { 
      projects: [], 
      hero: null,
      error: (error as Error).message || 'Failed to fetch data' 
    };
  }
};

export default function Index() {
  const { projects, hero, error } = useLoaderData<typeof loader>();

  const heroContent = hero || {
    title: "Reese Latimer •",
    contactText: "Let's get in touch",
    tagline: "Designer blending strategy",
    subTagline: "and design to achieve online growth.",
    projectsLinkText: "Selected projects"
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative z-10 h-screen flex flex-col px-10 bg-black">
        {/* Background */}
        <WavesBackground />

        {/* Gradient Overlay: black to transparent, positioned above waves but below content */}
        <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-black/80 to-transparent z-[5] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-gradient-to-b from-transparent to-black/80 z-[5] pointer-events-none"></div>

        {/* Top Navigation */}
        
        <div className="flex justify-between items-center pt-4 relative z-10">
          <p className="text-nav text-hero-white">{heroContent.title}</p>
          <Link to="/contact" className="text-nav text-hero-white">
            {heroContent.contactText}
          </Link>
          
        </div>

        {/* Divider Line */}
        <div className="w-full h-px bg-hero-white mt-4 relative z-10">
          <div className="square-design absolute left-0 z-10 nav-detail"></div>
          <div className="square-design absolute right-0 z-10 nav-detail"></div>
        </div>

        {/* Hero Tagline & Link */}
        <div className="mt-auto flex justify-between items-end pb-8 relative z-10">
          <div className="flex flex-col items-end gap-0">
            <div className="flex items-center gap-2 mb-2">
              {hero?.taglineIconUrl && (
                <img 
                  src={hero.taglineIconUrl} 
                  alt="Icon" 
                  className="w-9 h-9 text-hero-white"
                />
              )}
              <p className="text-nav-big font-editorial editorial text-hero-white font-light leading-none">
                {heroContent.tagline}
              </p>
            </div>
            <p className="text-nav-big font-editorial editorial text-hero-white font-light leading-none">
              {heroContent.subTagline}
            </p>
          </div>

          <Link to="#work" className="text-nav text-hero-white border-b border-hero-white">
            {heroContent.projectsLinkText}
          </Link>
        </div>
      </section>




      {/* Projects Section */}
      <section id="work" className="px-10 py-16 bg-white">
        {error && <p className="text-red-500 mb-4">Error: {error}</p>}
        
        {/* Projects Header */}
        <div className="flex items-start mb-8 border-b border-black pb-4 justify-center">
          <h2 className="text-projects-heading font-editorial font-light text-black mr-4">Projects</h2>
          <span className="text-projects-subheading font-editorial font-light text-black">01</span>
        </div>
        
        {/* Featured Project */}
        {projects.length > 0 && (
          <div className="mb-16">
            <img 
              src={projects[0].mainImageUrl || 'https://via.placeholder.com/1200x600'} 
              alt={projects[0].title} 
              className="w-full h-auto object-cover mb-16 rounded-[20px]"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Project Details */}
              <div>
                <div className="flex items-center mb-6">
                  <h3 className="text-project-title font-editorial font-light text-black mr-2">
                    {projects[0].title || "Ship Your Car Safely"}
                  </h3>
                  <TargetIcon className="w-8 h-8 text-black" />
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-4 mb-6">
                  {(projects[0].tags || ["Development lead", "Design assistant", "Digital assets"]).map((tag: string, index: number) => (
                    <span 
                      key={index} 
                      className="px-4 py-2 border border-black rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* Buttons */}
                <div className="flex gap-4 mb-6">
                  {(projects[0].buttons || [
                    { text: "View project" },
                    { text: "Work together" }
                  ]).map((button: { text: string; url?: string }, index: number) => (
                    <button 
                      key={index} 
                      className="px-6 py-3 bg-black text-white rounded-full"
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
              
              {/* Secondary Image */}
              <div>
                <img 
                  src={projects[0].secondaryImageUrl || 'https://via.placeholder.com/600x800'} 
                  alt={`${projects[0].title} detail`} 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Additional Projects */}
        {projects.length > 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(1).map((project: Project) => (
              <div key={project._id} className="bg-gray-100 p-6 rounded">
                <h3 className="text-xl font-semibold mb-2 text-black">{project.title}</h3>
                <p className="text-gray-700">{project.excerpt}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
