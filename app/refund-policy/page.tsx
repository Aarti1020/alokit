// app/refund-policy/page.tsx

import React from "react";
import {
  RefreshCcw,
  ShieldCheck,
  PackageCheck,
  XCircle,
  Clock,
  CreditCard,
  Truck,
  AlertTriangle,
  Globe2,
  Mail,
  Phone,
  FileCheck2,
} from "lucide-react";

const policySections = [
  {
    id: "return-exchange-policy",
    title: "Return & Exchange Policy",
    content: `While we want to ensure you are satisfied with your purchase, we cannot guarantee that each request for return, refund, or exchange will be accepted.

Alokit Gems & Jewels Private Limited reserves the right to refuse or deny any return, refund, or exchange request if it does not meet the conditions mentioned in this policy.`,
  },
  {
    id: "eligibility",
    title: "Eligibility",
    content: `Returns or exchanges are only accepted if your order is damaged during transit or if you received an incorrect product.

Due to the nature of the products, video-graphic proof is mandatory to process any return or exchange request. This evidence is required for internal evaluation of the product condition.

Failure to provide the required video proof will make the Company unable to process the return or exchange request.`,
  },
  {
    id: "timeframe",
    title: "Return & Exchange Timeframe",
    content: `Requests for a refund or return must be made within fifteen (15) days of receiving your product.

The item must be returned in its original condition with original certification and packaging intact. Any tampering with the product or its certifications may result in denial of the return request.

If you wish to exchange a defective or damaged item, you must contact us within thirty (30) days from the date of receipt. Exchanges are subject to availability.`,
  },
  {
    id: "quality-verification",
    title: "Quality Verification",
    content: `If you have doubts regarding product quality, you may get the product verified for authenticity at a Government gemological institute, ISO certified institute, or internationally reputed gemological institute.

If any gemstone is proven to be synthetic or artificial by such institute, you are entitled to a 100% refund, return, or exchange as you deem fit.`,
  },
  {
    id: "non-refundable-charges",
    title: "Non-Refundable Charges",
    content: `Courier charges, VAT, and duties are non-refundable on any returned or exchanged product.

The Company will not arrange pickup for returns or exchanges. All charges, including shipping charges for return or exchange, shall be borne by the customer and cannot be claimed, adjusted, or issued as a credit note.`,
  },
  {
    id: "subjective-dissatisfaction",
    title: "No Subjective Dissatisfaction Refunds",
    content: `No refunds, exchanges, or returns shall be provided based solely on subjective dissatisfaction with the product.

This includes variations in colour, size, weight, natural inclusions, or perceived energy effects. These natural product variations do not constitute defects.`,
  },
  {
    id: "rudraksha-certificate",
    title: "Rudraksha Certificate",
    content: `Rudraksha returns or exchanges will only be processed if accompanied by an original certificate from a government-approved gemological laboratory verifying defect or transit damage.`,
  },
  {
    id: "cancellation-policy",
    title: "Cancellation Policy",
    content: `Once an order is placed, it cannot be cancelled.

If the order is pending pickup, buyers may request changes or exchanges of equivalent value at the discretion of Alokit Gems & Jewels.

The Company does not permit cancellations once an order has been placed.`,
  },
  {
    id: "not-eligible-return",
    title: "Categories Not Eligible for Return",
    content: `Returns are not possible for the following categories unless the product is damaged:

• Customized Jewelry
• Beads Bracelets
• Rudraksha
• Crystal Trees
• Rakhi
• Products received exactly as ordered
• Gift Cards

Personalized rings, jewelry, bracelets, or any wearable made with a specific fitting size cannot be returned.`,
  },
  {
    id: "refund-process",
    title: "Refund Process",
    content: `If your return request is approved, your refund will be processed and credited to your credit card or original/source method of payment within 10–12 working days.

This timeline is subject to unforeseeable delays from bank processes or public holidays.

Once your return is received and inspected by our team, you will be notified about approval or rejection of your refund based on internal inspection.`,
  },
  {
    id: "return-exclusions",
    title: "Exclusions for Returns or Exchanges",
    content: `The Company shall not accept returns or exchanges for the following reasons:

• Change of mind
• Customer simply dislikes the product
• Minor flaws or packaging issues that do not affect product quality
• Slight color or size variations caused by lighting, screen resolution, or manufacturing tolerances

Customers are encouraged to carefully review the size chart and product descriptions before making a purchase.`,
  },
  {
    id: "late-refunds",
    title: "Late or Missing Refunds",
    content: `If you have not received your refund, first verify your bank account for the transaction.

If the refund is not reflected, please contact your credit card company, as it may take additional time for the refund to be officially posted.

You may also contact your bank to inquire about the refund status. If delays or discrepancies continue, please contact our Grievance Officer.`,
  },
  {
    id: "sale-items",
    title: "Sale Items",
    content: `All items marked as “Sale” or purchased at a discounted price are final sale.

These items are not eligible for return, exchange, or refund under any circumstances. By completing the purchase of a sale item, you acknowledge and agree that the sale is final.`,
  },
  {
    id: "international-orders",
    title: "Refunds for International Orders",
    content: `For international orders outside India, if there is an issue with delivery, refund will be processed to the original payment method within 40 to 45 days.

The Company is not responsible for customs charges, duties, VAT, or similar charges imposed by the destination country.

Refunds for international orders will only be processed upon receipt of the returned items.`,
  },
];

