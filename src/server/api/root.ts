import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { eventRouter } from "~/server/api/routers/event";

export const appRouter = createTRPCRouter({
	event: eventRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
