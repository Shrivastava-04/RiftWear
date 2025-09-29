import mongoose from "mongoose";

const siteSettingsSchema = new mongoose.Schema(
  {
    uniqueIdentifier: {
      type: String,
      default: "main_settings",
      unique: true,
    },
    heroSection: {
      type: [
        {
          image: { type: String, required: true },
          title: String,
          subtitle: String,
          ctaLink: String,
        },
      ],
      default: [],
    },
    comingSoon: {
      type: {
        image: String,
        text: { type: String, default: "Something new is on the way." },
      },
      default: {},
    },
    announcementBanner: {
      type: {
        isActive: { type: Boolean, default: false },
        text: String,
        link: String,
      },
      default: {},
    },
    socialLinks: {
      type: {
        instagram: String,
        facebook: String,
        twitter: String,
        email: String,
        phone: String,
      },
      default: {},
    },
  },
  { timestamps: true }
);

const SiteSettings = mongoose.model("SiteSettings", siteSettingsSchema);

export const getSiteSettings = async () => {
  let settings = await SiteSettings.findOne({
    uniqueIdentifier: "main_settings",
  });
  if (!settings) {
    settings = new SiteSettings();
    await settings.save();
  }
  return settings;
};

export default SiteSettings;
