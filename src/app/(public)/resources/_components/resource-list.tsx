"use client";

import { useState } from "react";

import { api } from "~/trpc/react";
import type { RoadmapNode } from "~/lib/roadmap";

type ResourceType = "VIDEO" | "PDF" | "BOOK" | "ARTICLE";

const TYPE_LABELS: Record<ResourceType, string> = {
	VIDEO: "Video",
	PDF: "PDF",
	BOOK: "Book",
	ARTICLE: "Article",
};

const TYPE_COLORS: Record<ResourceType, string> = {
	VIDEO: "bg-red-100 text-red-700",
	PDF: "bg-orange-100 text-orange-700",
	BOOK: "bg-blue-100 text-blue-700",
	ARTICLE: "bg-green-100 text-green-700",
};

export function ResourceList({
	checkpoints,
	isAuthed,
}: {
	checkpoints: RoadmapNode[];
	isAuthed: boolean;
}) {
	const [type, setType] = useState<ResourceType | undefined>();
	const [tag, setTag] = useState<string | undefined>();

	const { data: resources = [], refetch } = api.resource.getApproved.useQuery({ type, checkpointTag: tag });
	const vote = api.resource.vote.useMutation({ onSuccess: () => refetch() });

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap gap-3">
				<div className="flex flex-wrap gap-2">
					{(["VIDEO", "PDF", "BOOK", "ARTICLE"] as ResourceType[]).map((t) => (
						<button
							key={t}
							className={`rounded-full border px-3 py-1 text-xs transition-colors ${type === t ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-accent"}`}
							type="button"
							onClick={() => setType(type === t ? undefined : t)}
						>
							{TYPE_LABELS[t]}
						</button>
					))}
				</div>
				<div className="flex flex-wrap gap-2">
					<button
						className={`rounded-full border px-3 py-1 text-xs transition-colors ${!tag ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-accent"}`}
						type="button"
						onClick={() => setTag(undefined)}
					>
						All
					</button>
					{checkpoints.map((cp) => (
						<button
							key={cp.id}
							className={`rounded-full border px-3 py-1 text-xs transition-colors ${tag === cp.id ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-accent"}`}
							type="button"
							onClick={() => setTag(tag === cp.id ? undefined : cp.id)}
						>
							{cp.label}
						</button>
					))}
				</div>
			</div>

			{resources.length === 0 ? (
				<p className="py-12 text-center text-muted-foreground">No resources found.</p>
			) : (
				<div className="space-y-3">
					{resources.map((r) => (
						<div key={r.id} className="flex gap-4 rounded-lg border border-border p-4">
							<div className="flex flex-col items-center gap-1">
								<button
									className="text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
									disabled={!isAuthed || vote.isPending}
									type="button"
									onClick={() => vote.mutate({ resourceId: r.id, value: 1 })}
								>
									▲
								</button>
								<span className="text-sm font-medium">{r.score}</span>
								<button
									className="text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
									disabled={!isAuthed || vote.isPending}
									type="button"
									onClick={() => vote.mutate({ resourceId: r.id, value: -1 })}
								>
									▼
								</button>
							</div>
							<div className="min-w-0 flex-1">
								<div className="flex flex-wrap items-center gap-2">
									<span className={`rounded px-1.5 py-0.5 text-xs font-medium ${TYPE_COLORS[r.type as ResourceType]}`}>
										{TYPE_LABELS[r.type as ResourceType]}
									</span>
									{r.checkpointTag && (
										<span className="rounded bg-accent px-1.5 py-0.5 text-xs text-muted-foreground">
											{checkpoints.find((c) => c.id === r.checkpointTag)?.label ?? r.checkpointTag}
										</span>
									)}
								</div>
								<a
									className="mt-1 block font-medium hover:underline"
									href={r.url}
									rel="noopener noreferrer"
									target="_blank"
								>
									{r.title} ↗
								</a>
								<p className="mt-1 text-sm text-muted-foreground">{r.description}</p>
								<p className="mt-1 text-xs text-muted-foreground">
									Submitted by {r.submittedBy.name}
								</p>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
