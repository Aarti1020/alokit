// app/terms-and-conditions/page.tsx

import React from "react";
import {
  FileText,
  ShieldCheck,
  Truck,
 
  Scale,
  Mail,
  Phone,
  Sparkles,
} from "lucide-react";

const termsSections = [
  {
    id: "acceptance-of-terms",
    title: "1. Acceptance of Terms",
    content: `By accessing or using the website, its sub-domains, applications, or any services offered, you acknowledge that you have read, understood and agreed to be bound by these Terms of Use, the Privacy Policy and the Refund Policy.

If you do not agree to these terms, please discontinue use of the Services. Continued access constitutes explicit consent under applicable law of India.`,
  },
  {
    id: "definitions",
    title: "2. Definitions",
    content: `“Company” or “We” refers to Alokit Gems & Jewels and its affiliates.

“User” or “You” means any person accessing or using the Services.

“Services” include all online consultations, astrology readings, reports, gemstone recommendations, and any other service offered by Alokit Gems & Jewels, whether free or paid.

“User Data” means information submitted, uploaded or shared by Users for availing Services.

“Applicable Law” means all Indian laws, including the Information Technology Act, 2000, Consumer Protection Act, 2019 and Digital Personal Data Protection Act, 2023.

“Energised” refers to traditional spiritual practices. Alokit Gems & Jewels does not warrant measurable empirical energy effects.

“Certified” refers that the product is accompanied by or verified through a certification issued by a recognized gemological laboratory. Certification confirms the gemstone’s characteristics, not its spiritual or astrological effects.`,
  },
  {
    id: "electronic-agreement",
    title: "3. Electronic Agreement",
    content: `This Agreement is an electronic contract that sets out the legally binding terms of your use of the Website and your membership in the Service.

By accessing the website or becoming a member, you consent to receive communications from us electronically and accept this agreement.

By visiting our site and/or purchasing something from us, you engage in our Service and agree to be bound by these Terms and Conditions.

All products and the information displayed on the Website constitute an invitation to offer. Your order for purchase constitutes your offer, which shall be subject to these Terms and Conditions. We reserve the right to accept or reject your offer in part or in full.

Astrological guidance and remedies are interpretive and should not replace professional advice in health, legal or financial matters.`,
  },
  {
    id: "privacy",
    title: "4. Privacy",
    content: `Your privacy is very important to us. Use of the Website and/or the Service is also governed by our Privacy Policy.

Please read our Privacy Policy to understand how we collect, use, and protect your information.`,
  },
  {
    id: "eligibility",
    title: "5. Eligibility",
    content: `The Services are available only to individuals who can form legally binding contracts under applicable laws of India and the country of their residence.

If you are below 18 years of age, you are prohibited from using, purchasing, or contracting through this Website.

Persons who are incompetent to contract within the meaning of the Indian Contract Act, 1872 are not eligible to use or transact through this Website.

Those who choose to access this Website from outside India are responsible for compliance with local laws where applicable.`,
  },
  {
    id: "accuracy",
    title: "6. Accuracy, Completeness and Timeliness of Information",
    content: `All products and services are provided “As Is” without warranties of any kind, whether express, implied, statutory or otherwise. Any reliance on material on this site is at your own risk.

The Company does not represent or guarantee that Website materials or any portion of our services are accurate, complete, reliable, current or error-free.

We have made every effort to display the colours and sizes of our products as accurately as possible. However, actual colours may vary depending on your device display. Packaging may also vary from that displayed on the Website.`,
  },
  {
    id: "delivery",
    title: "7. Delivery Location and Timeline",
    content: `In India, we serve cities across India. Please check if we deliver to your PIN Code on the shopping cart checkout page.

If courier service is unavailable in your area, please contact our customer support team at contact@alokit.co.

We also provide international delivery across the globe. Delivery to certain locations may not be possible due to country-specific restrictions or logistical issues.

Tentative delivery timelines may be shared with order confirmation. Delivery times are estimates and may change due to shipment issues, customs delays, weather conditions, or other unforeseen circumstances.`,
  },
  {
    id: "payment",
    title: "8. Payment and Modifications to Prices/Services",
    content: `Prices on our Website are subject to change without notice. You will be charged the price listed on the day of purchase.

For orders shipped within India, payment only in INR is accepted. Prices are inclusive of CGST, SGST, or IGST as applicable.

Payments for international orders are accepted through Razorpay, Zoho secure payout gateway, or direct bank transfer. For orders shipped outside India, payment will be accepted only in INR currency.

For orders above INR 2 lakhs, you are required to send us your PAN Card. Users must ensure payment details are lawful, accurate, and authorized.`,
  },
  {
    id: "payment-information",
    title: "9. Bank Account and Payment Information",
    content: `You are obligated to provide accurate and complete banking or payment details as required by the Company for processing your transactions.

You agree that debit or credit card details provided must be correct and accurate. You shall not use any card that is not lawfully owned by you or that you are not authorized to use.

The Company does not store, retain, or access your complete payment card details. Payments are processed through secure PCI DSS-compliant systems.`,
  },
  {
    id: "products",
    title: "10. Products",
    content: `Certain products may be available exclusively online through the Website. These products may have limited quantities and/or may be made to order or procured on order.

We have made every effort to display product colors and images accurately. However, due to distinctive color, texture, origin, and other natural factors, certain products may differ slightly from displayed images.

Astrological remedies, consultations, and predictions are grounded in astrological principles and are meant to offer guidance and self-reflection. Alokit Gems & Jewels does not guarantee specific outcomes.

Any concerns or disputes should first be addressed through the Company’s internal customer support channels.`,
  },
  {
    id: "billing",
    title: "11. Accuracy of Billing and Account Information",
    content: `You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store.

You agree to promptly update account information, including email address and payment details, so that transactions can be completed and we can contact you as needed.`,
  },
  {
    id: "non-commercial-use",
    title: "12. Non-Commercial Use",
    content: `The Website and its Services are intended solely for personal, non-commercial use by individual users.

Commercial use, including linking, reselling, or redistributing any content or service, is strictly prohibited unless expressly authorized in writing by the Company.

Unauthorized framing, linking, or data extraction of the Website for commercial purposes will constitute a breach of these Terms.`,
  },
  {
    id: "membership-privacy",
    title: "13. Privacy of Membership",
    content: `Your account or membership on the Website is for your personal use only and is non-transferable.

You shall not assign, license, or allow any other person or entity to use your account credentials.

You are solely responsible for maintaining the confidentiality of your login details and for all activities that occur under your account.`,
  },
  {
    id: "term",
    title: "14. Term",
    content: `This Agreement will remain in full force and effect while you use the Website and/or are a member.

You may terminate your membership or subscription at any time by informing Alokit.co in writing.

If Alokit.co terminates your membership because of a material breach of this Agreement, you will not be entitled to any refund of unused subscription fees.`,
  },
  {
    id: "proprietary-rights",
    title: "15. Proprietary Rights",
    content: `The Company owns and retains all proprietary rights in the Alokit.co Website and products/services offered.

The Website contains copyrighted material, trademarks, and other proprietary information of the Company and its licensors.

You may not copy, modify, publish, transmit, distribute, perform, display, or sell proprietary information without permission.`,
  },
  {
    id: "user-obligations",
    title: "16. Obligations of the User",
    content: `You are solely responsible for the content that you publish, display, post, or transmit through the Website.

You must not post defamatory, inaccurate, abusive, obscene, offensive, threatening, harassing, racially offensive, illegal, or rights-infringing material.

The Company may review and delete content that violates this Agreement or may be offensive, illegal, or harmful.

All information included in your member profile must be accurate, current, and complete.`,
  },
  {
    id: "prohibited-activities",
    title: "17. Prohibited Activities",
    content: `You shall not impersonate any person or entity, stalk or harass any person, send abusive or obscene messages, use automated tools to scrape or data mine the Website, or interfere with Website services.

You shall not post viruses, manipulate identifiers, frame or mirror the Website, or modify, reverse engineer, decompile, or disassemble any part of the Website or software used for the Service.`,
  },
  {
    id: "liability",
    title: "18. Disclaimer of Warranties and Limitation of Liabilities",
    content: `Your use of the Website is at your sole risk.

The Company expressly disclaims all warranties of any kind, whether express or implied, including warranties of merchantability, fitness for a particular purpose, and non-infringement.

Alokit Gems & Jewels shall not be liable for any indirect, incidental, or consequential damages.

Liability for direct damages shall not exceed the total amount paid by the User for the product or service. This limitation shall not apply to cases of fraud, gross negligence, willful misconduct, or liabilities that cannot be excluded by law.`,
  },
  {
    id: "modifications",
    title: "19. Modifications to Service",
    content: `The Company reserves the right at any time to modify or discontinue, temporarily or permanently, the Website and information, products, or services offered with or without notice.

The Company shall not be liable to you or any third party for any modification, suspension, or discontinuance of the Service.`,
  },
  {
    id: "disputes",
    title: "20. Disputes and Applicable Law",
    content: `Any dispute about or involving the Website and/or Services shall be governed by the laws of India and subject to the exclusive jurisdiction of competent courts in Delhi, India.`,
  },
  {
    id: "indemnity",
    title: "21. Indemnity",
    content: `You agree to indemnify and hold the Company, its subsidiaries, affiliates, officers, agents, partners, and employees harmless from any loss, liability, claim, or demand made by any third party due to or arising out of your use of the Service in violation of this Agreement.`,
  },
  {
    id: "termination",
    title: "22. Termination",
    content: `These Terms of Service are effective unless and until terminated by either you or us.

You may terminate these Terms at any time by notifying us that you no longer wish to use our Services or when you cease using our site.

If you fail, or we suspect that you have failed, to comply with any provision of these Terms, we may terminate this Agreement without notice and deny access to our Services.`,
  },
  {
    id: "force-majeure",
    title: "23. Force Majeure",
    content: `We are not liable for delay or non-performance of obligations caused by events beyond our control, including but not limited to acts of God, war, civil disturbance, riots, strikes, governmental restrictions, pandemics, import or export regulations, transport delays, or accidents.`,
  },
  {
    id: "grievance",
    title: "24. Grievance Redressal Mechanism",
    content: `In compliance with applicable Indian laws, Alokit Gems & Jewels has appointed a Grievance Officer.

Grievance Officer: Alokit Gems & Jewels
Email: contact@alokit.co
Address: Amrut Plaza, Office no. 304, 3rd Floor, Chendani Koliwada, Station Road, Thane(W)
Acknowledgement: 48 hours
Resolution: 30 days`,
  },
  {
    id: "communication-consent",
    title: "25. Communication Consent",
    content: `By providing your contact details, you consent to receive transactional and service-related messages, alerts, and updates from the Company through SMS, WhatsApp, email, or phone calls.

Promotional or marketing communications will be sent only with your prior explicit consent.

You may withdraw your consent at any time by emailing contact@alokit.co.`,
  },
  {
    id: "certification-clarity",
    title: "26. Certification Clarity",
    content: `Certifications are provided by reputable gemological labs where applicable.

“Certification” refers to laboratory verification of physical attributes of gemstones and does not verify spiritual or astrological effects.`,
  },
];

