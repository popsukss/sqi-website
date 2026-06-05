import Link from "next/link";

import { getRoadmapMeta } from "~/lib/roadmap";
import { getSession } from "~/server/better-auth/server";
import { api } from "~/trpc/server";

export default async function ForumPage({
	searchParams,
}: {
	searchParams: Promise<{ tag?: string }>;
}) {
	const { tag } = await searchParams;

	const [{ posts }, meta, session] = await Promise.all([
		api.forum.getPosts({ checkpointTag: tag, limit: 20 }),
		getRoadmapMeta(),
		getSession(),
	]);

	const checkpointNodes = meta.nodes.filter((n) => n.type === "checkpoint");

	return (
		<div className="container mx-auto max-w-3xl px-4 py-8">
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Forum</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						Ask questions, share ideas, discuss quantum computing.
					</p>
				</div>
				{session ? (
					<Link
						className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
						href="/forum/new"
					>
						New Post
					</Link>
				) : (
					<Link
						className="rounded-md border border-border px-4 py-2 text-sm hover:bg-accent"
						href="/sign-in"
					>
						Sign in to post
					</Link>
				)}
			</div>

			<div className="mb-6 flex flex-wrap gap-2">
				<Link
					className={`rounded-full border px-3 py-1 text-xs transition-colors ${!tag ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-accent"}`}
					href="/forum"
				>
					All
				</Link>
				{checkpointNodes.map((n) => (
					<Link
						key={n.id}
						className={`rounded-full border px-3 py-1 text-xs transition-colors ${tag === n.id ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-accent"}`}
						href={`/forum?tag=${n.id}`}
					>
						{n.label}
					</Link>
				))}
			</div>

			{posts.length === 0 ? (
				<div className="flex flex-col items-center gap-4 py-12 text-center">
					<p className="text-muted-foreground">No posts yet — be the first to start a discussion.</p>
					{session ? (
						<Link
							className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
							href="/forum/new"
						>
							Create the first post →
						</Link>
					) : (
						<Link
							className="rounded-md border border-border px-4 py-2 text-sm hover:bg-accent"
							href="/sign-in"
						>
							Sign in to post →
						</Link>
					)}
				</div>
			) : (
				<div className="divide-y divide-border">
					{posts.map((post) => (
						<Link
							key={post.id}
							className="-mx-2 block rounded px-2 py-4 transition-colors hover:bg-accent/30"
							href={`/forum/${post.id}`}
						>
							<div className="flex items-start justify-between gap-4">
								<div className="min-w-0">
									<div className="flex flex-wrap items-center gap-2">
										{post.pinned && (
											<span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
												Pinned
											</span>
										)}
										{post.checkpointTag && (
											<span className="rounded bg-accent px-1.5 py-0.5 text-xs text-muted-foreground">
												{meta.nodes.find((n) => n.id === post.checkpointTag)?.label ?? post.checkpointTag}
											</span>
										)}
									</div>
									<p className="mt-1 font-medium leading-snug">{post.title}</p>
									<p className="mt-1 text-xs text-muted-foreground">
										{post.author.name} · {post._count.comments} comment{post._count.comments !== 1 ? "s" : ""}
									</p>
								</div>
								<div className="shrink-0 text-center">
									<p className="text-lg font-semibold">{post.score}</p>
									<p className="text-xs text-muted-foreground">votes</p>
								</div>
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
