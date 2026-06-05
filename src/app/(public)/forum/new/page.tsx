import { redirect } from "next/navigation";

import { getRoadmapMeta } from "~/lib/roadmap";
import { getSession } from "~/server/better-auth/server";
import { NewPostForm } from "./_components/new-post-form";

export default async function NewPostPage() {
	const [session, meta] = await Promise.all([getSession(), getRoadmapMeta()]);

	if (!session) redirect("/sign-in");

	const checkpointNodes = meta.nodes.filter((n) => n.type === "checkpoint");

	return (
		<div className="container mx-auto max-w-3xl px-4 py-8">
			<h1 className="mb-6 text-3xl font-bold">New Post</h1>
			<NewPostForm checkpoints={checkpointNodes} />
		</div>
	);
}
