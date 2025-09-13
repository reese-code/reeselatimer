import { json } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Test Page | Reese Latimer" },
    { name: "description", content: "Test page for development and debugging purposes." },
    { name: "robots", content: "noindex, nofollow" },
  ];
};

export const loader = async () => {
  console.log('Test route loader function started');
  return json({ message: "Hello from test route!" });
};

export default function Test() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Test Route</h1>
      <p>{data.message}</p>
    </div>
  );
}
