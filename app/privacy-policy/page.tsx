"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  Shield,
  Lock,
  Eye,
  Database,
  Share2,
  Cookie,
  UserCheck,
  Bell,
  AlertCircle,
  Mail,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Fingerprint,
  Globe,
} from "lucide-react";

const sections = [
  { id: "information-collect", title: "Information We Collect", icon: Database },
  { id: "user-consent", title: "User Consent", icon: UserCheck },
  { id: "personal-information", title: "Personal Information", icon: Fingerprint },
  { id: "device-information", title: "Device & Order Info", icon: Eye },
  { id: "data-privacy", title: "Data Privacy & Rights", icon: Shield },
  { id: "transfer-data", title: "Transfer of Data", icon: Globe },
  { id: "cookies", title: "Cookies & Tracking", icon: Cookie },
  { id: "how-we-use", title: "How We Use Your Data", icon: FileText },
  { id: "sharing", title: "Sharing Information", icon: Share2 },
  { id: "newsletters", title: "Newsletters", icon: Bell },
  { id: "data-retention", title: "Data Retention", icon: Database },
  { id: "data-security", title: "Data Security", icon: Lock },
  { id: "grievance", title: "Grievance Redressal", icon: AlertCircle },
  { id: "contact", title: "Contact Us", icon: Mail },
];

function useActiveSection() {
  const [active, setActive] = useState("information-collect");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  return active;
}

function Section({
  id,
  icon: Icon,
  title,
  children,
}: {
  id: string;
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 group"
    >
      <div className="flex items-start gap-4 mb-5">
        <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center group-hover:bg-amber-100 transition-colors duration-200">
          <Icon className="w-5 h-5 text-amber-700" strokeWidth={1.5} />
        </div>
        <h2 className="font-cinzel text-xl font-semibold text-stone-800 pt-2 border-b border-stone-100 pb-2 flex-1">
          {title}
        </h2>
      </div>
      <div className="ml-14 space-y-4 text-stone-600 leading-relaxed text-[15px]">
        {children}
      </div>
    </section>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <h3 className="font-semibold text-stone-700 mb-2 text-[15px]">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 mt-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function InfoCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-stone-100 last:border-0">
      <span className="text-stone-500 text-sm w-36 flex-shrink-0">{label}</span>
      <span className="text-stone-700 font-medium text-sm">{value}</span>
    </div>
  );
}

