import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import Header from "../components/Header";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
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
				title: "Compass Coaching - Navigate Your Future",
			},
			{
				name: "description",
				content:
					"Free career coaching and resources to help students discover their path. Take our comprehensive career assessment, explore resources, and get personalized guidance for college and career success.",
			},
			{
				name: "keywords",
				content:
					"career coaching, career assessment, college guidance, student resources, career exploration, career counseling, aptitude test, career planning, educational resources, student support",
			},
			{
				name: "author",
				content: "Compass Coaching",
			},
			{
				name: "robots",
				content: "index, follow",
			},
			// Open Graph
			{
				property: "og:type",
				content: "website",
			},
			{
				property: "og:title",
				content: "Compass Coaching - Navigate Your Future",
			},
			{
				property: "og:description",
				content:
					"Free career coaching and resources to help students discover their path. Take our comprehensive career assessment and get personalized guidance.",
			},
			{
				property: "og:site_name",
				content: "Compass Coaching",
			},
			// Twitter Card
			{
				name: "twitter:card",
				content: "summary_large_image",
			},
			{
				name: "twitter:title",
				content: "Compass Coaching - Navigate Your Future",
			},
			{
				name: "twitter:description",
				content:
					"Free career coaching and resources to help students discover their path.",
			},
			// Theme
			{
				name: "theme-color",
				content: "#a3e635",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{
				rel: "canonical",
				href: "https://compasscoaching.org",
			},
		],
	}),

	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<Header />
				<main id="main-content">{children}</main>
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
				<Scripts />
			</body>
		</html>
	);
}
