import { z } from "zod";

export const optionalString = z.string().optional();

export const idCuid = z.string().cuid()

export const optionalNumber = z.coerce
  .number()
  .optional()
  .or(z.literal("").transform(() => undefined));

export const optionalInt = z.coerce
  .number()
  .int()
  .optional()
  .or(z.literal("").transform(() => undefined));

export const optionalPositiveInt = z.coerce
  .number()
  .int()
  .positive()
  .optional()
  .or(z.literal("").transform(() => undefined));

export const optionalNonNegative = z.coerce
  .number()
  .nonnegative()
  .optional()
  .or(z.literal("").transform(() => undefined));

export const mediaUrl = z.array(z.string().url()).default([]);