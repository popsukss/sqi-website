import { z } from "zod";

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "~/server/api/trpc";

export const resourceRouter = createTRPCRouter({
	getApproved: publicProcedure
		.input(
			z.object({
				type: z.enum(["VIDEO", "PDF", "BOOK", "ARTICLE"]).optional(),
				checkpointTag: z.string().optional(),
			}),
		)
		.query(async ({ ctx, input }) => {
			return ctx.db.resource.findMany({
				where: {
					approved: true,
					type: input.type,
					checkpointTag: input.checkpointTag,
				},
				orderBy: [{ score: "desc" }, { createdAt: "desc" }],
				include: { submittedBy: { select: { id: true, name: true } } },
			});
		}),

	submit: protectedProcedure
		.input(
			z.object({
				title: z.string().min(1).max(200),
				url: z.string().url(),
				type: z.enum(["VIDEO", "PDF", "BOOK", "ARTICLE"]),
				description: z.string().min(1).max(500),
				checkpointTag: z.string().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return ctx.db.resource.create({
				data: {
					title: input.title,
					url: input.url,
					type: input.type,
					description: input.description,
					checkpointTag: input.checkpointTag ?? null,
					submittedById: ctx.session.user.id,
				},
			});
		}),

	vote: protectedProcedure
		.input(z.object({ resourceId: z.string(), value: z.union([z.literal(1), z.literal(-1)]) }))
		.mutation(async ({ ctx, input }) => {
			const existing = await ctx.db.vote.findUnique({
				where: {
					userId_resourceId: { userId: ctx.session.user.id, resourceId: input.resourceId },
				},
			});

			if (existing?.value === input.value) {
				await ctx.db.vote.delete({ where: { id: existing.id } });
				await ctx.db.resource.update({
					where: { id: input.resourceId },
					data: { score: { decrement: input.value } },
				});
			} else {
				const delta = existing ? input.value - existing.value : input.value;
				await ctx.db.vote.upsert({
					where: { userId_resourceId: { userId: ctx.session.user.id, resourceId: input.resourceId } },
					update: { value: input.value },
					create: { userId: ctx.session.user.id, resourceId: input.resourceId, value: input.value },
				});
				await ctx.db.resource.update({
					where: { id: input.resourceId },
					data: { score: { increment: delta } },
				});
			}
		}),
});
