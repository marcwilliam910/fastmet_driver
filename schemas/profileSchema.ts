import * as z from "zod";

export const ProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  vehicle: z
    .string()
    .refine((val) => ["motorcycle", "car", "van", "truck"].includes(val), {
      message: "Please select a vehicle type",
    }),
  license: z.string().min(1, "Driver's license number is required"),
});
