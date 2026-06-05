import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { adminRouter } from "~/server/api/routers/admin";
import { eventRouter } from "~/server/api/routers/event";
import { memberRouter } from "~/server/api/routers/member";

export const appRouter = createTRPCRouter({
	admin: adminRouter,
	event: eventRouter,
	member: memberRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
