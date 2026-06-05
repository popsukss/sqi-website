import { z } from "zod";

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "~/server/api/trpc";

export const forumRouter = createTRPCRouter({
	getPosts: publicProcedure
		.input(
			z.object({
				checkpointTag: z.string().optional(),
				cursor: z.string().optional(),
				limit: z.number().min(1).max(50).default(20),
			}),
		)
		.query(async ({ ctx, input }) => {
			const posts = await ctx.db.forumPost.findMany({
				take: input.limit + 1,
				cursor: input.cursor ? { id: input.cursor } : undefined,
				where: input.checkpointTag ? { checkpointTag: input.checkpointTag } : undefined,
				orderBy: [{ pinned: "desc" }, { score: "desc" }, { createdAt: "desc" }],
				include: {
					author: { select: { id: true, name: true } },
					_count: { select: { comments: true } },
				},
			});

			let nextCursor: string | undefined;
			if (posts.length > input.limit) {
				nextCursor = posts.pop()!.id;
			}

			return { posts, nextCursor };
		}),

	getPost: publicProcedure
		.input(z.object({ postId: z.string() }))
		.query(async ({ ctx, input }) => {
			return ctx.db.forumPost.findUnique({
				where: { id: input.postId },
				include: {
					author: { select: { id: true, name: true } },
					comments: {
						orderBy: [{ score: "desc" }, { createdAt: "asc" }],
						include: { author: { select: { id: true, name: true } } },
					},
					votes: ctx.session
						? { where: { userId: ctx.session.user.id }, select: { value: true, postId: true, commentId: true } }
						: false,
				},
			});
		}),

	createPost: protectedProcedure
		.input(
			z.object({
				title: z.string().min(1).max(200),
				body: z.string().min(1),
				checkpointTag: z.string().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return ctx.db.forumPost.create({
				data: {
					title: input.title,
					body: input.body,
					checkpointTag: input.checkpointTag ?? null,
					authorId: ctx.session.user.id,
				},
			});
		}),

	createComment: protectedProcedure
		.input(z.object({ postId: z.string(), body: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			return ctx.db.forumComment.create({
				data: {
					body: input.body,
					postId: input.postId,
					authorId: ctx.session.user.id,
				},
			});
		}),

	votePost: protectedProcedure
		.input(z.object({ postId: z.string(), value: z.union([z.literal(1), z.literal(-1)]) }))
		.mutation(async ({ ctx, input }) => {
			const existing = await ctx.db.vote.findUnique({
				where: { userId_postId: { userId: ctx.session.user.id, postId: input.postId } },
			});

			if (existing?.value === input.value) {
				await ctx.db.vote.delete({ where: { id: existing.id } });
				await ctx.db.forumPost.update({
					where: { id: input.postId },
					data: { score: { decrement: input.value } },
				});
			} else {
				const delta = existing ? input.value - existing.value : input.value;
				await ctx.db.vote.upsert({
					where: { userId_postId: { userId: ctx.session.user.id, postId: input.postId } },
					update: { value: input.value },
					create: { userId: ctx.session.user.id, postId: input.postId, value: input.value },
				});
				await ctx.db.forumPost.update({
					where: { id: input.postId },
					data: { score: { increment: delta } },
				});
			}
		}),

	voteComment: protectedProcedure
		.input(z.object({ commentId: z.string(), value: z.union([z.literal(1), z.literal(-1)]) }))
		.mutation(async ({ ctx, input }) => {
			const existing = await ctx.db.vote.findUnique({
				where: { userId_commentId: { userId: ctx.session.user.id, commentId: input.commentId } },
			});

			if (existing?.value === input.value) {
				await ctx.db.vote.delete({ where: { id: existing.id } });
				await ctx.db.forumComment.update({
					where: { id: input.commentId },
					data: { score: { decrement: input.value } },
				});
			} else {
				const delta = existing ? input.value - existing.value : input.value;
				await ctx.db.vote.upsert({
					where: { userId_commentId: { userId: ctx.session.user.id, commentId: input.commentId } },
					update: { value: input.value },
					create: { userId: ctx.session.user.id, commentId: input.commentId, value: input.value },
				});
				await ctx.db.forumComment.update({
					where: { id: input.commentId },
					data: { score: { increment: delta } },
				});
			}
		}),
});
