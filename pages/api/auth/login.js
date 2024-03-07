import { loginUser } from "@/services/auth";
import { loginAndRegisterValidation } from "@/validations/auth";
import rateLimit from "@/utils/rateLimiter";

const rateLimitLogin = rateLimit(
  5,
  60000,
  "Too many login attempts. Please try again later."
);

export default async function handler(req, res) {
  const canProceed = await rateLimitLogin(req, res);
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
    const user = await loginUser(email, password);
    res.status(200).json({ user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(401).json({
      error: "Login failed. Please check your credentials and try again.",
    });
  }
}
