import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-primary border-t border-border/40">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src={logo} alt="Rift Wear" className="h-8 w-8" />
              <span className="text-xl font-bold gradient-text">Rift Wear</span>
            </div>
            <p className="text-sm text-foreground/70 max-w-xs">
              Premium streetwear for the next generation. Unleash your style
              with our carefully curated collection.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="hover:text-accent">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-accent">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-accent">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-accent">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Quick Links
            </h3>
            <nav className="flex flex-col space-y-2">
              <Link
                to="/explore"
                className="text-sm text-foreground/70 hover:text-accent transition-colors"
              >
                All Products
              </Link>
              <Link
                to="/explore?category=new"
                className="text-sm text-foreground/70 hover:text-accent transition-colors"
              >
                New Arrivals
              </Link>
              <Link
                to="/explore?category=hoodies"
                className="text-sm text-foreground/70 hover:text-accent transition-colors"
              >
                Hoodies
              </Link>
              <Link
                to="/explore?category=tshirts"
                className="text-sm text-foreground/70 hover:text-accent transition-colors"
              >
                T-Shirts
              </Link>
              <Link
                to="/explore?category=sale"
                className="text-sm text-foreground/70 hover:text-accent transition-colors"
              >
                Sale
              </Link>
            </nav>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Customer Service
            </h3>
            <nav className="flex flex-col space-y-2">
              <Link
                to="/contact"
                className="text-sm text-foreground/70 hover:text-accent transition-colors"
              >
                Contact Us
              </Link>
              <Link
                to="/shipping-policy"
                className="text-sm text-foreground/70 hover:text-accent transition-colors"
              >
                Shipping Info
              </Link>
              <Link
                to="/cancellation-refund-policy"
                className="text-sm text-foreground/70 hover:text-accent transition-colors"
              >
                Returns & Exchanges
              </Link>
              <Link
                to="/terms-and-conditions"
                className="text-sm text-foreground/70 hover:text-accent transition-colors"
              >
                Terms and Conditions
              </Link>
              <Link
                to="/privacy-policy"
                className="text-sm text-foreground/70 hover:text-accent transition-colors"
              >
                Privacy Policy
              </Link>
            </nav>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Stay Updated
            </h3>
            <p className="text-sm text-foreground/70">
              Subscribe to get special offers, free giveaways, and
              once-in-a-lifetime deals.
            </p>
            <div className="space-y-2">
              <Input
                placeholder="Enter your email"
                className="bg-secondary/50 border-border/50"
              />
              <Button variant="cta" className="w-full">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border/40">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-foreground/60">
              © 2024 Rift Wear. All rights reserved.
            </p>
            <nav className="flex space-x-6">
              <Link
                to="/privacy"
                className="text-sm text-foreground/60 hover:text-accent transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-sm text-foreground/60 hover:text-accent transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/cookies"
                className="text-sm text-foreground/60 hover:text-accent transition-colors"
              >
                Cookie Policy
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
