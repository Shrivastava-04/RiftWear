// import DropDate from "../models/dropDate.model.js";

// // Admin function to set or update the drop date
// export const setDropDate = async (req, res) => {
//   try {
//     const { endDate } = req.body;
//     if (!endDate) {
//       return res.status(400).json({ message: "End date is required." });
//     }

//     // Find and update the single drop date document, or create it if it doesn't exist
//     const drop = await DropDate.findOneAndUpdate(
//       {}, // An empty filter finds the first document
//       { endDate: new Date(endDate) },
//       { new: true, upsert: true, runValidators: true } // Creates if not found, returns the new doc
//     );

//     res.status(200).json({ message: "Drop date updated successfully!", drop });
//   } catch (error) {
//     console.error("Error setting drop date:", error);
//     res.status(500).json({ message: "Internal Server Error." });
//   }
// };

// // Public function to get the current drop date
// export const getDropDate = async (req, res) => {
//   try {
//     const drop = await DropDate.findOne({});
//     if (!drop) {
//       return res.status(404).json({ message: "No active drop found." });
//     }
//     res.status(200).json(drop);
//   } catch (error) {
//     console.error("Error getting drop date:", error);
//     res.status(500).json({ message: "Internal Server Error." });
//   }
// };
import DropDate from "../models/dropDate.model.js";

// Admin function to set or update the drop date
export const setDropDate = async (req, res) => {
  try {
    // The frontend is now sending a single ISO 8601 string
    const { endDate } = req.body;
    if (!endDate) {
      return res.status(400).json({ message: "End date is required." });
    }

    const drop = await DropDate.findOneAndUpdate(
      {},
      { endDate: new Date(endDate) },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ message: "Drop date updated successfully!", drop });
  } catch (error) {
    console.error("Error setting drop date:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

// Public function to get the current drop date
export const getDropDate = async (req, res) => {
  try {
    const drop = await DropDate.findOne({});
    if (!drop) {
      return res.status(404).json({ message: "No active drop found." });
    }
    res.status(200).json(drop);
  } catch (error) {
    console.error("Error getting drop date:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};
