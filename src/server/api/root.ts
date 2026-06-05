import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { adminRouter } from "~/server/api/routers/admin";
import { eventRouter } from "~/server/api/routers/event";
import { forumRouter } from "~/server/api/routers/forum";
import { memberRouter } from "~/server/api/routers/member";
import { resourceRouter } from "~/server/api/routers/resource";
import { roadmapRouter } from "~/server/api/routers/roadmap";

export const appRouter = createTRPCRouter({
	admin: adminRouter,
	event: eventRouter,
	forum: forumRouter,
	member: memberRouter,
	resource: resourceRouter,
	roadmap: roadmapRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
