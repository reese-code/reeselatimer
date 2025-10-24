import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { TransitionProvider } from "./components/PageTransition";
import type { LinksFunction } from "@remix-run/node";

import tailwindStyles from "./styles/tailwind.css?url";
import indexStyles from "./styles/index.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwindStyles },
  { rel: "stylesheet", href: indexStyles },
  // Preload critical fonts
  { rel: "preload", href: "/fonts/neuemontreal-medium.otf", as: "font", type: "font/otf", crossOrigin: "anonymous" },
  { rel: "preload", href: "/fonts/PPEditorialNew-Ultralight.otf", as: "font", type: "font/otf", crossOrigin: "anonymous" },
  { rel: "preload", href: "/fonts/PPLocomotiveNew.otf", as: "font", type: "font/otf", crossOrigin: "anonymous" },
  // DNS prefetch for external resources
  { rel: "dns-prefetch", href: "//cdn.sanity.io" },
  { rel: "dns-prefetch", href: "//embed.typeform.com" },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <TransitionProvider>
          <Outlet />
        </TransitionProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
