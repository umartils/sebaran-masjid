import { z } from "zod";

import { 
    optionalString,
    mediaUrl,
    idCuid
} from "./common";

export const createProgressSchema = z.object ({
    trackingId : idCuid,
    progres : optionalString,
    nextProgres : optionalString,
    persentase : z.coerce.number().int().min(0).max(100).optional(),
    imgUrls : mediaUrl,
    waktuProgres : optionalString
})

export const updateProgressSchema = z.object ({
    id : idCuid,
    trackingId : idCuid,
    progres : optionalString,
    nextProgres : optionalString,
    persentase : z.coerce.number().int().min(0).max(100).optional(),
    imgUrls : mediaUrl,
    waktuProgres : optionalString
})

export type UpdateProgresInput = z.infer<typeof updateProgressSchema>;

export type CreateProgresInput = z.infer<typeof createProgressSchema>;

