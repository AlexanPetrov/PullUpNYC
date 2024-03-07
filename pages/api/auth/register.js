import { registerUser } from "@/services/auth";
import { loginAndRegisterValidation } from "@/validations/auth";
import rateLimit from "@/utils/rateLimiter";

const rateLimitRegister = rateLimit(
  5,
  60000,
  "Too many registration attempts. Please try again later."
);

export default async function handler(req, res) {
  const canProceed = await rateLimitRegister(req, res);
  if (!canProceed) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { error } = loginAndRegisterValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const { email, password } = req.body;
    const newUser = await registerUser(email, password);
    res.status(201).json({ user: newUser });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(400).json({ error: "Registration failed. Please try again." });
  }
}
