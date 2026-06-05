import { redirect } from "next/navigation";

import { getRoadmapMeta } from "~/lib/roadmap";
import { getSession } from "~/server/better-auth/server";
import { SubmitResourceForm } from "./_components/submit-resource-form";

export default async function SubmitResourcePage() {
	const [session, meta] = await Promise.all([getSession(), getRoadmapMeta()]);

	if (!session) redirect("/sign-in");

	const checkpoints = meta.nodes.filter((n) => n.type === "checkpoint");

	return (
		<div className="container mx-auto max-w-2xl px-4 py-8">
			<h1 className="mb-6 text-3xl font-bold">Submit a Resource</h1>
			<p className="mb-6 text-sm text-muted-foreground">
				Submissions are reviewed before going public. Thanks for contributing!
			</p>
			<SubmitResourceForm checkpoints={checkpoints} />
		</div>
	);
}
