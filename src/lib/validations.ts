import { z } from "zod";

export const foodPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().optional(),
  quantity: z.string().min(1, "Quantity is required"),
  foodType: z.string().min(1, "Food type is required"),
  expiryDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  address: z.string().optional(),
});

export const claimSchema = z.object({
  foodPostId: z.string().uuid("Invalid food post ID"),
});

export const claimUpdateSchema = z.object({
  status: z.enum(["PENDING", "ACCEPTED", "COMPLETED", "CANCELLED"]),
});
