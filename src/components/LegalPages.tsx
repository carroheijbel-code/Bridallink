import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ArrowLeft, Shield, FileText, Mail } from 'lucide-react';

interface LegalPagesProps {
  type: 'privacy' | 'terms';
  onBack: () => void;
}

export default function LegalPages({ type, onBack }: LegalPagesProps) {
  if (type === 'privacy') {
    return (
      <div className="min-h-screen bg-rose-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={onBack}
              className="flex items-center gap-2 text-amber-800 hover:text-amber-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>

          <Card className="max-w-4xl mx-auto p-8">
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="bg-gradient-to-r from-amber-100 to-rose-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                  <Shield className="h-8 w-8 text-amber-600" />
                </div>
                <h1 className="text-3xl text-amber-800">Privacy Policy</h1>
                <p className="text-amber-700">Last updated: {new Date().toLocaleDateString()}</p>
              </div>

              <div className="space-y-8 text-gray-700">
                <section>
                  <h2 className="text-xl text-amber-800 mb-4">Information We Collect</h2>
                  <p className="mb-4">
                    At BridalLink, we collect information you provide directly to us, such as when you create an account, 
                    plan your wedding, or contact us for support.
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Account information (name, email address)</li>
                    <li>Wedding planning data (dates, venues, guest lists)</li>
                    <li>Budget and expense information</li>
                    <li>Communication preferences</li>
                    <li>Device and usage information</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl text-amber-800 mb-4">How We Use Your Information</h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide and maintain our wedding planning services</li>
                    <li>Send you updates about your wedding plans</li>
                    <li>Improve our app features and user experience</li>
                    <li>Provide customer support</li>
                    <li>Send promotional emails (with your consent)</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl text-amber-800 mb-4">Information Sharing</h2>
                  <p className="mb-4">
                    We do not sell, trade, or otherwise transfer your personal information to third parties except as described below:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>With your explicit consent</li>
                    <li>To comply with legal obligations</li>
                    <li>To protect our rights and safety</li>
                    <li>With service providers who assist in our operations</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl text-amber-800 mb-4">Data Security</h2>
                  <p>
                    We implement appropriate security measures to protect your personal information against unauthorized 
                    access, alteration, disclosure, or destruction. However, no method of transmission over the internet 
                    is 100% secure.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl text-amber-800 mb-4">Your Rights</h2>
                  <p className="mb-4">You have the right to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Access and update your personal information</li>
                    <li>Delete your account and associated data</li>
                    <li>Opt out of promotional communications</li>
                    <li>Request data portability</li>
                    <li>Contact us about privacy concerns</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl text-amber-800 mb-4">Contact Us</h2>
                  <p>
                    If you have questions about this Privacy Policy, please contact us at:
                  </p>
                  <div className="bg-rose-50 p-4 rounded-lg mt-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-amber-600" />
                      <span>privacy@bridallink.com</span>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Terms of Service
  return (
    <div className="min-h-screen bg-rose-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2 text-amber-800 hover:text-amber-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        <Card className="max-w-4xl mx-auto p-8">
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="bg-gradient-to-r from-amber-100 to-rose-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <FileText className="h-8 w-8 text-amber-600" />
              </div>
              <h1 className="text-3xl text-amber-800">Terms of Service</h1>
              <p className="text-amber-700">Last updated: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="space-y-8 text-gray-700">
              <section>
                <h2 className="text-xl text-amber-800 mb-4">Acceptance of Terms</h2>
                <p>
                  By accessing and using BridalLink, you accept and agree to be bound by the terms and provision 
                  of this agreement.
                </p>
              </section>

              <section>
                <h2 className="text-xl text-amber-800 mb-4">Description of Service</h2>
                <p className="mb-4">
                  BridalLink is a wedding planning application that provides tools for:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Wedding budget tracking and management</li>
                  <li>Guest list organization and RSVP management</li>
                  <li>Wedding timeline and task management</li>
                  <li>Venue and vendor coordination tools</li>
                  <li>Document storage and organization</li>
                  <li>Community features for couples</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl text-amber-800 mb-4">User Responsibilities</h2>
                <p className="mb-4">As a user of BridalLink, you agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account</li>
                  <li>Use the service lawfully and respectfully</li>
                  <li>Not share inappropriate content in community features</li>
                  <li>Respect other users' privacy and rights</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl text-amber-800 mb-4">Premium Services</h2>
                <p className="mb-4">
                  Premium features are available through subscription plans:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Monthly subscription: £4.99/month</li>
                  <li>Annual subscription: £49.99/year</li>
                  <li>Includes expert wedding planning consultations</li>
                  <li>10-minute free consultation for new premium members</li>
                  <li>Additional consultations at £40/hour</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl text-amber-800 mb-4">Cancellation and Refunds</h2>
                <p>
                  You may cancel your premium subscription at any time. Cancellations will take effect at the end 
                  of your current billing period. Refunds are generally not provided for partial subscription periods.
                </p>
              </section>

              <section>
                <h2 className="text-xl text-amber-800 mb-4">Limitation of Liability</h2>
                <p>
                  BridalLink provides tools to assist with wedding planning, but we are not responsible for actual 
                  wedding arrangements, vendor performance, or wedding day outcomes. Users are responsible for 
                  verifying all details with their chosen vendors.
                </p>
              </section>

              <section>
                <h2 className="text-xl text-amber-800 mb-4">Changes to Terms</h2>
                <p>
                  We reserve the right to modify these terms at any time. Users will be notified of significant 
                  changes, and continued use of the service constitutes acceptance of modified terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl text-amber-800 mb-4">Contact Information</h2>
                <p>
                  Questions about these Terms of Service can be directed to:
                </p>
                <div className="bg-rose-50 p-4 rounded-lg mt-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-amber-600" />
                    <span>support@bridallink.com</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}