import React from 'react';

interface PrivacyPolicyProps {
  onBack?: () => void;
}

export default function PrivacyPolicy({ onBack }: PrivacyPolicyProps = {}) {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white">
      {/* Back Button */}
      {onBack && (
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-amber-600 hover:text-amber-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to BridalLink
          </button>
        </div>
      )}
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-amber-800 bridallink-brand mb-4">BridalLink Privacy Policy</h1>
        <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="space-y-8 text-gray-700">
        {/* Introduction */}
        <section>
          <h2 className="text-2xl font-semibold text-amber-800 mb-4">1. Introduction</h2>
          <p className="mb-4">
            Welcome to BridalLink ("we," "our," or "us"). We are committed to protecting your privacy and personal data. 
            This Privacy Policy explains how we collect, use, store, and share your information when you use our wedding 
            planning platform and related services.
          </p>
          <p className="mb-4">
            BridalLink is a comprehensive wedding planning platform that provides budget tracking, guest management, 
            task organization, music playlist creation, expert consultations, and community features for couples 
            planning their weddings.
          </p>
          <p>
            By using our services, you agree to the collection and use of information in accordance with this Privacy Policy.
          </p>
        </section>

        {/* Information We Collect */}
        <section>
          <h2 className="text-2xl font-semibold text-amber-800 mb-4">2. Information We Collect</h2>
          
          <h3 className="text-lg font-semibold text-gray-800 mb-2">2.1 Information You Provide Directly</h3>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>Account information (name, email address, password)</li>
            <li>Wedding planning details (budget, guest lists, task lists, schedules)</li>
            <li>Payment information (processed securely through Stripe)</li>
            <li>Communication preferences and subscription settings</li>
            <li>Content you share in community features (posts, comments, photos)</li>
            <li>Documents and files you upload to our platform</li>
            <li>Music preferences and playlist information</li>
            <li>Expert consultation booking information</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-800 mb-2">2.2 Information Collected Automatically</h3>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>Device information (IP address, browser type, operating system)</li>
            <li>Usage data (pages visited, features used, time spent on platform)</li>
            <li>Log files and error reports for technical support</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-800 mb-2">2.3 Information from Third Parties</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Spotify integration data (with your explicit consent)</li>
            <li>Payment processing information from Stripe</li>
            <li>Social media profile information (if you choose to connect accounts)</li>
          </ul>
        </section>

        {/* How We Use Your Information */}
        <section>
          <h2 className="text-2xl font-semibold text-amber-800 mb-4">3. How We Use Your Information</h2>
          
          <p className="mb-4">We use your information for the following purposes:</p>
          
          <h3 className="text-lg font-semibold text-gray-800 mb-2">3.1 Service Provision</h3>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>Providing and maintaining our wedding planning platform</li>
            <li>Creating and managing your wedding planning dashboard</li>
            <li>Processing payments for premium subscriptions</li>
            <li>Facilitating expert consultations and booking services</li>
            <li>Enabling community features and user interactions</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-800 mb-2">3.2 Communication</h3>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>Sending service-related notifications and updates</li>
            <li>Providing customer support and responding to inquiries</li>
            <li>Sending marketing communications (with your consent)</li>
            <li>Coordinating expert consultation services</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-800 mb-2">3.3 Improvement and Analytics</h3>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>Analyzing usage patterns to improve our services</li>
            <li>Conducting research and development for new features</li>
            <li>Personalizing your experience and recommendations</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-800 mb-2">3.4 Legal and Security</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Complying with legal obligations and regulations</li>
            <li>Protecting against fraud, abuse, and security threats</li>
            <li>Enforcing our Terms of Service and community guidelines</li>
          </ul>
        </section>

        {/* Payment Processing and Stripe */}
        <section>
          <h2 className="text-2xl font-semibold text-amber-800 mb-4">4. Payment Processing and Stripe Integration</h2>
          
          <p className="mb-4">
            We use Stripe, Inc. as our payment processor for all premium subscription transactions. When you make a payment:
          </p>

          <h3 className="text-lg font-semibold text-gray-800 mb-2">4.1 Information Processed by Stripe</h3>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>Payment card information (card number, expiry date, CVC)</li>
            <li>Billing address and contact information</li>
            <li>Transaction amount and currency</li>
            <li>Device and browser information for fraud prevention</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-800 mb-2">4.2 How Stripe Processes Your Data</h3>
          <p className="mb-4">
            Stripe processes your payment information according to their own privacy policy and PCI DSS Level 1 standards. 
            We do not store your complete payment card details on our servers - Stripe securely handles all sensitive 
            payment data. Stripe may share necessary transaction information with us to complete payments and provide 
            customer support, but never your full card details.
          </p>

          <h3 className="text-lg font-semibold text-gray-800 mb-2">4.3 Subscription Management</h3>
          <p className="mb-4">
            We store subscription status, billing history, and payment identifiers (not sensitive card data) to 
            manage your premium subscription, provide customer support, and process refunds when necessary. 
            All payment disputes and chargebacks are handled through Stripe's secure systems.
          </p>

          <h3 className="text-lg font-semibold text-gray-800 mb-2">4.4 Refunds and Cancellations</h3>
          <p className="mb-4">
            When you request a refund or cancel your subscription, we process these through Stripe's secure systems. 
            Refund processing typically takes 5-10 business days depending on your bank. We may retain transaction 
            records for accounting, tax, and legal compliance purposes even after refunds are processed.
          </p>

          <p className="mb-4">
            For more information about Stripe's privacy practices, please review 
            <a href="https://stripe.com/privacy" className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">
              Stripe's Privacy Policy
            </a>.
          </p>
        </section>

        {/* Data Sharing and Disclosure */}
        <section>
          <h2 className="text-2xl font-semibold text-amber-800 mb-4">5. Data Sharing and Disclosure</h2>
          
          <p className="mb-4">We may share your information in the following circumstances:</p>

          <h3 className="text-lg font-semibold text-gray-800 mb-2">5.1 Service Providers</h3>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>Stripe, Inc. for secure payment processing and subscription management</li>
            <li>Supabase for data storage and backend services</li>
            <li>Spotify for music integration features (with your consent)</li>
            <li>Expert consultants for premium consultation services</li>
            <li>Email service providers for communications</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-800 mb-2">5.2 Legal Requirements</h3>
          <p className="mb-4">
            We may disclose your information if required by law, regulation, court order, or government request, 
            or to protect our rights, property, or safety, or that of our users or the public.
          </p>

          <h3 className="text-lg font-semibold text-gray-800 mb-2">5.3 Business Transfers</h3>
          <p className="mb-4">
            In the event of a merger, acquisition, or sale of assets, your information may be transferred 
            to the new entity, subject to the same privacy protections.
          </p>

          <h3 className="text-lg font-semibold text-gray-800 mb-2">5.4 Community Features</h3>
          <p>
            Information you share in community features (posts, comments, photos) may be visible to other users 
            of the platform. You control what information you choose to share publicly.
          </p>
        </section>

        {/* Data Security */}
        <section>
          <h2 className="text-2xl font-semibold text-amber-800 mb-4">6. Data Security</h2>
          
          <p className="mb-4">
            We implement appropriate technical and organizational measures to protect your personal information:
          </p>

          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>Encryption of data in transit and at rest</li>
            <li>Secure payment processing through PCI DSS compliant providers</li>
            <li>Regular security assessments and updates</li>
            <li>Access controls and authentication measures</li>
            <li>Employee training on data protection practices</li>
          </ul>

          <p>
            While we strive to protect your personal information, no method of transmission or storage is 100% secure. 
            We cannot guarantee absolute security but are committed to protecting your data using industry-standard practices.
          </p>
        </section>

        {/* Data Retention */}
        <section>
          <h2 className="text-2xl font-semibold text-amber-800 mb-4">7. Data Retention</h2>
          
          <p className="mb-4">We retain your personal information for as long as necessary to:</p>

          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>Provide our services and maintain your account</li>
            <li>Comply with legal obligations and resolve disputes</li>
            <li>Maintain business records and transaction history</li>
            <li>Improve our services and user experience</li>
          </ul>

          <p className="mb-4">
            When you delete your account, we will delete or anonymize your personal information within 30 days, 
            except where retention is required by law or for legitimate business purposes.
          </p>

          <p>
            Payment and subscription information may be retained longer for tax, legal, and accounting purposes 
            as required by applicable regulations.
          </p>
        </section>

        {/* Your Rights */}
        <section>
          <h2 className="text-2xl font-semibold text-amber-800 mb-4">8. Your Rights and Choices</h2>
          
          <p className="mb-4">Depending on your location, you may have the following rights:</p>

          <h3 className="text-lg font-semibold text-gray-800 mb-2">8.1 Access and Portability</h3>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>Request access to your personal information</li>
            <li>Obtain a copy of your data in a portable format</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-800 mb-2">8.2 Correction and Deletion</h3>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>Update or correct inaccurate information</li>
            <li>Request deletion of your personal information</li>
            <li>Deactivate or delete your account</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-800 mb-2">8.3 Marketing and Communications</h3>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>Opt out of marketing communications</li>
            <li>Manage notification preferences</li>
            <li>Unsubscribe from newsletters and promotional emails</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-800 mb-2">8.4 Data Processing</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Object to processing of your personal information</li>
            <li>Request restriction of processing</li>
            <li>Withdraw consent (where processing is based on consent)</li>
          </ul>

          <p className="mt-4">
            To exercise these rights, please contact us at carolina@bridallink.co.uk or through your account settings.
          </p>
        </section>

        {/* International Transfers */}
        <section>
          <h2 className="text-2xl font-semibold text-amber-800 mb-4">9. International Data Transfers</h2>
          
          <p className="mb-4">
            Your information may be transferred to and processed in countries other than your country of residence. 
            These countries may have different data protection laws than your country.
          </p>

          <p className="mb-4">
            When we transfer your personal information internationally, we ensure appropriate safeguards are in place, 
            including:
          </p>

          <ul className="list-disc list-inside space-y-1">
            <li>Standard contractual clauses approved by relevant authorities</li>
            <li>Adequacy decisions by relevant data protection authorities</li>
            <li>Service provider certifications and compliance programs</li>
          </ul>
        </section>

        {/* Third-Party Services */}
        <section>
          <h2 className="text-2xl font-semibold text-amber-800 mb-4">10. Third-Party Services</h2>
          
          <p className="mb-4">
            Our platform integrates with third-party services to provide enhanced functionality:
          </p>

          <h3 className="text-lg font-semibold text-gray-800 mb-2">10.1 Spotify Integration</h3>
          <p className="mb-4">
            When you connect your Spotify account, you consent to sharing music preferences and playlist data 
            according to Spotify's privacy policy and terms of service.
          </p>

          <h3 className="text-lg font-semibold text-gray-800 mb-2">10.2 Expert Consultation Services</h3>
          <p className="mb-4">
            Premium members may share contact and consultation information with our expert wedding planners 
            to provide personalized advice and support.
          </p>

          <p>
            We are not responsible for the privacy practices of third-party services. We encourage you to 
            review their privacy policies before connecting your accounts.
          </p>
        </section>

        {/* Children's Privacy */}
        <section>
          <h2 className="text-2xl font-semibold text-amber-800 mb-4">11. Children's Privacy</h2>
          
          <p className="mb-4">
            Our services are not intended for individuals under 18 years of age. We do not knowingly collect 
            personal information from children under 18.
          </p>

          <p>
            If we become aware that we have collected personal information from a child under 18, we will 
            take steps to delete such information promptly. If you believe we have collected information 
            from a child, please contact us immediately.
          </p>
        </section>

        {/* Changes to Privacy Policy */}
        <section>
          <h2 className="text-2xl font-semibold text-amber-800 mb-4">12. Changes to This Privacy Policy</h2>
          
          <p className="mb-4">
            We may update this Privacy Policy from time to time to reflect changes in our practices, 
            technology, legal requirements, or other factors.
          </p>

          <p className="mb-4">
            We will notify you of any material changes by:
          </p>

          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>Posting the updated policy on our website</li>
            <li>Sending you an email notification</li>
            <li>Providing notice through our platform</li>
          </ul>

          <p>
            Your continued use of our services after the effective date of the updated Privacy Policy 
            constitutes acceptance of the changes.
          </p>
        </section>

        {/* Contact Information */}
        <section>
          <h2 className="text-2xl font-semibold text-amber-800 mb-4">13. Contact Us</h2>
          
          <p className="mb-4">
            If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, 
            please contact us:
          </p>

          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <p><strong>Email:</strong> carolina@bridallink.co.uk</p>
            <p><strong>Support:</strong> carolina@bridallink.co.uk</p>
            <p><strong>Address:</strong> BridalLink Ltd., United Kingdom</p>
            <p><strong>Data Protection Officer:</strong> carolina@bridallink.co.uk</p>
          </div>

          <p className="mt-4">
            We are committed to resolving any privacy-related concerns and will respond to your inquiry 
            within 30 days of receipt.
          </p>
        </section>

        {/* Regulatory Information */}
        <section>
          <h2 className="text-2xl font-semibold text-amber-800 mb-4">14. Regulatory Compliance</h2>
          
          <p className="mb-4">
            This Privacy Policy complies with applicable data protection regulations, including:
          </p>

          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>General Data Protection Regulation (GDPR) - European Union</li>
            <li>Data Protection Act 2018 - United Kingdom</li>
            <li>California Consumer Privacy Act (CCPA) - United States</li>
            <li>Personal Information Protection and Electronic Documents Act (PIPEDA) - Canada</li>
          </ul>

          <p>
            If you are a resident of the European Economic Area (EEA), United Kingdom, California, or other 
            jurisdictions with specific privacy rights, additional protections may apply to you under local laws.
          </p>
        </section>

        {/* Footer */}
        <section className="border-t pt-6">
          <p className="text-sm text-gray-500 text-center">
            This Privacy Policy is effective as of {new Date().toLocaleDateString()} and applies to all users of the BridalLink platform and services.
          </p>
          <p className="text-sm text-gray-500 text-center mt-2">
            BridalLink - Your Complete Wedding Planning Companion
          </p>
        </section>
      </div>
    </div>
  );
}