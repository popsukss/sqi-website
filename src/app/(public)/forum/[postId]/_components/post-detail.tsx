"use client";

import { useState } from "react";

import { Markdown } from "~/components/markdown";
import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/react";

type Post = NonNullable<RouterOutputs["forum"]["getPost"]>;

function VoteButtons({
	score,
	myVote,
	onVote,
	disabled,
}: {
	score: number;
	myVote: number | undefined;
	onVote: (v: 1 | -1) => void;
	disabled: boolean;
}) {
	return (
		<div className="flex flex-col items-center gap-1">
			<button
				className={`rounded p-1 text-sm transition-colors ${myVote === 1 ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
				disabled={disabled}
				type="button"
				onClick={() => onVote(1)}
			>
				▲
			</button>
			<span className="text-sm font-medium">{score}</span>
			<button
				className={`rounded p-1 text-sm transition-colors ${myVote === -1 ? "text-destructive" : "text-muted-foreground hover:text-foreground"}`}
				disabled={disabled}
				type="button"
				onClick={() => onVote(-1)}
			>
				▼
			</button>
		</div>
	);
}

export function PostDetail({ post: initial, isAuthed }: { post: Post; isAuthed: boolean }) {
	const [commentBody, setCommentBody] = useState("");
	const utils = api.useUtils();

	const { data: post } = api.forum.getPost.useQuery(
		{ postId: initial.id },
		{ initialData: initial },
	);

	const votePost = api.forum.votePost.useMutation({
		onSuccess: () => utils.forum.getPost.invalidate({ postId: initial.id }),
	});
	const voteComment = api.forum.voteComment.useMutation({
		onSuccess: () => utils.forum.getPost.invalidate({ postId: initial.id }),
	});
	const createComment = api.forum.createComment.useMutation({
		onSuccess: () => {
			setCommentBody("");
			void utils.forum.getPost.invalidate({ postId: initial.id });
		},
	});

	if (!post) return null;

	const myPostVote = post.votes?.find((v) => v.postId === post.id)?.value;

	return (
		<div className="space-y-8">
			<div className="flex gap-4">
				<VoteButtons
					disabled={!isAuthed || votePost.isPending}
					myVote={myPostVote}
					score={post.score}
					onVote={(v) => votePost.mutate({ postId: post.id, value: v })}
				/>
				<div className="min-w-0 flex-1">
					<Markdown>{post.body}</Markdown>
					<p className="mt-4 text-xs text-muted-foreground">
						{post.author.name} · {new Date(post.createdAt).toLocaleDateString()}
					</p>
				</div>
			</div>

			<div>
				<h2 className="mb-4 text-lg font-semibold">
					{post.comments.length} Comment{post.comments.length !== 1 ? "s" : ""}
				</h2>

				<div className="space-y-4">
					{post.comments.map((comment) => {
						const myCommentVote = post.votes?.find((v) => v.commentId === comment.id)?.value;
						return (
							<div key={comment.id} className="flex gap-3 rounded-lg border border-border p-3">
								<VoteButtons
									disabled={!isAuthed || voteComment.isPending}
									myVote={myCommentVote}
									score={comment.score}
									onVote={(v) => voteComment.mutate({ commentId: comment.id, value: v })}
								/>
								<div className="min-w-0 flex-1">
									<Markdown>{comment.body}</Markdown>
									<p className="mt-2 text-xs text-muted-foreground">
										{comment.author.name} · {new Date(comment.createdAt).toLocaleDateString()}
									</p>
								</div>
							</div>
						);
					})}
				</div>

				{isAuthed ? (
					<form
						className="mt-6 space-y-2"
						onSubmit={(e) => {
							e.preventDefault();
							createComment.mutate({ postId: post.id, body: commentBody });
						}}
					>
						<textarea
							className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
							placeholder={"Add a comment...\n\nSupports **Markdown** and $LaTeX$ math."}
							required
							rows={4}
							value={commentBody}
							onChange={(e) => setCommentBody(e.target.value)}
						/>
						<button
							className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
							disabled={createComment.isPending}
							type="submit"
						>
							{createComment.isPending ? "Posting..." : "Comment"}
						</button>
					</form>
				) : (
					<p className="mt-6 text-sm text-muted-foreground">
						<a className="underline underline-offset-4" href="/sign-in">
							Sign in
						</a>{" "}
						to comment.
					</p>
				)}
			</div>
		</div>
	);
}
