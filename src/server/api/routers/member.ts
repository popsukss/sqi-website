import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const memberRouter = createTRPCRouter({
	getAll: publicProcedure.query(async ({ ctx }) => {
		return ctx.db.member.findMany({
			orderBy: { order: "asc" },
		});
	}),
});
