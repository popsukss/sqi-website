import Link from "next/link";

import { getRoadmapMeta } from "~/lib/roadmap";
import { getSession } from "~/server/better-auth/server";
import { api } from "~/trpc/server";
import { RoadmapView } from "./_components/roadmap-view";
import { StarterQuiz } from "./_components/starter-quiz";

export default async function RoadmapPage() {
	const [meta, session] = await Promise.all([getRoadmapMeta(), getSession()]);

	const initialProgress = session
		? await api.roadmap.getMyProgress()
		: {} as Record<string, never>;

	const checkpointCount = meta.nodes.filter((n) => n.type === "checkpoint").length;
	const completedCount = Object.values(initialProgress).filter((v) => v === "COMPLETED").length;

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-6">
				<h1 className="text-3xl font-bold">Quantum Computing Roadmap</h1>
				<p className="mt-2 text-muted-foreground">
					Your personal path from beginner to quantum researcher.
				</p>
				{session && completedCount > 0 && (
					<p className="mt-1 text-sm text-muted-foreground">
						{completedCount} of {checkpointCount} checkpoints completed
					</p>
				)}
			</div>

			<RoadmapView initialProgress={initialProgress} isAuthed={!!session} meta={meta} />

			{!session && (
				<div className="mt-4 rounded-lg border border-border bg-accent/30 px-4 py-3 text-sm text-muted-foreground">
					<Link className="font-medium text-foreground underline underline-offset-4" href="/sign-in">
						Sign in
					</Link>{" "}
					to track your progress — nodes colour up as you complete checkpoints.
				</div>
			)}

			<details className="mt-6 group">
				<summary className="cursor-pointer select-none text-sm font-medium text-muted-foreground hover:text-foreground">
					Not sure where to start? ▸
				</summary>
				<div className="mt-4">
					<StarterQuiz entryPoints={meta.entryPoints} isAuthed={!!session} />
				</div>
			</details>
		</div>
	);
}
