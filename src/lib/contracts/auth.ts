import { z } from "zod";

export const roleSchema = z.enum(["owner", "cashier"]);

export const membershipSchema = z.object({
  business_id: z.uuid(),
  business_name: z.string(),
  location_name: z.string(),
  role: roleSchema,
});

export const sessionSchema = z.object({
  user: z.object({
    id: z.uuid(),
    email: z.email(),
    display_name: z.string(),
    created_at: z.iso.datetime(),
  }),
  memberships: z.array(membershipSchema),
});

export const businessSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  location_name: z.string(),
  role: roleSchema,
});

export const businessesSchema = z.array(businessSchema);

export const inviteSchema = z.object({
  id: z.uuid(),
  business_id: z.uuid(),
  code: z.string().length(8),
  expires_at: z.iso.datetime(),
});

export const membershipResultSchema = z.object({
  business_id: z.uuid(),
  role: roleSchema,
});

export const messageSchema = z.object({ message: z.string() });

export type Session = z.infer<typeof sessionSchema>;
export type Membership = z.infer<typeof membershipSchema>;
export type Business = z.infer<typeof businessSchema>;
export type Invite = z.infer<typeof inviteSchema>;
