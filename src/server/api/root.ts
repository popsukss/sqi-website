import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { eventRouter } from "~/server/api/routers/event";
import { memberRouter } from "~/server/api/routers/member";

export const appRouter = createTRPCRouter({
	event: eventRouter,
	member: memberRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
