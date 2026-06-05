"use client";

import { api } from "~/trpc/react";

type Status = "IN_PROGRESS" | "COMPLETED" | "SKIPPED";

const STATUS_LABELS: Record<Status, string> = {
	IN_PROGRESS: "In Progress",
	COMPLETED: "Completed",
	SKIPPED: "Skipped",
};

const STATUS_COLORS: Record<Status, string> = {
	IN_PROGRESS: "bg-amber-100 text-amber-800 border-amber-300",
	COMPLETED: "bg-green-100 text-green-800 border-green-300",
	SKIPPED: "bg-zinc-100 text-zinc-600 border-zinc-300",
};

export function CheckpointProgress({ nodeId }: { nodeId: string }) {
	const { data: progress = {}, refetch } = api.roadmap.getMyProgress.useQuery();
	const setProgress = api.roadmap.setProgress.useMutation({ onSuccess: () => refetch() });

	const current = progress[nodeId] as Status | undefined;

	return (
		<div className="flex flex-wrap items-center gap-3">
			{current && (
				<span className={`rounded-full border px-3 py-1 text-xs font-medium ${STATUS_COLORS[current]}`}>
					{STATUS_LABELS[current]}
				</span>
			)}
			{(["IN_PROGRESS", "COMPLETED", "SKIPPED"] as Status[]).map((s) => (
				<button
					key={s}
					className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
						current === s
							? "border-primary bg-primary text-primary-foreground"
							: "border-border bg-background hover:bg-accent"
					}`}
					disabled={setProgress.isPending}
					type="button"
					onClick={() => setProgress.mutate({ nodeId, status: s })}
				>
					{STATUS_LABELS[s]}
				</button>
			))}
		</div>
	);
}
