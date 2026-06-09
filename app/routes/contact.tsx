import type { MetaFunction } from "@remix-run/node";
import NavBar from "~/components/NavBar";
import { useEffect, useRef, useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Contact | Reese Latimer" },
    { name: "description", content: "Get in touch with Reese Latimer for web design, development, and branding projects. Let's discuss your next digital project and bring your vision to life." },
  ];
};

export default function Contact() {
  const typeformContainerRef = useRef<HTMLDivElement>(null);
  const [isFormActive, setIsFormActive] = useState(false);

  useEffect(() => {
    // Load Typeform embed script
    const script = document.createElement('script');
    script.src = "https://embed.typeform.com/next/embed.js";
    script.async = true;
    document.body.appendChild(script);

    // Simple approach: detect any click on the Typeform container
    const handleContainerClick = () => {
      // When user clicks anywhere in the typeform, assume they're starting the form
      setTimeout(() => {
        setIsFormActive(true);
      }, 1000); // Delay to allow form to initialize
    };

    // Add click listener to the container
    if (typeformContainerRef.current) {
      typeformContainerRef.current.addEventListener('click', handleContainerClick);
    }

    return () => {
      // Clean up
      document.body.removeChild(script);
      if (typeformContainerRef.current) {
        typeformContainerRef.current.removeEventListener('click', handleContainerClick);
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* NavBar Component */}
      <NavBar 
        title="Reese Latimer •"
        contactText="Let's get in touch"
        isHomePage={false}
      />

      {/* Typeform Container */}
      <div 
        ref={typeformContainerRef}
        className={`flex-grow w-full transition-all duration-500 ${isFormActive ? 'h-0 mt-0' : 'h-[60vh] mt-20'}`}
      >
        <div
          data-tf-widget="BFK1B1dt"
          data-tf-opacity="100"
          data-tf-iframe-props="title=Contact Form"
          data-tf-transitive-search-params
          data-tf-medium="snippet"
          data-tf-hidden="utm_source=xxxxx,utm_medium=xxxxx,utm_campaign=xxxxx,utm_term=xxxxx,utm_content=xxxxx"
          style={{ width: "100%", height: "80%" }}
        ></div>
      </div>

    </div>
  );
}
