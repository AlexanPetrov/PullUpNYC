import bcrypt from "bcryptjs";
import { query } from "@/utils/db";
import { transporter } from "@/utils/emailTransporter";
import { generateHighEntropyToken } from "@/utils/generateToken";

async function hashPassword(password) {
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10;
  return bcrypt.hash(password, saltRounds);
}

async function checkExistingUser(email) {
  const [existingUser] = await query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return existingUser;
}

export async function authenticateUser(email, password) {
  const [user] = await query("SELECT * FROM users WHERE email = ?", [email]);
  if (!user) {
    throw new Error("Authentication failed");
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error("Authentication failed");
  }

  return user;
}

export async function loginUser(email, password) {
  const user = await authenticateUser(email, password);
  return user;
}

export async function registerUser(email, password) {
  const existingUser = await checkExistingUser(email);
  if (existingUser) {
    throw new Error("Registration failed");
  }

  const hashedPassword = await hashPassword(password);
  const insertQuery = "INSERT INTO users (email, password) VALUES (?, ?)";
  await query(insertQuery, [email, hashedPassword]);

  const [newUser] = await query(
    "SELECT id, email, created_at FROM users WHERE email = ?",
    [email]
  );
  return newUser;
}

async function validateResetToken(token) {
  const [user] = await query(
    "SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpires > NOW()",
    [token]
  );
  return user || null;
}

export async function resetPassword(token, newPassword) {
  const user = await validateResetToken(token);
  if (!user) {
    throw new Error("Password reset failed");
  }

  const hashedPassword = await hashPassword(newPassword);
  const updateQuery =
    "UPDATE users SET password = ?, resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE email = ?";
  await query(updateQuery, [hashedPassword, user.email]);

  return { message: "Password reset successfully", email: user.email };
}

export async function requestPasswordReset(email) {
  const users = await query("SELECT * FROM users WHERE email = ?", [email]);
  if (users.length > 0) {
    const resetToken = generateHighEntropyToken();
    const expires = new Date();
    expires.setHours(expires.getHours() + 1);

    await query(
      "UPDATE users SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE email = ?",
      [resetToken, expires, email]
    );

    const resetUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/auth/resetPassword?token=${resetToken}`;
    await transporter.sendMail({
      from: `"Pull Up NYC" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Your Password",
      text: `Please reset your password by clicking on the following link: ${resetUrl}`,
      html: `<b>Please reset your password by clicking on the following link:</b> <a href="${resetUrl}">${resetUrl}</a>`,
    });
  }
  return "Email sent if the account exists.";
}

export async function deleteUserAccount(email) {
  await query("DELETE FROM users WHERE email = ?", [email]);
}
