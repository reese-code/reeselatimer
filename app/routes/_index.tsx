import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import type { Project, Hero } from "~/types/sanity";

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

  // Default hero content in case Sanity data is not available yet
  const heroContent = hero || {
    title: "Reese Latimer •",
    contactText: "Let's get in touch",
    tagline: "Designer blending strategy",
    subTagline: "and design to achieve online growth.",
    projectsLinkText: "Selected projects"
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col px-10 bg-black">
        {/* Top Navigation */}
        <div className="flex justify-between items-center pt-4">
          <p className="text-nav text-hero-white">{heroContent.title}</p>
          <Link to="/contact" className="text-nav text-hero-white">
            {heroContent.contactText}
          </Link>
        </div>

        {/* Horizontal Lines */}
        <div className="w-full h-px bg-hero-white mt-4"></div>
       

        {/* Bottom Content */}
        <div className="mt-auto flex justify-between items-end pb-8">
          {/* Tagline */}
          <div className="flex flex-col items-end">
            <div className=" flex items-center gap-2 mb-2">
              {hero?.taglineIconUrl && (
                <img 
                  src={hero.taglineIconUrl} 
                  alt="Icon" 
                  className="w-9 h-9 text-hero-white"
                />
              )}
              <p className="text-nav-big font-editorial text-hero-white font-light">{heroContent.tagline}</p>
            </div>
            <p className="text-nav-big font-editorial text-hero-white font-light">{heroContent.subTagline}</p>
          </div>

          {/* Projects Link */}
          <Link to="#work" className="text-nav text-hero-white border-b border-hero-white">
            {heroContent.projectsLinkText}
          </Link>
        </div>
      </section>

      {/* Projects Section */}
      <section id="work" className="container mx-auto px-4 py-16">
        {error && <p className="text-red-500 mb-4">Error: {error}</p>}
        <h2 className="text-3xl font-bold mb-8 text-hero-white">Work</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: Project) => (
            <li key={project._id} className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2 text-hero-white">{project.title}</h3>
              <p className="text-gray-400">{project.excerpt}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
