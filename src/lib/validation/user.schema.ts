import { z } from "zod";
 
import { 
    optionalString,
    idCuid
} from "./common";

import { roleSchema } from "./enums";

export const userInputSchema = z.object({ 
    name: z.string().min(3, "Nama Minimal 3 karakter"),
    email: z.string().email("Format email tidak valid"),
    emailVerified : z.date().nullable().optional(),
    nomorTelepon : optionalString,
    role: roleSchema.default('Relawan'),
    password : z.string().min(8, "Masukkan password minimal 8 karakter").max(50),
    userInput : z.string().min(3, "Nama user input minimal 3 karakter"),
    editedBy: idCuid,
})

export const userUpdateSchema = z.object({
    id: idCuid,
    name: z.string().min(3, "Nama Minimal 3 karakter"),
    email: z.string().email("Format email tidak valid"),
    emailVerified : z.date().nullable().optional(),
    nomorTelepon : optionalString,
    role: roleSchema.default('Relawan'),
    editedBy: idCuid,
})

export type AddUserInput = z.infer<typeof userInputSchema>;
export type UpdateUserInput = z.infer<typeof userUpdateSchema>;
export type UserRole = z.infer<typeof roleSchema>;