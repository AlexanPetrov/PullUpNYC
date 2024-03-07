import {
  getAll,
  addLocation,
  deleteLocation,
  updateLocation,
} from "@/services/locations";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const locations = await getAll();
      res.status(200).json(locations);
    } catch (error) {
      console.error("Error fetching locations:", error);
      res.status(500).json({ error: "Failed to fetch locations" });
    }
  } else if (req.method === "POST") {
    try {
      const locationId = await addLocation(req.body);
      res
        .status(201)
        .json({ message: "Location added successfully", locationId });
    } catch (error) {
      console.error("Error adding location:", error);
      res.status(500).json({ error: "Failed to add location" });
    }
  } else if (req.method === "DELETE") {
    try {
      const { locationIds } = req.body;
      await Promise.all(locationIds.map((id) => deleteLocation(id)));
      res.status(200).json({ message: "Locations deleted successfully" });
    } catch (error) {
      console.error("Error deleting locations:", error);
      res.status(500).json({ error: "Failed to delete locations" });
    }
  } else if (req.method === "PUT") {
    try {
      await updateLocation(req.body);
      res.status(200).json({ message: "Location updated successfully" });
    } catch (error) {
      console.error("Error updating location:", error);
      res.status(500).json({ error: "Failed to update location" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "DELETE", "PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
