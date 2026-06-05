import Link from "next/link";

import { getRoadmapMeta } from "~/lib/roadmap";
import { getSession } from "~/server/better-auth/server";
import { ResourceList } from "./_components/resource-list";

export default async function ResourcesPage() {
	const [meta, session] = await Promise.all([getRoadmapMeta(), getSession()]);
	const checkpoints = meta.nodes.filter((n) => n.type === "checkpoint");

	return (
		<div className="container mx-auto max-w-3xl px-4 py-8">
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Resources</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						Community-curated videos, books, papers, and more.
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

			<ResourceList checkpoints={checkpoints} isAuthed={!!session} />
		</div>
	);
}
