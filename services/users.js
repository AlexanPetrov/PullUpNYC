import { query } from "@/utils/db";

export const getAll = {
  async findAllUsers() {
    return await query("SELECT id, email, created_at FROM users");
  },
};
