"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Markdown } from "~/components/markdown";
import { api } from "~/trpc/react";
import type { RoadmapNode } from "~/lib/roadmap";

export function NewPostForm({ checkpoints }: { checkpoints: RoadmapNode[] }) {
	const router = useRouter();
	const [title, setTitle] = useState("");
	const [body, setBody] = useState("");
	const [tag, setTag] = useState("");
	const [preview, setPreview] = useState(false);

	const create = api.forum.createPost.useMutation({
		onSuccess: (post) => router.push(`/forum/${post.id}`),
	});

	return (
		<form
			className="space-y-4"
			onSubmit={(e) => {
				e.preventDefault();
				create.mutate({ title, body, checkpointTag: tag || undefined });
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
					placeholder="What's your question or topic?"
					required
					type="text"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
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

			<div>
				<div className="mb-1 flex items-center justify-between">
					<label className="text-sm font-medium" htmlFor="body">
						Body <span className="text-muted-foreground text-xs">(Markdown + LaTeX supported)</span>
					</label>
					<button
						className="text-xs text-muted-foreground underline underline-offset-2"
						type="button"
						onClick={() => setPreview((v) => !v)}
					>
						{preview ? "Edit" : "Preview"}
					</button>
				</div>
				{preview ? (
					<div className="min-h-[200px] rounded-md border border-border px-3 py-2">
						{body ? <Markdown>{body}</Markdown> : <p className="text-sm text-muted-foreground">Nothing to preview.</p>}
					</div>
				) : (
					<textarea
						className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
						id="body"
						minLength={1}
						placeholder={"Write your post here...\n\nSupports **Markdown** and $LaTeX$ math."}
						required
						rows={12}
						value={body}
						onChange={(e) => setBody(e.target.value)}
					/>
				)}
			</div>

			<button
				className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
				disabled={create.isPending}
				type="submit"
			>
				{create.isPending ? "Posting..." : "Post"}
			</button>

			{create.isError && (
				<p className="text-sm text-destructive">{create.error.message}</p>
			)}
		</form>
	);
}
