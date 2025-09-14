import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, baseProcedure, protectedProcedure } from "@/trpc/init";
import { agentsInsertSchema } from "../schema";
import { z } from "zod";
import { eq, getTableColumns, sql } from "drizzle-orm";

export const agentsRouter = createTRPCRouter({
    getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({input}) => {
        const [existingAgent] = await db
            .select({
                // TODO: to change the actual count
                ...getTableColumns(agents),
                meetingCount: sql<number>`5`,
            })
            .from(agents)
            .where(eq(agents.id, input.id))
        return existingAgent;
    }),

    getMany: protectedProcedure.query(async () => {
        const data = await db.select().from(agents);

        // await new Promise((resolve) => setTimeout(resolve, 5000));
        // throw new TRPCError({ code: "BAD_REQUEST" });
        // this above is for testing the app for the error and loading if data present or in error

        return data;
    }),

    create: protectedProcedure
        .input(agentsInsertSchema)
        .mutation(async ({ input, ctx }) => {
            const [ createdAgent ] = await db
                .insert(agents)
                .values({
                    ...input,
                    userId: ctx.auth.user.id
                })
                .returning();
            return createdAgent;
        }),
});