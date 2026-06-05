import Link from "next/link";
import { notFound } from "next/navigation";

import { getRoadmapMeta } from "~/lib/roadmap";
import { getSession } from "~/server/better-auth/server";
import { api } from "~/trpc/server";
import { PostDetail } from "./_components/post-detail";

export default async function PostPage({
	params,
}: {
	params: Promise<{ postId: string }>;
}) {
	const { postId } = await params;

	const [post, meta, session] = await Promise.all([
		api.forum.getPost({ postId }),
		getRoadmapMeta(),
		getSession(),
	]);

	if (!post) notFound();

	const tagLabel = post.checkpointTag
		? meta.nodes.find((n) => n.id === post.checkpointTag)?.label
		: null;

	return (
		<div className="container mx-auto max-w-3xl px-4 py-8">
			<div className="mb-6">
				<Link className="text-sm text-muted-foreground hover:text-foreground" href="/forum">
					← Back to Forum
				</Link>
			</div>

			<div className="mb-6">
				<div className="flex flex-wrap items-center gap-2">
					{post.pinned && (
						<span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
							Pinned
						</span>
					)}
					{tagLabel && (
						<span className="rounded bg-accent px-1.5 py-0.5 text-xs text-muted-foreground">
							{tagLabel}
						</span>
					)}
				</div>
				<h1 className="mt-2 text-2xl font-bold">{post.title}</h1>
			</div>

			<PostDetail isAuthed={!!session} post={post} />
		</div>
	);
}
