import { getRoadmapMeta } from "~/lib/roadmap";
import { getSession } from "~/server/better-auth/server";
import { RoadmapView } from "./_components/roadmap-view";
import { StarterQuiz } from "./_components/starter-quiz";

export default async function RoadmapPage() {
	const [meta, session] = await Promise.all([getRoadmapMeta(), getSession()]);

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold">Quantum Computing Roadmap</h1>
				<p className="mt-2 text-muted-foreground">
					Your personal path from beginner to quantum researcher.
				</p>
			</div>

			{!session ? (
				<StarterQuiz entryPoints={meta.entryPoints} />
			) : (
				<RoadmapView meta={meta} userId={session.user.id} />
			)}
		</div>
	);
}
