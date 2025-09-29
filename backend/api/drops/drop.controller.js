import Drop from "./drop.model.js";
import mongoose from "mongoose";

// Helper function to ensure only one drop is active
const deactivateOtherDrops = async (excludeId = null) => {
  const filter = { isActive: true };
  if (excludeId) {
    filter._id = { $ne: excludeId };
  }
  await Drop.updateMany(filter, { $set: { isActive: false } });
};

export const createDrop = async (req, res) => {
  try {
    const dropData = req.body;
    if (
      !dropData.name ||
      !dropData.targetCollection ||
      !dropData.startDate ||
      !dropData.endDate
    ) {
      return res.status(400).json({
        message: "Name, target, start date, and end date are required.",
      });
    }
    // If this new drop is being set as active, deactivate all others first.
    if (dropData.isActive) {
      await deactivateOtherDrops();
    }
    const newDrop = new Drop(dropData);
    await newDrop.save();
    res.status(201).json({
      success: true,
      message: "Drop created successfully.",
      drop: newDrop,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error." });
  }
};

export const getAllDrops = async (req, res) => {
  try {
    const drops = await Drop.find({}).sort({ startDate: -1 });
    res.status(200).json({ success: true, drops });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error." });
  }
};

// ADD THIS NEW FUNCTION (can be placed before or after getAllDrops)

/**
 * @desc    Get the single, globally active drop
 * @route   GET /api/v1/drops/active
 * @access  Public
 */
export const getActiveDrop = async (req, res) => {
  try {
    // This finds the one document in the collection that is currently active.
    const activeDrop = await Drop.findOne({ isActive: true });
    res.status(200).json({ success: true, activeDrop });
  } catch (error) {
    console.error("Error fetching active drop:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

export const updateDrop = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    // If this drop is being activated, ensure all others are deactivated first.
    if (updateData.isActive) {
      await deactivateOtherDrops(id);
    }
    const updatedDrop = await Drop.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedDrop)
      return res.status(404).json({ message: "Drop not found." });
    res.status(200).json({
      success: true,
      message: "Drop updated successfully.",
      drop: updatedDrop,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error." });
  }
};

export const deleteDrop = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDrop = await Drop.findByIdAndDelete(id);
    if (!deletedDrop)
      return res.status(404).json({ message: "Drop not found." });
    res
      .status(200)
      .json({ success: true, message: "Drop deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error." });
  }
};

// Public function remains the same
export const checkDropStatus = async (req, res) => {
  try {
    const { collectionName } = req.body;
    if (!collectionName)
      return res.status(400).json({ message: "Collection name is required." });
    const drop = await Drop.findOne({
      targetCollection: collectionName,
      isActive: true,
    });
    if (!drop)
      return res.json({
        isLive: false,
        message: "No active drop found for this collection.",
      });
    const now = new Date();
    const isLive = now >= drop.startDate && now <= drop.endDate;
    const message = isLive
      ? "The drop is currently live."
      : "This drop is not currently active.";
    res.status(200).json({ isLive, message, drop });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error." });
  }
};
