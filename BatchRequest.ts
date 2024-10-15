import * as z from "zod";

export const BatchRequest = z.object({
    values: z.array(z.number()),
});

export type BatchRequest = z.infer<typeof BatchRequest>;
