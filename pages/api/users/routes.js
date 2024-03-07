import { getAll } from "@/services/users";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const users = await getAll.findAllUsers();
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
