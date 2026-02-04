import { z } from "zod";

const usernameRegex = /^[a-z0-9-]+$/;

export const createStoreSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(usernameRegex, "Only lowercase letters, numbers, and hyphens allowed"),

  name: z
    .string()
    .min(1)
    .max(80),

  description: z
    .string()
    .max(500)
    .optional(),

  avatarUrl: z
    .string()
    .url()
    .optional(),

  bannerUrl: z
    .string()
    .url()
    .optional(),

});

export const updateStoreSchema = z.object({
  name: z
    .string()
    .max(80)
    .optional(),

  description: z
    .string()
    .max(500)
    .optional(),

  avatarUrl: z
    .string()
    .url()
    .optional(),

  bannerUrl: z
    .string()
    .url()
    .optional(),

  isPublic: z
    .boolean()
    .optional(),

  isVacationMode: z
    .boolean()
    .optional(),

  announcementText: z
    .string()
    .max(200)
    .optional(),

  announcementEnabled: z
    .boolean()
    .optional(),
});
