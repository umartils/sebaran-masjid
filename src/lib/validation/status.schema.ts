import { z } from "zod";
import {
    optionalString,
    idCuid  
} from "./common";

import { pengajuanSchema } from "./enums";

export const statusSchema = z.object({
    status: pengajuanSchema,
    approvedBy: optionalString,
    idApproval: idCuid,

});