const highlightCards = [
  {
    icon: Clock,
    title: "15-Day Return Window",
    text: "Return or refund requests must be raised within 15 days of receiving the product.",
  },
  {
    icon: PackageCheck,
    title: "Original Condition Required",
    text: "Product, certification, and packaging must remain intact.",
  },
  {
    icon: FileCheck2,
    title: "Video Proof Mandatory",
    text: "Video evidence is required for damage or incorrect product claims.",
  },
  {
    icon: CreditCard,
    title: "10–12 Working Days",
    text: "Approved refunds are processed to the original payment method.",
  },
];

const notEligibleItems = [
  "Customized Jewelry",
  "Beads Bracelets",
  "Rudraksha",
  "Crystal Trees",
  "Rakhi",
  "Products received exactly as ordered",
  "Gift Cards",
];

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-800">
      {/* Hero */}
      <section className="relative overflow-hidden bg-stone-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.24),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.13),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-amber-300">
              <RefreshCcw className="h-4 w-4" />
              Refund Policy
            </div>

            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Return, Replacement & Refund Policy
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-stone-300 sm:text-lg">
              At Alokit Gems & Jewels Private Limited, we value your trust and
              strive to ensure a transparent and fair shopping experience for
              purchases made through www.alokit.co.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-stone-300">
              <span className="rounded-full bg-white/10 px-4 py-2">
                Website: www.alokit.co
              </span>
              <span className="rounded-full bg-white/10 px-4 py-2">
                Returns: Within 15 Days
              </span>
              <span className="rounded-full bg-white/10 px-4 py-2">
                Exchanges: Within 30 Days
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Highlight Cards */}
      <section className="mx-auto -mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {highlightCards.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="font-semibold text-stone-950">{item.title}</h3>

                <p className="mt-2 text-sm leading-6 text-stone-600">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[300px_1fr] lg:px-8">
        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
              Policy Sections
            </h2>

            <nav className="max-h-[70vh] space-y-1 overflow-y-auto pr-2">
              {policySections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block rounded-lg px-3 py-2 text-sm text-stone-600 transition hover:bg-amber-50 hover:text-amber-700"
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <div className="space-y-5">
          {/* Important Notice */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-900">
            <div className="flex gap-3">
              <AlertTriangle className="mt-1 h-5 w-5 flex-shrink-0 text-amber-700" />
              <p>
                <strong className="font-semibold">Important:</strong> Returns
                or exchanges are accepted only if the product is damaged during
                transit or if an incorrect product is received. Video proof is
                mandatory for evaluation.
              </p>
            </div>
          </div>

          {/* Eligibility Summary */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
              <div className="mb-3 flex items-center gap-2 text-green-800">
                <ShieldCheck className="h-5 w-5" />
                <h3 className="font-semibold">Eligible Cases</h3>
              </div>
              <ul className="space-y-2 text-sm leading-6 text-green-900">
                <li>• Product damaged during transit</li>
                <li>• Incorrect product received</li>
                <li>• Proven synthetic/artificial gemstone from approved lab</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
              <div className="mb-3 flex items-center gap-2 text-red-800">
                <XCircle className="h-5 w-5" />
                <h3 className="font-semibold">Not Eligible</h3>
              </div>
              <ul className="space-y-2 text-sm leading-6 text-red-900">
                <li>• Change of mind</li>
                <li>• Subjective dissatisfaction</li>
                <li>• Natural color, size, weight, or inclusion variations</li>
              </ul>
            </div>
          </div>

          {/* Policy Sections */}
          {policySections.map((section) => (
            <article
              key={section.id}
              id={section.id}
              className="scroll-mt-24 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <h2 className="text-xl font-semibold tracking-tight text-stone-950 sm:text-2xl">
                {section.title}
              </h2>

              <div className="mt-4 space-y-4 text-sm leading-7 text-stone-600 sm:text-[15px]">
                {section.content.split("\n\n").map((paragraph, index) => (
                  <p key={index} className="whitespace-pre-line">
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          ))}

          {/* Non-returnable Categories */}
          <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
              Categories Not Eligible for Return
            </h2>

            <p className="mt-3 text-sm leading-7 text-stone-600">
              Unless damaged, the following product categories are not eligible
              for return:
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {notEligibleItems.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-700"
                >
                  <XCircle className="h-4 w-4 text-red-500" />
                  {item}
                </div>
              ))}
            </div>
          </section>

          {/* International Orders */}
          <section className="rounded-3xl border border-blue-200 bg-blue-50 p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <Globe2 className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-blue-950">
                  International Orders
                </h2>

                <p className="mt-3 text-sm leading-7 text-blue-900">
                  For international orders outside India, refunds related to
                  delivery issues may be processed to the original payment
                  method within 40 to 45 days. Customs charges, duties, VAT, or
                  similar destination-country charges are not the responsibility
                  of Alokit Gems & Jewels.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Box */}
          <section className="rounded-3xl bg-stone-950 p-6 text-white shadow-sm sm:p-8">
            <h2 className="text-2xl font-semibold">Need Help With a Refund?</h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-300">
              For refund delays, return approvals, exchange requests, or
              discrepancies, please contact Alokit Gems & Jewels support.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <a
                href="mailto:contact@alokit.co"
                className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 transition hover:bg-amber-400/10"
              >
                <Mail className="h-5 w-5 text-amber-300" />
                <span className="text-sm">contact@alokit.co</span>
              </a>

              <a
                href="tel:7039222272"
                className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 transition hover:bg-amber-400/10"
              >
                <Phone className="h-5 w-5 text-amber-300" />
                <span className="text-sm">7039222272</span>
              </a>
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-stone-300">
              <Truck className="mt-1 h-5 w-5 flex-shrink-0 text-amber-300" />
              <p>
                Return pickup is not arranged by the Company. Return or exchange
                shipping charges must be borne by the customer.
              </p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}