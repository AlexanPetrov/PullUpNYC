import { deleteUserAccount } from "@/services/auth";

export default async function handler(req, res) {
  console.log("Request method:", req.method);
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email } = req.body;
    await deleteUserAccount(email);
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    res
      .status(500)
      .json({ error: "Failed to delete account. Please try again later." });
  }
}
