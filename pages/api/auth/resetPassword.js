import { resetPassword } from "@/services/auth";
import { resetPasswordValidation } from "@/validations/auth";
import rateLimit from "@/utils/rateLimiter";

const rateLimitResetPassword = rateLimit(
  5,
  60000,
  "Too many reset password attempts. Please try again later."
);

export default async function handler(req, res) {
  const canProceed = await rateLimitResetPassword(req, res);
  if (!canProceed) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { error } = resetPasswordValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const { token, newPassword } = req.body;
    await resetPassword(token, newPassword);
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(400).json({
      error:
        "Failed to reset password. Please try again or contact support if the problem persists.",
    });
  }
}
