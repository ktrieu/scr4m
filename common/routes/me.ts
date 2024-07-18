import { z } from "zod";
import { UserSchema } from "../user.js";

export const MeReturnSchema = UserSchema;

export type MeBody = z.infer<typeof MeReturnSchema>;

export const MeUnauthorizedSchema = z.object({});
