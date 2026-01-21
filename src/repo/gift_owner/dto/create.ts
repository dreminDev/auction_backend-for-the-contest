import type { GiftOwner } from "@prisma/client";

export type CreateGiftOwnerIn = Omit<GiftOwner, "id" | "addedAt">;
