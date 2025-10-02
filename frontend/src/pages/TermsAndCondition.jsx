import React from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-8 text-center">
          Terms & Conditions
        </h1>

        <Card className="max-w-3xl mx-auto bg-card/50 border-border/50 shadow-lg p-6">
          <CardContent className="space-y-6 text-foreground/80">
            <p>
              For the purpose of these Terms and Conditions, The term "we",
              "us", "our" used anywhere on this page shall mean **Rift Wear**,
              whose registered/operational office is Aquamarine hostel, IIT
              (ISM) Dhanbad, Dhanbad, Jharkhand, 826004 Dhanbad JHARKHAND
              826004.
            </p>
            <p>
              "you", “your”, "user", “visitor” shall mean any natural or legal
              person who is visiting our website and/or agreed to purchase from
              us. Your use of the website and/or purchase from us are governed
              by the following Terms and Conditions:
            </p>
            <p>
              The content of the pages of this website is subject to change
              without notice. Neither we nor any third parties provide any
              warranty or guarantee as to the accuracy, timeliness, performance,
              completeness or suitability of the information and materials found
              or offered on this website for any particular purpose. You
              acknowledge that such information and materials may contain
              inaccuracies or errors and we expressly exclude liability for any
              such inaccuracies or errors to the fullest extent permitted by
              law.
            </p>
            <p>
              Your use of any information or materials on our website and/or
              product pages is entirely at your own risk, for which we shall not
              be liable. It shall be your own responsibility to ensure that any
              products, services or information available through our website
              and/or product pages meet your specific requirements.
            </p>
            <p>
              Our website contains material which is owned by or licensed to us.
              This material includes, but is not limited to, the design, layout,
              look, appearance and graphics. Reproduction is prohibited other
              than in accordance with the copyright notice, which forms part of
              these terms and conditions. All trademarks reproduced in our
              website which are not the property of, or licensed to, the
              operator are acknowledged on the website.
            </p>
            <p>
              Unauthorized use of information provided by us shall give rise to
              a claim for damages and/or be a criminal offense. From time to
              time our website may also include links to other websites. These
              links are provided for your convenience to provide further
              information. You may not create a link to our website from another
              website or document without **Rift Wear**’s prior written consent.
            </p>
            <p>
              Any dispute arising out of use of our website and/or purchase with
              us and/or any engagement with us is subject to the laws of India.
              We, shall be under no liability whatsoever in respect of any loss
              or damage arising directly or indirectly out of the decline of
              authorization for any Transaction, on Account of the Cardholder
              having exceeded the preset limit mutually agreed by us with our
              acquiring bank from time to time.
            </p>
          </CardContent>
          <div className="text-center mt-8">
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link to="/">
                <Home className="h-4 w-4 mr-2" /> Back to Home
              </Link>
            </Button>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default TermsConditions;