const quickCards = [
  {
    icon: ShieldCheck,
    title: "Certified Products",
    text: "Certification verifies gemstone attributes where applicable.",
  },
  {
    icon: Sparkles,
    title: "Energised Gemstones",
    text: "Energised refers to traditional spiritual practices.",
  },
  {
    icon: Truck,
    title: "Pan India Delivery",
    text: "Delivery timelines are estimates and may vary.",
  },
  {
    icon: Scale,
    title: "Indian Law",
    text: "Terms are governed by applicable Indian laws.",
  },
];

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-800">
      {/* Hero */}
      <section className="relative overflow-hidden bg-stone-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.22),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.14),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-amber-300">
              <FileText className="h-4 w-4" />
              Legal Policy
            </div>

            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Terms & Conditions
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-stone-300 sm:text-lg">
              Please read these Terms and Conditions carefully before using
              www.alokit.co or purchasing products and services from Alokit Gems
              & Jewels Private Limited.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-stone-300">
              <span className="rounded-full bg-white/10 px-4 py-2">
                Website: www.alokit.co
              </span>
              <span className="rounded-full bg-white/10 px-4 py-2">
                Last Updated: 2026
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Cards */}
      <section className="mx-auto -mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickCards.map((item) => {
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

      {/* Content */}
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
              Contents
            </h2>

            <nav className="max-h-[70vh] space-y-1 overflow-y-auto pr-2">
              {termsSections.map((section) => (
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

        {/* Terms Sections */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-900">
            <strong className="font-semibold">Important:</strong> Astrological
            guidance, gemstone recommendations, and remedies are interpretive in
            nature and should not replace professional medical, legal, or
            financial advice.
          </div>

          {termsSections.map((section) => (
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

          {/* Contact Box */}
          <div className="rounded-3xl bg-stone-950 p-6 text-white shadow-sm sm:p-8">
            <h2 className="text-2xl font-semibold">Need Help?</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-300">
              For questions, complaints, privacy concerns, or support requests,
              please contact Alokit Gems & Jewels using the details below.
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

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-stone-300">
              <strong className="text-white">Registered Office:</strong>
              <br />
              Amrut Plaza, Office no. 304, 3rd Floor, Chendani Koliwada,
              Station Road, Thane(W)
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}