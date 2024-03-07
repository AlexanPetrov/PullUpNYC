import { query } from "@/utils/db";

export const getAll = async () => {
  return await query("SELECT * FROM locations");
};

export const addLocation = async ({
  name,
  address,
  description,
  zip,
  rating,
  latitude,
  longitude,
}) => {
  const result = await query(
    "INSERT INTO locations (name, address, description, zip, rating, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [name, address, description, zip, rating, latitude, longitude]
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
}) => {
  await query(
    "UPDATE locations SET name = ?, address = ?, description = ?, zip = ?, rating = ?, latitude = ?, longitude = ? WHERE id = ?",
    [name, address, description, zip, rating, latitude, longitude, id]
  );
};
