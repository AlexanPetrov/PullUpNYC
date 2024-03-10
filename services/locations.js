import { query } from "@/utils/db";

export const getAll = async () => {
  return await query("SELECT * FROM locations");
};

export const getAllByUserId = async (userId) => {
  return await query("SELECT * FROM locations WHERE userId = ?", [userId]);
};

export const addLocation = async ({
  name,
  address,
  description,
  zip,
  rating,
  latitude,
  longitude,
  userId,
}) => {
  const result = await query(
    "INSERT INTO locations (name, address, description, zip, rating, latitude, longitude, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [name, address, description, zip, rating, latitude, longitude, userId]
  );
  return result.insertId;
};

export const deleteLocation = async (locationId) => {
  return await query("DELETE FROM locations WHERE id = ?", [locationId]);
};

export const updateLocation = async ({
  id,
  name,
  address,
  description,
  zip,
  rating,
  latitude,
  longitude,
  userId,
}) => {
  const [existingLocation] = await query(
    "SELECT userId FROM locations WHERE id = ?",
    [id]
  );

  if (!existingLocation || existingLocation.userId !== userId) {
    throw new Error("Unauthorized: You can only update your own locations.");
  }

  await query(
    "UPDATE locations SET name = ?, address = ?, description = ?, zip = ?, rating = ?, latitude = ?, longitude = ?, userId = ? WHERE id = ?",
    [name, address, description, zip, rating, latitude, longitude, userId, id]
  );
};
