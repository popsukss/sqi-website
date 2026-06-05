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

	getStarterQuizOptions: publicProcedure.query(async () => {
		const { getRoadmapMeta } = await import("~/lib/roadmap");
		const meta = await getRoadmapMeta();
		return meta.entryPoints;
	}),
});
