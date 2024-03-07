import { requestPasswordReset } from "@/services/auth";
import { requestResetPasswordValidation } from "@/pages/validations/auth";
import rateLimit from "@/utils/rateLimiter";

const rateLimitRequestResetPassword = rateLimit(
  5,
  60000,
  "Too many password reset requests. Please try again later."
);

export default async function handler(req, res) {
  const canProceed = await rateLimitRequestResetPassword(req, res);
  if (!canProceed) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { error } = requestResetPasswordValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const { email } = req.body;
    const message = await requestPasswordReset(email);
    return res.json({ message });
  } catch (error) {
    console.error("Failed to request password reset:", error);
    return res.status(500).json({
      error:
        "Failed to process password reset request. Please try again later.",
    });
  }
}
