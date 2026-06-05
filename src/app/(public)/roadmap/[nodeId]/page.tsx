import Link from "next/link";
import { notFound } from "next/navigation";

import { MarkdownInline } from "~/components/markdown";
import { getCheckpointContent, getRoadmapMeta } from "~/lib/roadmap";
import { getSession } from "~/server/better-auth/server";
import { CheckpointProgress } from "./_components/checkpoint-progress";
import { ConceptChecklist } from "./_components/concept-checklist";

export default async function CheckpointPage({
	params,
}: {
	params: Promise<{ nodeId: string }>;
}) {
	const { nodeId } = await params;

	const [content, meta, session] = await Promise.all([
		getCheckpointContent(nodeId).catch(() => null),
		getRoadmapMeta(),
		getSession(),
	]);

	if (!content) notFound();

	const node = meta.nodes.find((n) => n.id === nodeId);
	const typeLabel = node?.type === "track" ? "Track" : "Checkpoint";

	return (
		<div className="container mx-auto max-w-3xl px-4 py-8">
			<div className="mb-6">
				<Link className="text-sm text-muted-foreground hover:text-foreground" href="/roadmap">
					← Back to Roadmap
				</Link>
			</div>

			<div className="mb-6 space-y-3">
				<div className="flex items-center gap-2">
					<span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
						{typeLabel}
					</span>
					<span className="text-xs text-muted-foreground">{nodeId}</span>
				</div>
				<h1 className="text-3xl font-bold">{content.title}</h1>

				{session ? (
					<CheckpointProgress nodeId={nodeId} />
				) : (
					<p className="text-sm text-muted-foreground">
						<Link className="underline underline-offset-4" href="/sign-in">
							Sign in
						</Link>{" "}
						to track your progress.
					</p>
				)}
			</div>

			{content.milestone && (
				<div className="mb-6 rounded-lg border border-border bg-accent/40 px-4 py-3">
					<p className="text-sm font-medium">Milestone</p>
					<p className="mt-1 text-sm text-muted-foreground">{content.milestone}</p>
				</div>
			)}

			<div className="space-y-8">
				{content.sections.map((section) => (
					<section key={section.heading}>
						<h2 className="mb-3 text-xl font-semibold">{section.heading}</h2>
						{section.items.length > 0 ? (
							section.heading === "Concepts" ? (
								<ConceptChecklist isAuthed={!!session} items={section.items} nodeId={nodeId} />
							) : (
								<ul className="space-y-2">
									{section.items.map((item, i) => (
										<li key={i} className="flex gap-2 text-sm">
											<span className="mt-0.5 shrink-0 text-muted-foreground">•</span>
											<span className="min-w-0"><MarkdownInline>{item}</MarkdownInline></span>
										</li>
									))}
								</ul>
							)
						) : (
							<p className="text-sm text-muted-foreground">No items.</p>
						)}
					</section>
				))}
			</div>
		</div>
	);
}
