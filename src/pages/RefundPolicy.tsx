import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";

const RefundPolicy = () => {
  return (
    <Layout>
      <section className="py-12 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">Refund Policy</h1>
          <p className="text-white/80">Our aim is to keep you satisfied. Please read the terms below to understand how refunds work.</p>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-8 text-sm text-foreground">
            <div>
              <h2 className="text-xl font-semibold mb-3">1. Scope</h2>
              <p className="leading-relaxed">
                This Refund Policy applies to all paid services on this platform, including teleconsultations, second opinion reviews, and board review document uploads.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">2. Refund Eligibility</h2>
              <ul className="list-disc list-inside space-y-2 leading-relaxed">
                <li>Refunds are available only if the service has not been delivered (e.g., consultation not completed, second opinion not issued, board review not started).</li>
                <li>Requests must be submitted within <strong>7 days</strong> of payment.</li>
                <li>Once a consultation is completed or a report is issued, the payment is considered final and non-refundable.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">3. How to Request a Refund</h2>
              <p className="leading-relaxed">
                To request a refund, please contact us at <a href="mailto:info@kanthealthcare.com" className="text-primary underline">info@kanthealthcare.com</a> with your booking/reference ID and a brief reason for the request.
              </p>
              <p className="leading-relaxed">
                Include the payment transaction ID if available. Our team will review your request and get back to you within 3 business days.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">4. Refund Process & Timeline</h2>
              <p className="leading-relaxed">
                If approved, refunds are processed via the same payment method used for the original transaction. It may take 3-10 business days for the refunded amount to reflect in your bank account depending on your bank or card issuer.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">5. Exceptions</h2>
              <ul className="list-disc list-inside space-y-2 leading-relaxed">
                <li>We do not refund due to change of mind once the service has commenced.</li>
                <li>Partial refunds may be considered in exceptional cases at our discretion.</li>
              </ul>
            </div>

            <div className="text-center pt-6">
              <Link to="/contact" className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary/90">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default RefundPolicy;
