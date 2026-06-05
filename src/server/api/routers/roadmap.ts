import { z } from "zod";

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "~/server/api/trpc";

export const roadmapRouter = createTRPCRouter({
	getMyProgress: protectedProcedure.query(async ({ ctx }) => {
		const rows = await ctx.db.userRoadmapProgress.findMany({
			where: { userId: ctx.session.user.id },
		});
		return Object.fromEntries(rows.map((r) => [r.nodeId, r.status]));
	}),

	setProgress: protectedProcedure
		.input(
			z.object({
				nodeId: z.string(),
				status: z.enum(["IN_PROGRESS", "COMPLETED", "SKIPPED"]),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return ctx.db.userRoadmapProgress.upsert({
				where: {
					userId_nodeId: {
						userId: ctx.session.user.id,
						nodeId: input.nodeId,
					},
				},
				update: { status: input.status },
				create: {
					userId: ctx.session.user.id,
					nodeId: input.nodeId,
					status: input.status,
				},
			});
		}),

	getCheckedItems: protectedProcedure
		.input(z.object({ nodeId: z.string() }))
		.query(async ({ ctx, input }) => {
			const rows = await ctx.db.userChecklistItem.findMany({
				where: { userId: ctx.session.user.id, nodeId: input.nodeId },
			});
			return rows.map((r) => r.itemKey);
		}),

	setCheckedItem: protectedProcedure
		.input(z.object({ nodeId: z.string(), itemKey: z.string(), checked: z.boolean() }))
		.mutation(async ({ ctx, input }) => {
			if (input.checked) {
				await ctx.db.userChecklistItem.upsert({
					where: { userId_nodeId_itemKey: { userId: ctx.session.user.id, nodeId: input.nodeId, itemKey: input.itemKey } },
					update: {},
					create: { userId: ctx.session.user.id, nodeId: input.nodeId, itemKey: input.itemKey },
				});
			} else {
				await ctx.db.userChecklistItem.deleteMany({
					where: { userId: ctx.session.user.id, nodeId: input.nodeId, itemKey: input.itemKey },
				});
			}
		}),

	getStarterQuizOptions: publicProcedure.query(async () => {
		const { getRoadmapMeta } = await import("~/lib/roadmap");
		const meta = await getRoadmapMeta();
		return meta.entryPoints;
	}),
});
