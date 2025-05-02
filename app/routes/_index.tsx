import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import type { Project, Hero } from "~/types/sanity";
import WavesBackground from "~/components/AWaves.jsx";

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
        <div className="absolute top-0 left-0 w-screen h-[50vh] bg-gradient-to-b from-black/80 to-transparent z-[5] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-screen h-[50vh] bg-gradient-to-b from-transparent to-white/100 z-[5] pointer-events-none"></div>

        {/* Top Navigation */}
        <div className="flex justify-between items-center pt-4 relative z-10">
          <p className="text-nav text-hero-white">{heroContent.title}</p>
          <Link to="/contact" className="text-nav text-hero-white">
            {heroContent.contactText}
          </Link>
          <div className="square-design absolute top-0 left-0 z-10"></div>
        </div>

        {/* Divider Line */}
        <div className="w-full h-px bg-hero-white mt-4 relative z-10"></div>

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
              <p className="text-nav-big font-editorial editorial text-hero-black font-light leading-none">
                {heroContent.tagline}
              </p>
            </div>
            <p className="text-nav-big font-editorial editorial text-hero-black font-light leading-none">
              {heroContent.subTagline}
            </p>
          </div>

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