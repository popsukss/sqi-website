"use client";

import { useState } from "react";

import { MarkdownInline } from "~/components/markdown";
import type { RoadmapNode, RoadmapResourceItem } from "~/lib/roadmap";

export function RoadmapResources({
	items,
	checkpoints,
}: {
	items: RoadmapResourceItem[];
	checkpoints: RoadmapNode[];
}) {
	const [tag, setTag] = useState<string | undefined>();

	const filtered = tag ? items.filter((i) => i.nodeId === tag) : items;

	return (
		<div className="space-y-4">
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

			{filtered.length === 0 ? (
				<p className="py-8 text-center text-muted-foreground text-sm">No resources for this checkpoint.</p>
			) : (
				<div className="space-y-2">
					{filtered.map((item, i) => (
						<div
							key={`${item.nodeId}-${i}`}
							className="flex items-start justify-between gap-4 rounded-lg border border-border px-4 py-3"
						>
							<span className="min-w-0 flex-1 text-sm">
								<MarkdownInline>{item.text}</MarkdownInline>
							</span>
							<span className="shrink-0 rounded bg-accent px-1.5 py-0.5 text-xs text-muted-foreground">
								{item.nodeLabel}
							</span>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
