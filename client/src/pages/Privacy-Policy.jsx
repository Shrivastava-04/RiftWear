import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-8 text-center">
          Privacy Policy
        </h1>

        <Card className="max-w-3xl mx-auto bg-card/50 border-border/50 shadow-lg p-6">
          <CardContent className="space-y-6 text-foreground/80">
            <p>
              This privacy policy sets out how **Rift Wear** uses and protects
              any information that you give **Rift Wear** when you visit their
              website and/or agree to purchase from them. **Rift Wear** is
              committed to ensuring that your privacy is protected. Should we
              ask you to provide certain information by which you can be
              identified when using this website, and then you can be assured
              that it will only be used in accordance with this privacy
              statement. **Rift Wear** may change this policy from time to time
              by updating this page. You should check this page from time to
              time to ensure that you adhere to these changes.
            </p>

            <h3 className="font-semibold text-lg">What we may collect</h3>
            <p>
              We may collect the following information: Name, Contact
              information including email address, Demographic information such
              as postcode, preferences and interests, if required, Other
              information relevant to customer surveys and/or offers.
            </p>

            <h3 className="font-semibold text-lg">
              What we do with the information we gather
            </h3>
            <p>
              We require this information to understand your needs and provide
              you with a better service, and in particular for the following
              reasons:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Internal record keeping.</li>
              <li>
                We may use the information to improve our products and services.
              </li>
              <li>
                We may periodically send promotional emails about new products,
                special offers or other information which we think you may find
                interesting using the email address which you have provided.
              </li>
              <li>
                From time to time, we may also use your information to contact
                you for market research purposes. We may contact you by email,
                phone, fax or mail.
              </li>
              <li>
                We may use the information to customise the website according to
                your interests.
              </li>
            </ul>

            <h3 className="font-semibold text-lg">Security</h3>
            <p>
              We are committed to ensuring that your information is secure. In
              order to prevent unauthorised access or disclosure we have put in
              suitable measures.
            </p>

            <h3 className="font-semibold text-lg">How we use cookies</h3>
            <p>
              A cookie is a small file which asks permission to be placed on
              your computer's hard drive. Once you agree, the file is added and
              the cookie helps analyze web traffic or lets you know when you
              visit a particular site. Cookies allow web applications to respond
              to you as an individual. The web application can tailor its
              operations to your needs, likes and dislikes by gathering and
              remembering information about your preferences.
            </p>
            <p>
              We use traffic log cookies to identify which pages are being used.
              This helps us analyze data about webpage traffic and improve our
              website in order to tailor it to customer needs. We only use this
              information for statistical analysis purposes and then the data is
              removed from the system.
            </p>
            <p>
              Overall, cookies help us provide you with a better website, by
              enabling us to monitor which pages you find useful and which you
              do not. A cookie in no way gives us access to your computer or any
              information about you, other than the data you choose to share
              with us.
            </p>
            <p>
              You can choose to accept or decline cookies. Most web browsers
              automatically accept cookies, but you can usually modify your
              browser setting to decline cookies if you prefer. This may prevent
              you from taking full advantage of the website.
            </p>

            <h3 className="font-semibold text-lg">
              Controlling your personal information
            </h3>
            <p>
              You may choose to restrict the collection or use of your personal
              information in the following ways:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                whenever you are asked to fill in a form on the website, look
                for the box that you can click to indicate that you do not want
                the information to be used by anybody for direct marketing
                purposes.
              </li>
              <li>
                if you have previously agreed to us using your personal
                information for direct marketing purposes, you may change your
                mind at any time by writing to or emailing us at
                riftwear.help@gmail.com.
              </li>
            </ul>
            <p>
              We will not sell, distribute or lease your personal information to
              third parties unless we have your permission or are required by
              law to do so. We may use your personal information to send you
              promotional information about third parties which we think you may
              find interesting if you tell us that you wish this to happen.
            </p>
            <p>
              If you believe that any information we are holding on you is
              incorrect or incomplete, please write to Aquamarine hostel, IIT
              (ISM) Dhanbad, Dhanbad, Jharkhand, 826004 Dhanbad JHARKHAND
              826004. or contact us at 7898782596 or riftwear.help@gmail.com as
              soon as possible. We will promptly correct any information found
              to be incorrect.
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

export default PrivacyPolicy;
