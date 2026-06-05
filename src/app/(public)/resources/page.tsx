import Link from "next/link";

import { getAllRoadmapResources, getRoadmapMeta } from "~/lib/roadmap";
import { getSession } from "~/server/better-auth/server";
import { RoadmapResources } from "./_components/roadmap-resources";
import { ResourceList } from "./_components/resource-list";

export default async function ResourcesPage() {
	const [meta, session, roadmapItems] = await Promise.all([
		getRoadmapMeta(),
		getSession(),
		getAllRoadmapResources(),
	]);
	const checkpoints = meta.nodes.filter((n) => n.type === "checkpoint");

	return (
		<div className="container mx-auto max-w-3xl px-4 py-8">
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Resources</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						Learning materials from the roadmap and community submissions.
					</p>
				</div>
				{session ? (
					<Link
						className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
						href="/resources/new"
					>
						Submit Resource
					</Link>
				) : (
					<Link
						className="rounded-md border border-border px-4 py-2 text-sm hover:bg-accent"
						href="/sign-in"
					>
						Sign in to submit
					</Link>
				)}
			</div>

			<div className="space-y-10">
				<section>
					<h2 className="mb-4 text-lg font-semibold">Roadmap Resources</h2>
					<p className="mb-4 text-sm text-muted-foreground">
						Curated materials from the{" "}
						<a
							className="underline underline-offset-4 hover:text-foreground"
							href="https://github.com/popsukss/quantum-roadmap"
							rel="noopener noreferrer"
							target="_blank"
						>
							quantum-roadmap
						</a>{" "}
						curriculum.
					</p>
					<RoadmapResources checkpoints={checkpoints} items={roadmapItems} />
				</section>

				<div className="border-t border-border" />

				<section>
					<h2 className="mb-4 text-lg font-semibold">Community Submissions</h2>
					<ResourceList checkpoints={checkpoints} isAuthed={!!session} />
				</section>
			</div>
		</div>
	);
}
