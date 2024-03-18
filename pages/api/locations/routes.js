// Import the necessary functions from your locations service
import {
  getAll,
  getAllByUserId,
  addLocation,
  deleteLocation,
  updateLocation,
} from "@/services/locations";

// The main handler function for your API endpoint
export default async function handler(req, res) {
  // Handle GET requests
  // if (req.method === "GET") {
  //   const userId = req.query.userId;

  //   // If userId is not provided, fetch and return all locations
  //   if (!userId) {
  //     try {
  //       const locations = await getAll();
  //       return res.status(200).json(locations);
  //     } catch (error) {
  //       console.error("Error fetching all locations:", error);
  //       // Ensuring the error message is in a proper JSON format
  //       return res.status(500).json({
  //         error: "Failed to fetch all locations",
  //         message: error.toString(),
  //       });
  //     }
  //   } else {
  //     // If userId is provided, fetch and return locations for that user
  //     try {
  //       const locations = await getAllByUserId(userId);
  //       res.status(200).json(locations);
  //     } catch (error) {
  //       console.error("Error fetching locations by userId:", error);
  //       res.status(500).json({ error: "Failed to fetch locations by userId" });
  //     }
  //   }
  // }

  if (req.method === "GET") {
    const userId = req.query.userId;

    // If userId is not provided, fetch and return all locations
    if (!userId) {
      try {
        const locations = await getAll();
        return res.status(200).json(locations);
      } catch (error) {
        console.error("Error fetching all locations:", error);
        // Ensuring the error message is in a proper JSON format
        return res.status(500).json({
          error: "Failed to fetch all locations",
          message: error.message, // Providing a more specific error message
        });
      }
    } else {
      // If userId is provided, fetch and return locations for that user
      try {
        const locations = await getAllByUserId(userId);
        res.status(200).json(locations);
      } catch (error) {
        console.error("Error fetching locations by userId:", error);
        // Providing a more specific error message for this case as well
        res.status(500).json({
          error: "Failed to fetch locations by userId",
          message: error.message, // Including the specific error message
        });
      }
    }
  }

  // Handle POST requests for adding a new location
  else if (req.method === "POST") {
    try {
      if (!req.body.userId) {
        return res.status(400).json({ error: "UserId is required" });
      }

      const locationId = await addLocation(req.body);
      res
        .status(201)
        .json({ message: "Location added successfully", locationId });
    } catch (error) {
      console.error("Error adding location:", error);
      res.status(500).json({ error: "Failed to add location" });
    }
  }
  // Handle DELETE requests for deleting locations
  else if (req.method === "DELETE") {
    try {
      const { locationIds } = req.body;
      await Promise.all(locationIds.map((id) => deleteLocation(id)));
      res.status(200).json({ message: "Locations deleted successfully" });
    } catch (error) {
      console.error("Error deleting locations:", error);
      res.status(500).json({ error: "Failed to delete locations" });
    }
  }
  // Handle PUT requests for updating locations
  else if (req.method === "PUT") {
    try {
      await updateLocation(req.body);
      res.status(200).json({ message: "Location updated successfully" });
    } catch (error) {
      console.error("Error updating location:", error);
      res.status(500).json({ error: "Failed to update location" });
    }
  }
  // Handle any unsupported HTTP methods
  else {
    res.setHeader("Allow", ["GET", "POST", "DELETE", "PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
