import DropDate from "../models/dropDate.model.js";

// Admin function to set or update the drop date
export const setDropEndDate = async (req, res) => {
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

export const setDropStartDate = async (req, res) => {
  try {
    const { startDate } = req.body;
    if (!startDate) {
      return res.status(400).json({ message: "Start date is required" });
    }
    const drop = await DropDate.findOneAndUpdate(
      {},
      {
        startDate: new Date(startDate),
      },
      { new: true, upsert: true, runValidators: true }
    );
    res
      .status(200)
      .json({ message: "Drop Start date updated successfully", drop });
  } catch (error) {
    console.log("Error setting Drop Date", error);
    res.status(500).json({ message: "Internal Server Error" });
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
