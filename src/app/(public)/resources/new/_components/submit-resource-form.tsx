"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "~/trpc/react";
import type { RoadmapNode } from "~/lib/roadmap";

type ResourceType = "VIDEO" | "PDF" | "BOOK" | "ARTICLE";

export function SubmitResourceForm({ checkpoints }: { checkpoints: RoadmapNode[] }) {
	const router = useRouter();
	const [title, setTitle] = useState("");
	const [url, setUrl] = useState("");
	const [type, setType] = useState<ResourceType>("VIDEO");
	const [description, setDescription] = useState("");
	const [tag, setTag] = useState("");
	const [done, setDone] = useState(false);

	const submit = api.resource.submit.useMutation({
		onSuccess: () => setDone(true),
	});

	if (done) {
		return (
			<div className="rounded-lg border border-border p-6 text-center">
				<p className="font-medium">Submitted!</p>
				<p className="mt-1 text-sm text-muted-foreground">
					Your resource is pending review and will appear once approved.
				</p>
				<button
					className="mt-4 text-sm underline underline-offset-4"
					type="button"
					onClick={() => router.push("/resources")}
				>
					Back to Resources
				</button>
			</div>
		);
	}

	return (
		<form
			className="space-y-4"
			onSubmit={(e) => {
				e.preventDefault();
				submit.mutate({ title, url, type, description, checkpointTag: tag || undefined });
			}}
		>
			<div>
				<label className="mb-1 block text-sm font-medium" htmlFor="title">
					Title
				</label>
				<input
					className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					id="title"
					maxLength={200}
					placeholder="e.g. Introduction to Quantum Computing – IBM"
					required
					type="text"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
			</div>

			<div>
				<label className="mb-1 block text-sm font-medium" htmlFor="url">
					URL
				</label>
				<input
					className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					id="url"
					placeholder="https://..."
					required
					type="url"
					value={url}
					onChange={(e) => setUrl(e.target.value)}
				/>
			</div>

			<div>
				<label className="mb-1 block text-sm font-medium" htmlFor="type">
					Type
				</label>
				<select
					className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					id="type"
					value={type}
					onChange={(e) => setType(e.target.value as ResourceType)}
				>
					<option value="VIDEO">Video</option>
					<option value="PDF">PDF</option>
					<option value="BOOK">Book</option>
					<option value="ARTICLE">Article</option>
				</select>
			</div>

			<div>
				<label className="mb-1 block text-sm font-medium" htmlFor="description">
					Description
				</label>
				<textarea
					className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					id="description"
					maxLength={500}
					placeholder="Brief description of what this resource covers."
					required
					rows={3}
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>
			</div>

			<div>
				<label className="mb-1 block text-sm font-medium" htmlFor="tag">
					Checkpoint tag <span className="text-muted-foreground">(optional)</span>
				</label>
				<select
					className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					id="tag"
					value={tag}
					onChange={(e) => setTag(e.target.value)}
				>
					<option value="">No tag</option>
					{checkpoints.map((cp) => (
						<option key={cp.id} value={cp.id}>
							{cp.label}
						</option>
					))}
				</select>
			</div>

			<button
				className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
				disabled={submit.isPending}
				type="submit"
			>
				{submit.isPending ? "Submitting..." : "Submit for Review"}
			</button>

			{submit.isError && (
				<p className="text-sm text-destructive">{submit.error.message}</p>
			)}
		</form>
	);
}
