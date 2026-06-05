import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
	createTRPCRouter,
	protectedProcedure,
} from "~/server/api/trpc";

const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
	const user = await ctx.db.user.findUnique({
		where: { id: ctx.session.user.id },
		select: { role: true },
	});
	if (user?.role !== "ADMIN") {
		throw new TRPCError({ code: "FORBIDDEN" });
	}
	return next();
});

export const adminRouter = createTRPCRouter({
	// ── Events ──────────────────────────────────────────────────────────────
	createEvent: adminProcedure
		.input(
			z.object({
				title: z.string().min(1),
				date: z.date(),
				description: z.string().min(1),
				imageUrl: z.string().url().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return ctx.db.event.create({ data: input });
		}),

	updateEvent: adminProcedure
		.input(
			z.object({
				id: z.string(),
				title: z.string().min(1).optional(),
				date: z.date().optional(),
				description: z.string().min(1).optional(),
				imageUrl: z.string().url().nullable().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { id, ...data } = input;
			return ctx.db.event.update({ where: { id }, data });
		}),

	deleteEvent: adminProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.event.delete({ where: { id: input.id } });
		}),

	// ── Members ─────────────────────────────────────────────────────────────
	createMember: adminProcedure
		.input(
			z.object({
				name: z.string().min(1),
				role: z.string().min(1),
				bio: z.string().optional(),
				imageUrl: z.string().url().optional(),
				order: z.number().int().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return ctx.db.member.create({ data: input });
		}),

	updateMember: adminProcedure
		.input(
			z.object({
				id: z.string(),
				name: z.string().min(1).optional(),
				role: z.string().min(1).optional(),
				bio: z.string().nullable().optional(),
				imageUrl: z.string().url().nullable().optional(),
				order: z.number().int().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { id, ...data } = input;
			return ctx.db.member.update({ where: { id }, data });
		}),

	deleteMember: adminProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.member.delete({ where: { id: input.id } });
		}),

	// ── Resources ───────────────────────────────────────────────────────────
	getPendingResources: adminProcedure.query(async ({ ctx }) => {
		return ctx.db.resource.findMany({
			where: { approved: false },
			include: { submittedBy: { select: { name: true, email: true } } },
			orderBy: { createdAt: "asc" },
		});
	}),

	approveResource: adminProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			return ctx.db.resource.update({
				where: { id: input.id },
				data: { approved: true },
			});
		}),

	rejectResource: adminProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.resource.delete({ where: { id: input.id } });
		}),

	// ── Forum ────────────────────────────────────────────────────────────────
	getAllPosts: adminProcedure.query(async ({ ctx }) => {
		return ctx.db.forumPost.findMany({
			include: {
				author: { select: { name: true } },
				_count: { select: { comments: true } },
			},
			orderBy: { createdAt: "desc" },
		});
	}),

	deletePost: adminProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.forumPost.delete({ where: { id: input.id } });
		}),

	pinPost: adminProcedure
		.input(z.object({ id: z.string(), pinned: z.boolean() }))
		.mutation(async ({ ctx, input }) => {
			return ctx.db.forumPost.update({
				where: { id: input.id },
				data: { pinned: input.pinned },
			});
		}),

	// ── Users ────────────────────────────────────────────────────────────────
	getAllUsers: adminProcedure.query(async ({ ctx }) => {
		return ctx.db.user.findMany({
			select: { id: true, name: true, email: true, role: true, createdAt: true },
			orderBy: { createdAt: "desc" },
		});
	}),

	setUserRole: adminProcedure
		.input(
			z.object({
				userId: z.string(),
				role: z.enum(["USER", "ADMIN"]),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			if (input.userId === ctx.session.user.id) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Cannot change your own role.",
				});
			}
			return ctx.db.user.update({
				where: { id: input.userId },
				data: { role: input.role },
			});
		}),
});
