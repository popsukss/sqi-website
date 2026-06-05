"use client";

import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { api } from "~/trpc/react";

export default function AdminForumPage() {
	const utils = api.useUtils();
	const { data: posts = [], isLoading } = api.admin.getAllPosts.useQuery();

	const deletePost = api.admin.deletePost.useMutation({
		onSuccess: () => void utils.admin.getAllPosts.invalidate(),
	});
	const pinPost = api.admin.pinPost.useMutation({
		onSuccess: () => void utils.admin.getAllPosts.invalidate(),
	});

	return (
		<div className="space-y-4">
			<h1 className="text-2xl font-bold">Forum — Moderation</h1>

			{isLoading ? (
				<p className="text-muted-foreground text-sm">Loading…</p>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Title</TableHead>
							<TableHead>Author</TableHead>
							<TableHead>Tag</TableHead>
							<TableHead>Score</TableHead>
							<TableHead>Comments</TableHead>
							<TableHead className="w-36" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{posts.map((post) => (
							<TableRow key={post.id}>
								<TableCell>
									<span className="font-medium">{post.title}</span>
									{post.pinned && (
										<Badge className="ml-2" variant="secondary">Pinned</Badge>
									)}
								</TableCell>
								<TableCell className="text-muted-foreground text-sm">
									{post.author.name}
								</TableCell>
								<TableCell className="text-muted-foreground text-sm">
									{post.checkpointTag ?? "—"}
								</TableCell>
								<TableCell className="text-muted-foreground text-sm">{post.score}</TableCell>
								<TableCell className="text-muted-foreground text-sm">
									{post._count.comments}
								</TableCell>
								<TableCell>
									<div className="flex gap-2">
										<Button
											size="sm"
											variant="outline"
											onClick={() => pinPost.mutate({ id: post.id, pinned: !post.pinned })}
										>
											{post.pinned ? "Unpin" : "Pin"}
										</Button>
										<Button
											size="sm"
											variant="destructive"
											onClick={() => deletePost.mutate({ id: post.id })}
										>
											Delete
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	);
}
