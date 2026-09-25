import {
	siArgo,
	siClerk,
	siConvex,
	siDocker,
	siEnvoyproxy,
	siGo,
	siGoogleappsscript,
	siGrafana,
	siHtmx,
	siKubernetes,
	siNextdotjs,
	siOpentelemetry,
	siRubyonrails,
	siTailwindcss,
	siTerraform,
	siTypescript,
	siVictoriametrics,
	type SimpleIcon,
} from 'simple-icons';

/** Stack names as written in src/content/projects.yaml, mapped to their Simple Icons. */
const icons: Record<string, SimpleIcon> = {
	'Argo CD': siArgo,
	Clerk: siClerk,
	Convex: siConvex,
	Docker: siDocker,
	'Envoy Gateway': siEnvoyproxy,
	Go: siGo,
	'Google Apps Script': siGoogleappsscript,
	Grafana: siGrafana,
	HTMX: siHtmx,
	Kubernetes: siKubernetes,
	'Next.js': siNextdotjs,
	OpenTelemetry: siOpentelemetry,
	'Ruby on Rails': siRubyonrails,
	'Tailwind CSS': siTailwindcss,
	Terraform: siTerraform,
	TypeScript: siTypescript,
	VictoriaMetrics: siVictoriametrics,
};

/** SVG path (24×24 viewBox) for a tool, or undefined if Simple Icons doesn't have it. */
export function techIconPath(name: string): string | undefined {
	return icons[name]?.path;
}
