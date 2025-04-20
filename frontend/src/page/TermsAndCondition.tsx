import { AlertTriangle, ClipboardCheck, Copyright, CreditCard, Layout, Lock, Mail, Phone, RefreshCw, Scale, Scroll, Shield, User, UserCheck, XCircle } from "lucide-react"

const TermsAndCondition = () => {
  return (
    <div className="min-h-screen bg-blue-50/30">
      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 max-w-6xl">
        <div className="flex flex-col items-center mb-6 sm:mb-8 text-center">
          <div className="bg-blue-100 p-4 sm:p-6 rounded-full mb-4 sm:mb-6">
            <Shield className="h-10 w-10 sm:h-14 sm:w-14 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3">
            Terms and Conditions
          </h1>
          <div className="flex gap-4">
            <p className="text-sm sm:text-base text-muted-foreground mb-1">Effective Date: April 20, 2025</p>
            <p className="text-sm sm:text-base text-muted-foreground">Last Updated: April 20, 2025</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4 sm:p-6 md:p-8">
          <p className="text-sm sm:text-base text-foreground mb-6">
            Welcome to CondoPal a rental management platform that helps landlords manage their rental properties
            efficiently and allows tenants to experience a streamlined renting process. By accessing or using CondoPal,
            you agree to these Terms and Conditions ("Terms"). If you do not agree, please do not use our services.
          </p>

          <div className="space-y-8 sm:space-y-10">
            <section>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Scroll className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">1. Definitions</h2>
              </div>
              <ul className="pl-4 sm:pl-6 mb-4 text-sm sm:text-base text-foreground space-y-2">
                <li>
                  <span className="font-medium">CondoPal:</span> The web application operated by CondoPal for rental management services.
                </li>
                <li>
                  <span className="font-medium">Landlord:</span> A User who owns and rents out one or more condo units.
                </li>
                <li>
                  <span className="font-medium">Tenant:</span> A User who rents a condo unit from a Landlord.
                </li>
                <li>
                  <span className="font-medium">Subscription:</span> The paid plan granting access to CondoPal's
                  features.
                </li>
                <li>
                  <span className="font-medium">Add-On Services:</span> Optional services like legal support for
                  landlords.
                </li>
                <li>
                  <span className="font-medium">Payment Processor:</span> PayMongo, a 3rd party payment gateway used to facilitate
                  transactions on the platform.
                </li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <UserCheck className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">2. Eligibility & Account Registration</h2>
              </div>
              <ul className="list-disc pl-8 sm:pl-10 mb-4 text-sm sm:text-base text-foreground space-y-2">
                <li>You must be at least 18 years old and authorized to enter into contracts to use CondoPal.</li>
                <li>
                  You agree to provide accurate, current, and complete information during registration and to keep it
                  updated.
                </li>
                <li>
                  You are responsible for safeguarding your account credentials and all activities conducted under your
                  account.
                </li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">3. Subscription & Payment Terms</h2>
              </div>

              <div className="pl-3 sm:pl-4 border-l-2 border-blue-100 mt-4 sm:mt-6 mb-4">
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Subscription Plans</h3>
                <ul className="list-disc pl-8 sm:pl-10 mb-4 text-sm sm:text-base text-foreground space-y-1">
                  <li>
                    CondoPal is a subscription-based service. Pricing details and features are displayed during the
                    signup process.
                  </li>
                  <li>
                    Your subscription will automatically renew unless canceled at least 7 days before the next billing
                    date.
                  </li>
                </ul>
              </div>

              <div className="pl-3 sm:pl-4 border-l-2 border-blue-100 mt-4 sm:mt-6 mb-4">
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Billing Information</h3>
                <ul className="list-disc pl-8 sm:pl-10 mb-4 text-sm sm:text-base text-foreground space-y-1">
                  <li>
                    Payments for subscriptions are processed through PayMongo, which supports various banks and digital
                    wallets in the Philippines, including BPI, GCash, and others.
                  </li>
                  <li>
                    By subscribing to CondoPal, you authorize PayMongo to charge your chosen payment method for
                    subscription fees.
                  </li>
                </ul>
              </div>

              <div className="pl-3 sm:pl-4 border-l-2 border-blue-100 mt-4 sm:mt-6 mb-4">
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Late or Failed Payments</h3>
                <ul className="list-disc pl-8 sm:pl-10 mb-4 text-sm sm:text-base text-foreground space-y-1">
                  <li>If a payment fails, your access to CondoPal may be suspended until payment is received.</li>
                  <li>No refunds are issued for partial billing periods.</li>
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Layout className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">4. Core Features & Use</h2>
              </div>

              <div className="space-y-4">
                <div className="pl-3 sm:pl-4 border-l-2 border-blue-100">
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Online Rent Collection</h3>
                  <ul className="list-disc pl-8 sm:pl-10 mb-4 text-sm sm:text-base text-foreground space-y-1">
                    <li>
                      Tenants pay rent via PayMongo, which supports various payment methods (e.g., bank transfers,
                      digital wallets).
                    </li>
                    <li>Payment reminders are automatically sent to tenants before the due date.</li>
                  </ul>
                </div>

                <div className="pl-3 sm:pl-4 border-l-2 border-blue-100">
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Income & Expense Tracking</h3>
                  <ul className="list-disc pl-8 sm:pl-10 mb-4 text-sm sm:text-base text-foreground space-y-1">
                    <li>CondoPal automatically tracks rent payments and maintenance costs.</li>
                    <li>
                      A calendar view shows when payments are due and when expenses (e.g., maintenance) are recorded.
                    </li>
                  </ul>
                </div>

                <div className="pl-3 sm:pl-4 border-l-2 border-blue-100">
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Maintenance Requests</h3>
                  <ul className="list-disc pl-8 sm:pl-10 mb-4 text-sm sm:text-base text-foreground space-y-1">
                    <li>Tenants can submit maintenance requests via the CondoPal platform.</li>
                    <li>
                      Real-time updates on the status of maintenance requests are provided to both tenants and
                      landlords.
                    </li>
                    <li>
                      Maintenance history is saved, and tenants and landlords can determine who will pay for the repair.
                    </li>
                  </ul>
                </div>

                <div className="pl-3 sm:pl-4 border-l-2 border-blue-100">
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Real-Time Chat</h3>
                  <ul className="list-disc pl-8 sm:pl-10 mb-4 text-sm sm:text-base text-foreground space-y-1">
                    <li>Landlords and tenants can communicate directly through real-time chat.</li>
                    <li>
                      The chat system allows both parties to stay connected and resolve issues or queries immediately.
                    </li>
                    <li>Conversations in the chat may be used for legal purposes with the consent of both parties.</li>
                  </ul>
                </div>

                <div className="pl-3 sm:pl-4 border-l-2 border-blue-100">
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Add-On Legal Services</h3>
                  <ul className="list-disc pl-8 sm:pl-10 mb-4 text-sm sm:text-base text-foreground space-y-1">
                    <li>
                      Landlords may access additional legal support services (e.g., eviction assistance, legal
                      consultation).
                    </li>
                    <li>Fees for these services will be charged separately.</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <ClipboardCheck className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">5. User Obligations</h2>
              </div>

              <div className="pl-3 sm:pl-4 border-l-2 border-blue-100 mt-4 sm:mt-6 mb-4">
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Landlord Obligations</h3>
                <ul className="list-disc pl-8 sm:pl-10 mb-4 text-sm sm:text-base text-foreground space-y-1">
                  <li>
                    <span className="font-medium">Verification of Payments:</span> Landlords are responsible for
                    verifying GCash and cash payments, ensuring payment information is accurate and up-to-date in the
                    app.
                  </li>
                  <li>
                    <span className="font-medium">Managing Property Information:</span> Landlords must keep condo unit
                    details and rental agreements updated.
                  </li>
                  <li>
                    <span className="font-medium">Responding to Maintenance Requests:</span> Landlords must ensure
                    timely responses to maintenance requests submitted by tenants.
                  </li>
                </ul>
              </div>

              <div className="pl-3 sm:pl-4 border-l-2 border-blue-100 mt-4 sm:mt-6 mb-4">
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Tenant Obligations</h3>
                <ul className="list-disc pl-8 sm:pl-10 mb-4 text-sm sm:text-base text-foreground space-y-1">
                  <li>
                    <span className="font-medium">Rent Payments:</span> Tenants must pay rent on time through the
                    available payment methods via PayMongo. Failure to pay rent timely may result in reminders or
                    penalties.
                  </li>
                  <li>
                    <span className="font-medium">Payment Confirmation:</span> Tenants should upload proof of payment
                    (e.g., receipt photos for GCash payments) when using methods that require verification.
                  </li>
                  <li>
                    <span className="font-medium">Respect Property Rules:</span> Tenants are expected to follow the
                    rules of the rental property and report maintenance issues promptly.
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Lock className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">6. Data Privacy & Security</h2>
              </div>
              <p className="text-sm sm:text-base text-foreground mb-4">
                Your use of CondoPal is governed by our Privacy Policy, which outlines how we collect, use, and protect
                your data. By using our service, you consent to the practices described in that policy.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Copyright className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">7. Intellectual Property</h2>
              </div>
              <p className="text-sm sm:text-base text-foreground mb-4">
                All software, trademarks, logos, and content provided by CondoPal are the property of [Your Company
                Name] or its licensors. You may not copy, modify, or distribute any of our intellectual property without
                prior written consent.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <XCircle className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">8. Termination</h2>
              </div>
              <ul className="list-disc pl-8 sm:pl-10 mb-4 text-sm sm:text-base text-foreground space-y-2">
                <li>
                  CondoPal reserves the right to suspend or terminate accounts for breach of these Terms, fraudulent
                  activities, or illegal actions.
                </li>
                <li>
                  Upon termination, users may lose access to their data or subscription services, though payment records
                  will be retained for legal and tax purposes.
                </li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                  9. Disclaimers & Limitation of Liability
                </h2>
              </div>
              <ul className="list-disc pl-8 sm:pl-10 mb-4 text-sm sm:text-base text-foreground space-y-2">
                <li>
                  CondoPal is provided "as is." We do not guarantee uninterrupted service or perfect functionality.
                </li>
                <li>
                  We are not liable for indirect, incidental, or consequential damages arising from your use of the
                  platform.
                </li>
                <li>
                  The total liability of CondoPal to any user will be limited to the amount the user has paid for the
                  service in the last 12 months.
                </li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Scale className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                  10. Governing Law & Dispute Resolution
                </h2>
              </div>
              <p className="text-sm sm:text-base text-foreground mb-4">
                These Terms are governed by the laws of the Republic of the Philippines. Any disputes that arise will be
                resolved through the courts of [Specify Jurisdiction, e.g., "Metro Manila"].
              </p>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <RefreshCw className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">11. Changes to Terms</h2>
              </div>
              <p className="text-sm sm:text-base text-foreground mb-4">
                We may update these Terms from time to time. You will be notified of material changes via email or
                in-app notifications. Continued use of the platform after such changes signifies your acceptance of the
                updated Terms.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">12. Contact Us</h2>
              </div>
              <p className="text-sm sm:text-base text-foreground mb-3 sm:mb-4">
                If you have any questions or need assistance with our Terms and Conditions, please contact us:
              </p>
              <div className="flex items-center gap-2 mb-1">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <p className="text-sm sm:text-base text-foreground">
                  Email:{" "}
                  <a href="mailto:support@condohub.com" className="text-primary hover:underline">
                    support@condohub.com
                  </a>
                </p>
              </div>
              <div className="flex items-center gap-2 mb-6">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <p className="text-sm sm:text-base text-foreground">Phone: +63 XXX XXX XXXX</p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <User className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">Tenant Terms and Conditions</h2>
              </div>
              <p className="text-sm sm:text-base text-foreground mb-3 sm:mb-4">
                These additional terms apply specifically to tenants using CondoPal:
              </p>
              <ul className="list-disc pl-8 sm:pl-10 mb-4 text-sm sm:text-base text-foreground space-y-2">
                <li>
                  <span className="font-medium">Rent Payments:</span> Tenants agree to make rent payments promptly using
                  PayMongo or other methods as provided on the platform.
                </li>
                <li>
                  <span className="font-medium">Late Fees:</span> Tenants acknowledge that late rent payments may incur
                  additional charges and agree to pay any applicable fees.
                </li>
                <li>
                  <span className="font-medium">Property Maintenance:</span> Tenants must report maintenance issues
                  promptly using the app's maintenance request feature. Tenants are responsible for reporting issues
                  accurately and in a timely manner.
                </li>
                <li>
                  <span className="font-medium">Chat Communications:</span> Tenants agree to use the chat feature to
                  communicate only for legitimate concerns related to the rental property. Communications may be used as
                  legal evidence if necessary.
                </li>
                <li>
                  <span className="font-medium">Termination of Lease:</span> Tenants must comply with the terms of the
                  lease agreement, and failure to do so may result in eviction or other legal actions.
                </li>
              </ul>
            </section>

            <p className="text-sm sm:text-base text-foreground font-medium text-center pt-4 border-t border-border">
              Thank you for using CondoPal! We are committed to providing an efficient, transparent, and user-friendly
              platform for both landlords and tenants.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsAndCondition