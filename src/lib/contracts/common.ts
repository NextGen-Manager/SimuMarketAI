import { z } from "zod";

export const errorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    fields: z.array(z.object({ path: z.string(), reason: z.string() })),
    correlation_id: z.string(),
    retryable: z.boolean(),
  }),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;

