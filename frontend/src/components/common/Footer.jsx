import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-primary border-t border-border/40">
      <div className="container mx-auto px-4 py-12">
        {/* Bottom Section */}
        {/* <div className="mt-12 pt-8 border-t border-border/40"> */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-foreground/60">
            © 2025 Rift. All rights reserved.
          </p>
          <nav className="flex space-x-6">
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
        {/* </div> */}
      </div>
    </footer>
  );
};

export default Footer;
