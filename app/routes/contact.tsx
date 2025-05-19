import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { Footer as FooterType } from "~/types/sanity";
import NavBar from "~/components/NavBar";
import Footer from "~/components/Footer";
import { useEffect, useRef } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Contact - Reese Latimer" },
    { name: "description", content: "Get in touch with Reese Latimer" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const response = await fetch(request.url.replace(/\/contact\/?$/, '/api/sanity'));
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { 
      footer: data.footer || { socialLinks: [] },
      error: null 
    };
  } catch (error: unknown) {
    console.error('Error fetching data:', error);
    return { 
      footer: { socialLinks: [] },
      error: (error as Error).message || 'Failed to fetch data' 
    };
  }
};

export default function Contact() {
  const { footer, error } = useLoaderData<typeof loader>();
  const typeformContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Typeform embed script
    const script = document.createElement('script');
    script.src = "https://embed.typeform.com/next/embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Clean up script when component unmounts
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* NavBar Component */}
      <NavBar 
        title="Reese Latimer •"
        contactText="Let's get in touch"
        isHomePage={false}
        textColor="text-black"
      />

      {/* Typeform Container */}
      <div 
        ref={typeformContainerRef}
        className="flex-grow w-full mt-20" 
        style={{ height: "90vh" }}
      >
        <div
          data-tf-widget="BFK1B1dt"
          data-tf-opacity="100"
          data-tf-iframe-props="title=Contact Form"
          data-tf-transitive-search-params
          data-tf-medium="snippet"
          data-tf-hidden="utm_source=xxxxx,utm_medium=xxxxx,utm_campaign=xxxxx,utm_term=xxxxx,utm_content=xxxxx"
          style={{ width: "100%", height: "100%" }}
        ></div>
      </div>

      {/* Footer Component */}
      <Footer socialLinks={footer?.socialLinks} />
    </div>
  );
}
