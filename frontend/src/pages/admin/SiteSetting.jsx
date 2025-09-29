import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Trash2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  adminGetSiteSettings,
  adminUpdateSiteSettings,
} from "@/api/apiService"; // Removed unused drop import

const ERROR_IMG_PLACEHOLDER =
  "https://placehold.co/200x100/222/fff?text=No+Image";

const SiteSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const settingsRes = await adminGetSiteSettings();
      setSettings(settingsRes.data.settings);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to load site data.";
      setError(errorMsg);
      toast({ title: "Error", description: errorMsg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleNestedChange = (path, value) => {
    setSettings((prev) => {
      const newSettings = JSON.parse(JSON.stringify(prev));
      let current = newSettings;
      for (let i = 0; i < path.length - 1; i++) {
        if (current[path[i]] === undefined) current[path[i]] = {};
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newSettings;
    });
  };

  const addHeroSlide = () => {
    const newSlide = { image: "", title: "", subtitle: "", ctaLink: "" };
    const currentSlides = settings.heroSection || [];
    handleNestedChange(["heroSection"], [...currentSlides, newSlide]);
  };
  const removeHeroSlide = (index) => {
    const updatedSlides = (settings.heroSection || []).filter(
      (_, i) => i !== index
    );
    handleNestedChange(["heroSection"], updatedSlides);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await adminUpdateSiteSettings(settings);
      toast({
        title: "Success",
        description: "Site settings saved successfully.",
      });
      fetchData();
    } catch (err) {
      toast({
        title: "Save Failed",
        description: err.response?.data?.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  if (error)
    return <div className="text-center text-destructive py-10">{error}</div>;
  if (!settings) return null;

  const {
    heroSection = [],
    announcementBanner = {},
    comingSoon = {},
    socialLinks = {},
  } = settings;

  return (
    <Card className="bg-card/50 border-border/50 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl font-bold gradient-text">
            Site & Miscellaneous Settings
          </CardTitle>
          <CardDescription>
            Manage your website's hero section, banners, and other global
            content.
          </CardDescription>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Changes
        </Button>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 space-y-8">
        <div className="p-4 border rounded-lg space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Hero Section Carousel</h3>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addHeroSlide}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Slide
            </Button>
          </div>
          {heroSection.map((slide, index) => (
            <div
              key={index}
              className="p-3 border rounded-md bg-muted/20 relative space-y-3"
            >
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7"
                onClick={() => removeHeroSlide(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <div className="flex items-end gap-4">
                <div className="flex-grow space-y-2">
                  <div>
                    <Label>Image URL</Label>
                    <Input
                      value={slide.image || ""}
                      onChange={(e) =>
                        handleNestedChange(
                          ["heroSection", index, "image"],
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={slide.title || ""}
                      onChange={(e) =>
                        handleNestedChange(
                          ["heroSection", index, "title"],
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label>Subtitle</Label>
                    <Input
                      value={slide.subtitle || ""}
                      onChange={(e) =>
                        handleNestedChange(
                          ["heroSection", index, "subtitle"],
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label>Button Link</Label>
                    <Input
                      placeholder="/collections/all"
                      value={slide.ctaLink || ""}
                      onChange={(e) =>
                        handleNestedChange(
                          ["heroSection", index, "ctaLink"],
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
                <img
                  src={slide.image || ERROR_IMG_PLACEHOLDER}
                  alt="preview"
                  className="w-48 h-auto object-cover rounded-md border"
                  onError={(e) => (e.target.src = ERROR_IMG_PLACEHOLDER)}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Global Announcement Banner
            </h3>
            <div className="flex items-center gap-2">
              <Switch
                id="bannerActive"
                checked={announcementBanner.isActive}
                onCheckedChange={(c) =>
                  handleNestedChange(["announcementBanner", "isActive"], c)
                }
              />
              <Label htmlFor="bannerActive">Active</Label>
            </div>
          </div>
          {announcementBanner.isActive && (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Text</Label>
                <Input
                  value={announcementBanner.text || ""}
                  onChange={(e) =>
                    handleNestedChange(
                      ["announcementBanner", "text"],
                      e.target.value
                    )
                  }
                />
              </div>
              <div>
                <Label>Link (optional)</Label>
                <Input
                  placeholder="/collections/new"
                  value={announcementBanner.link || ""}
                  onChange={(e) =>
                    handleNestedChange(
                      ["announcementBanner", "link"],
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
          )}
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-4 border rounded-lg space-y-3">
            <h3 className="text-lg font-semibold">Coming Soon Page</h3>
            <div>
              <Label>Background Image URL</Label>
              <Input
                value={comingSoon.image || ""}
                onChange={(e) =>
                  handleNestedChange(["comingSoon", "image"], e.target.value)
                }
              />
            </div>
            <div>
              <Label>Display Text</Label>
              <Textarea
                value={comingSoon.text || ""}
                onChange={(e) =>
                  handleNestedChange(["comingSoon", "text"], e.target.value)
                }
              />
            </div>
          </div>
          <div className="p-4 border rounded-lg space-y-3">
            <h3 className="text-lg font-semibold">Contact & Socials</h3>
            {/* --- UPDATED SECTION --- */}
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="help@example.com"
                value={socialLinks.email || ""}
                onChange={(e) =>
                  handleNestedChange(["socialLinks", "email"], e.target.value)
                }
              />
            </div>
            <div>
              <Label>Phone Number</Label>
              <Input
                type="tel"
                placeholder="+91..."
                value={socialLinks.phone || ""}
                onChange={(e) =>
                  handleNestedChange(["socialLinks", "phone"], e.target.value)
                }
              />
            </div>
            <div>
              <Label>Instagram URL</Label>
              <Input
                placeholder="https://instagram.com/..."
                value={socialLinks.instagram || ""}
                onChange={(e) =>
                  handleNestedChange(
                    ["socialLinks", "instagram"],
                    e.target.value
                  )
                }
              />
            </div>
            <div>
              <Label>Twitter / X URL</Label>
              <Input
                placeholder="https://twitter.com/..."
                value={socialLinks.twitter || ""}
                onChange={(e) =>
                  handleNestedChange(["socialLinks", "twitter"], e.target.value)
                }
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SiteSettings;
