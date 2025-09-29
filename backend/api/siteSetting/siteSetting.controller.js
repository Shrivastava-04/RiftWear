import SiteSettings, { getSiteSettings } from "./siteSetting.modal.js";

/**
 * @desc    Get the site settings document
 * @route   GET /api/v1/settings
 * @access  Private/Admin
 */
export const getSettings = async (req, res) => {
  try {
    // Use the singleton helper to find or create the settings,
    // then populate the activeDrop field to get full drop details.
    const settings = await getSiteSettings();
    // const populatedSettings = await settings.;

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("Error fetching site settings:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

/**
 * @desc    Update the site settings document
 * @route   PUT /api/v1/settings
 * @access  Private/Admin
 */
export const updateSettings = async (req, res) => {
  try {
    // First, get the single settings document's ID
    const currentSettings = await getSiteSettings();

    // Then, update it with the data from the request body
    const updatedSettings = await SiteSettings.findByIdAndUpdate(
      currentSettings._id,
      req.body,
      { new: true, runValidators: true } // Return the updated doc
    ).populate("activeDrop"); // Populate the response with drop details

    if (!updatedSettings) {
      return res.status(404).json({ message: "Site settings not found." });
    }

    res.status(200).json({
      success: true,
      message: "Site settings updated successfully.",
      settings: updatedSettings,
    });
  } catch (error) {
    console.error("Error updating site settings:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};