export default function PrivacyPolicyPage() {
  const activeSection = useActiveSection();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] font-['Jost',sans-serif]">
      {/* Top Header */}
  

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-950 via-stone-900 to-amber-900 text-white">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-amber-400 blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-amber-600 blur-3xl -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-800/40 border border-amber-700/50 rounded-full px-4 py-1.5 text-amber-200 text-xs font-medium mb-6 tracking-wider uppercase">
            <Lock className="w-3 h-3" />
            Legal &amp; Privacy
          </div>
          <h1
            className="font-['Cinzel',serif] text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-100 mb-4 tracking-wide"
          >
            Privacy Policy
          </h1>
          <p className="text-stone-300 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            We are committed to protecting your personal data and ensuring
            transparency about how we collect, use, and safeguard your information.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-400">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> DPDP Act 2023 Compliant</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> RBI-Regulated Payments</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> Industry-Standard Encryption</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-8 lg:gap-12">
          {/* Sidebar Navigation */}
          <aside
            className={`
              ${sidebarOpen ? "fixed inset-0 z-40 bg-black/50 lg:static lg:bg-transparent" : "hidden lg:block"}
              lg:w-64 lg:flex-shrink-0
            `}
            onClick={(e) => e.target === e.currentTarget && setSidebarOpen(false)}
          >
            <nav className="lg:sticky lg:top-24 bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden max-h-[80vh] overflow-y-auto w-72 lg:w-full ml-auto lg:ml-0">
              <div className="p-4 border-b border-stone-100 bg-stone-50">
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest">Contents</p>
              </div>
              <ul className="p-2">
                {sections.map(({ id, title, icon: Icon }) => (
                  <li key={id}>
                    <button
                      onClick={() => scrollTo(id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm transition-all duration-150 group
                        ${activeSection === id
                          ? "bg-amber-50 text-amber-800 font-medium"
                          : "text-stone-500 hover:bg-stone-50 hover:text-stone-700"
                        }`}
                    >
                      <Icon
                        className={`w-3.5 h-3.5 flex-shrink-0 ${activeSection === id ? "text-amber-700" : "text-stone-400 group-hover:text-stone-500"}`}
                        strokeWidth={1.5}
                      />
                      <span className="leading-tight">{title}</span>
                      {activeSection === id && (
                        <ChevronRight className="w-3 h-3 ml-auto text-amber-600" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-10 space-y-14">

              {/* Intro */}
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-5 text-sm text-stone-700 leading-relaxed">
                <p>
                  This website, <strong>www.alokit.co</strong>, is owned and operated by{" "}
                  <strong>Alokit Gems &amp; Jewels Private Limited</strong>, having its registered office
                  at Unit No.B-115, Majestique Rhythm County, Commercial Complex, Phase 1, Handewadi,
                  Hadapsar, Pune, 411028.
                </p>
                <p className="mt-3">
                  Please read this Privacy Policy carefully before using the Website.
                </p>
              </div>

              <Section id="information-collect" icon={Database} title="Information We Collect">
                <p>We may collect the following categories of personal and non-personal information:</p>
                <BulletList items={[
                  "Contact details such as name, phone numbers, billing and shipping address, and email ID.",
                  "Payment details processed via secure, RBI-regulated gateways.",
                  "Device information, IP address, browser type, and usage data.",
                  "Preferences and interactions with our website or promotional content.",
                ]} />
              </Section>

              <Section id="user-consent" icon={UserCheck} title="User Consent">
                <p>
                  This Privacy Policy, which may be updated or amended periodically without prior
                  intimation, outlines the types of information collected from users, including personal
                  identification details, contact information, and any related data.
                </p>
                <p>
                  By accessing and using the Website, you acknowledge that you have read, understood, and
                  expressly consent to the terms of this Privacy Policy. If you do not agree with any of
                  the terms, you are advised not to use this Website.
                </p>
                <p>
                  Your continued use of the Website constitutes your unconditional consent to the
                  collection, maintenance, use, processing, and disclosure of your information in
                  accordance with this Privacy Policy.
                </p>
                <div className="mt-4 flex items-center gap-3 p-4 bg-stone-50 rounded-xl border border-stone-200 text-sm">
                  <Mail className="w-4 h-4 text-amber-700 flex-shrink-0" strokeWidth={1.5} />
                  <span>
                    You may withdraw consent at any time by emailing{" "}
                    <a href="mailto:contact@alokit.co" className="text-amber-700 hover:underline font-medium">
                      contact@alokit.co
                    </a>
                    , subject to applicable retention requirements.
                  </span>
                </div>
              </Section>

              <Section id="personal-information" icon={Fingerprint} title="Personal Information We Collect">
                <p>
                  When you visit the Site, we automatically collect certain information about your device,
                  including your web browser, IP address, time zone, and cookies installed on your device.
                </p>
                <p>
                  Additionally, as you browse the Site, we collect information about the individual web
                  pages or products you view, what websites or search terms referred you to the Site, and
                  how you interact with the Site. We refer to this as <strong>"Device Information."</strong>
                </p>
                <SubSection title="We collect Device Information using the following technologies:">
                  <BulletList items={[
                    "Cookies: Data files placed on your device or computer, often including an anonymous unique identifier.",
                    "Log files: These track actions occurring on the Site and collect data including IP address, browser type, internet service provider, referring/exit pages, and date/time stamps.",
                    "Web beacons, tags, and pixels: Electronic files used to record information about how you browse the Site.",
                  ]} />
                </SubSection>
              </Section>

              <Section id="device-information" icon={Eye} title="Device Information and Order Information">
                <p>
                  The term "Personal Information" refers to both Device Information and Order Information
                  collected from you when you use our services, visit our website, or interact with our
                  customer support.
                </p>
                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  {[
                    {
                      title: "Device Information",
                      desc: "Data about the device you use to access our website, such as device type, OS, browser type, unique device identifiers, IP addresses, geo-location data, and other technical information.",
                    },
                    {
                      title: "Order Information",
                      desc: "Personal details such as your name, address, phone number, email address, payment information, and any other data you provide when placing an order.",
                    },
                  ].map(({ title, desc }) => (
                    <div key={title} className="p-4 bg-stone-50 border border-stone-200 rounded-xl">
                      <h4 className="font-semibold text-stone-700 text-sm mb-2">{title}</h4>
                      <p className="text-stone-500 text-[13px] leading-relaxed">{desc}</p>
                    </div>
                  ))}
                </div>
              </Section>

              <Section id="data-privacy" icon={Shield} title="Data Privacy and User Rights">
                <p>
                  Alokit Gems &amp; Jewels processes personal data in accordance with the{" "}
                  <strong>Digital Personal Data Protection Act, 2023</strong>.
                </p>
                <p>Users have the following rights:</p>
                <BulletList items={[
                  "Access their personal data.",
                  "Request correction or deletion.",
                  "Withdraw consent for processing by contacting contact@alokit.co.",
                ]} />
                <p className="mt-2">
                  Data shall be retained only for as long as necessary for providing services or as
                  required by law.
                </p>
              </Section>

              <Section id="transfer-data" icon={Globe} title="Transfer of Data">
                <p>
                  Personal data may be transferred and processed in jurisdictions outside India where
                  the Company or its service providers operate, subject to appropriate contractual
                  safeguards ensuring confidentiality and lawful processing.
                </p>
              </Section>

              <Section id="cookies" icon={Cookie} title="Cookies and Tracking">
                <p>
                  We use cookies and similar technologies for analytics, user experience enhancement,
                  and security. To provide a personalized and high-quality experience, we may use
                  cookies and similar technologies that automatically collect certain information from
                  your browser or device.
                </p>
                <div className="mt-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-stone-600">
                  <strong>Do Not Track:</strong> Please note that we do not alter our website's data
                  collection and usage practices when we see a Do Not Track signal from your browser.
                </div>
              </Section>

              <Section id="how-we-use" icon={FileText} title="How Do We Use Your Personal Information?">
                <p>
                  We use the Order Information we collect generally to fulfill any orders placed through
                  the Website, including processing your payment information, arranging for shipping,
                  and providing you with invoices and/or order confirmations.
                </p>
                <p>Additionally, we may use this information to:</p>
                <BulletList items={[
                  "Communicate with you.",
                  "Screen our orders for potential risk or fraud.",
                  "Send you information, updates, or advertisements related to our products or services according to your preferences.",
                ]} />
                <div className="grid sm:grid-cols-3 gap-3 mt-4">
                  {[
                    { title: "Advertisement", desc: "Product and service updates, newsletters, and communications about new offerings with your prior consent." },
                    { title: "Statistics & Research", desc: "Segment data and create anonymous, aggregated statistics about the use of our products and services." },
                    { title: "Improvement", desc: "Improve and enhance existing products, services, and applications and develop new offerings." },
                  ].map(({ title, desc }) => (
                    <div key={title} className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                      <p className="font-semibold text-stone-700 text-sm mb-1.5">{title}</p>
                      <p className="text-stone-500 text-xs leading-relaxed">{desc}</p>
                    </div>
                  ))}
                </div>
              </Section>

              <Section id="sharing" icon={Share2} title="Sharing Your Personal Information">
                <p>
                  We may employ third-party entities and individuals to facilitate our services,
                  including maintenance, analysis, audit, marketing, and development. These third
                  parties have limited access to your information only to perform tasks on our behalf
                  and are obligated not to disclose or use it for other purposes.
                </p>
                <p>
                  We may also share your Personal Information to comply with applicable laws and
                  regulations, respond to a subpoena, search warrant, or other lawful request for
                  information, or otherwise protect our rights.
                </p>
              </Section>

              <Section id="newsletters" icon={Bell} title="Newsletters">
                <p>
                  By subscribing to our newsletter, you agree to receive email from us. The aim of our
                  newsletter service is to keep our customers and visitors updated about new releases,
                  new information, or company updates. Subscription is not mandatory.
                </p>
                <div className="mt-4 grid sm:grid-cols-2 gap-3">
                  {[
                    { title: "Frequency", desc: "At most 2 newsletters per month." },
                    { title: "Double Opt-In", desc: "All subscribers must confirm their email address via a verification link." },
                    { title: "Limited Liability", desc: "We reserve the right to modify or discontinue the newsletter at any time." },
                    { title: "Privacy", desc: "We will not communicate or give away your personal details in any manner." },
                  ].map(({ title, desc }) => (
                    <div key={title} className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl">
                      <p className="font-semibold text-stone-700 text-sm mb-1">{title}</p>
                      <p className="text-stone-500 text-xs leading-relaxed">{desc}</p>
                    </div>
                  ))}
                </div>
              </Section>

              <Section id="data-retention" icon={Database} title="Data Retention">
                <p>
                  When you place an order through the Site, we will retain your Order Information in
                  our records for the purpose of processing and fulfilling your order, unless and until
                  you request us to delete such information.
                </p>
              </Section>

              <Section id="data-security" icon={Lock} title="Data Security">
                <p>
                  We employ industry-standard encryption and organizational measures to protect your
                  personal data against unauthorized access, alteration, disclosure, or destruction.
                </p>
                <div className="mt-3 p-4 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-600 flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                  <span>
                    No electronic transmission over the internet can be guaranteed to be 100% secure.
                    You acknowledge that you share information at your own discretion.
                  </span>
                </div>
              </Section>

              <Section id="grievance" icon={AlertCircle} title="Grievance Redressal Mechanism">
                <p>
                  In compliance with the Information Technology Rules, 2021 and the Digital Personal
                  Data Protection Act, 2023, Alokit Gems &amp; Jewels has appointed a Grievance
                  Officer to address concerns.
                </p>
                <div className="mt-4 bg-stone-50 border border-stone-200 rounded-xl overflow-hidden">
                  <InfoCard label="Grievance Officer" value="Alokit Gems & Jewels" />
                  <InfoCard label="Email" value={<a href="mailto:contact@alokit.co" className="text-amber-700 hover:underline">contact@alokit.co</a>} />
                  <InfoCard label="Address" value="Amrut Plaza, Office no. 304, 3rd Floor, Chendani Koliwada, Station Road, Thane (W)" />
                  <InfoCard label="Acknowledgement" value="Within 48 hours" />
                  <InfoCard label="Resolution" value="Within 30 days" />
                </div>
              </Section>

              <Section id="contact" icon={Mail} title="Contact Us">
                <p>
                  For more information about our privacy practices, if you have questions, or if you
                  would like to make a complaint, please contact us.
                </p>
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <a
                    href="mailto:contact@alokit.co"
                    className="inline-flex items-center gap-2.5 bg-amber-800 hover:bg-amber-900 text-white px-5 py-3 rounded-xl text-sm font-medium transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    contact@alokit.co
                  </a>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 px-5 py-3 rounded-xl text-sm font-medium transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                  </Link>
                </div>
              </Section>

              {/* Footer note */}
              <div className="pt-6 border-t border-stone-100 text-xs text-stone-400 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span>This policy may be updated periodically. Continued use of the website constitutes acceptance.</span>
                <span className="flex items-center gap-1.5 whitespace-nowrap">
                  <Shield className="w-3 h-3 text-amber-600" />
                  © Alokit Gems &amp; Jewels Pvt. Ltd.
                </span>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}