import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Scripts, Outlet, Link } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ClerkProvider } from "@clerk/tanstack-react-start";

import Header from "../components/Header";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Compass Coaching | Navigate Your Future",
      },
      {
        name: "description",
        content:
          "Free career coaching and resources to help students discover their path. Take our comprehensive career assessment, explore resources, and get personalized guidance for college and career success.",
      },
      {
        name: "keywords",
        content:
          "career coaching, career assessment, college guidance, student resources, career exploration, aptitude test, career planning, educational resources, student support",
      },
      {
        name: "author",
        content: "Compass Coaching",
      },
      {
        name: "application-name",
        content: "Compass Coaching",
      },
      {
        name: "robots",
        content: "index, follow",
      },
      // Theme
      {
        name: "theme-color",
        content: "#a3e635",
      },
    ],
    links: [
      {
        rel: "icon",
        href: "/favicon.ico",
        sizes: "any",
      },
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/discord-icon.svg",
      },
      {
        rel: "icon",
        type: "image/png",
        href: "/discord-icon.png",
      },
      {
        rel: "apple-touch-icon",
        href: "/discord-icon.png",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Compass Coaching",
          "alternateName": "Compass Coaching PA",
          "url": "https://compasscoachingpa.org",
        }),
      },
    ],
  }),

  shellComponent: RootDocument,
});

function RootComponent() {
  return (
    <>
      <Outlet />
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </>
  );
}

function NotFoundComponent() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-stone-50 to-stone-100">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-9xl font-bold text-lime-600">404</h1>
          <h2 className="text-3xl font-bold text-stone-700">Page Not Found</h2>
          <p className="text-lg text-stone-600 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 text-base font-semibold text-white bg-lime-600 hover:bg-lime-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Go Home
          </Link>
          <Link
            to="/careers"
            className="inline-flex items-center px-6 py-3 text-base font-semibold text-lime-700 bg-white hover:bg-stone-50 rounded-lg shadow-md hover:shadow-lg border-2 border-lime-600 transition-all duration-200"
          >
            Explore Careers
          </Link>
        </div>

        <div className="pt-8 border-t border-stone-200">
          <p className="text-sm text-stone-500">
            Need help? <Link to="/contact" className="text-lime-600 hover:text-lime-700 font-semibold underline">Contact us</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <ClerkProvider>
          <Header />
          <main id="main-content">{children}</main>
        </ClerkProvider>
        {import.meta.env.DEV && (
          <TanStackDevtools
            config={{
              position: "bottom-right",
            }}
            plugins={[
              {
                name: "Tanstack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        )}
        <Scripts />
      </body>
    </html>
  );
}
