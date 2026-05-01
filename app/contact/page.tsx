"use client";
import { useState } from "react";
import { contactApi, leadApi } from "@/lib/api";
import toast from "react-hot-toast";
import { Mail, Phone, MapPin, Loader2, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [consultForm, setConsultForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [consultLoading, setConsultLoading] = useState(false);

  const set = (setter: typeof setForm) => (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setter((f) => ({ ...f, [k]: e.target.value }));

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await contactApi.submit(form);
      setSubmitted(true);
      toast.success("Message sent! We'll get back to you soon.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const handleConsult = async (e: React.FormEvent) => {
    e.preventDefault();
    setConsultLoading(true);
    try {
      await leadApi.gemstoneRecommendation(consultForm);
      toast.success("Consultation request received! Our experts will contact you.");
      setConsultForm({ name: "", email: "", phone: "", message: "" });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to submit request");
    } finally {
      setConsultLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-950 to-stone-900 text-white py-14 text-center">
        <p className="font-jost text-amber-500 tracking-widest text-xs uppercase mb-2">Get in Touch</p>
        <h1 className="font-cinzel text-4xl md:text-5xl font-bold text-amber-100 mb-2">Contact Us</h1>
        <p className="text-amber-400 font-jost text-sm">We&apos;re here to help you on your sacred journey</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="font-cinzel text-2xl font-bold text-stone-800 mb-6">Send a Message</h2>

            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="font-cinzel text-xl font-bold text-green-800 mb-2">Message Received!</h3>
                <p className="font-jost text-green-600">Thank you for reaching out. We&apos;ll respond within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleContact} className="space-y-4">
                {[
                  { key: "name", label: "Full Name", type: "text", required: true, placeholder: "Your name" },
                  { key: "email", label: "Email", type: "email", required: false, placeholder: "your@email.com" },
                  { key: "phone", label: "Phone", type: "tel", required: false, placeholder: "Your phone number" },
                ].map(({ key, label, type, required, placeholder }) => (
                  <div key={key}>
                    <label className="block text-sm font-jost font-medium text-stone-700 mb-1">{label}{required && " *"}</label>
                    <input
                      type={type}
                      required={required}
                      value={form[key as keyof typeof form]}
                      onChange={set(setForm)(key)}
                      placeholder={placeholder}
                      className="w-full border border-amber-200 rounded-xl px-4 py-2.5 text-sm font-jost outline-none focus:border-amber-500 bg-amber-50/40"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-jost font-medium text-stone-700 mb-1">Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={set(setForm)("message")}
                    placeholder="How can we help you?"
                    className="w-full border border-amber-200 rounded-xl px-4 py-2.5 text-sm font-jost outline-none focus:border-amber-500 bg-amber-50/40 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-amber-800 hover:bg-amber-700 disabled:bg-stone-300 text-white font-jost font-semibold px-8 py-3 rounded-xl transition-colors"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>

          {/* Right Side */}
          <div className="space-y-8">
            {/* Info */}
            <div>
              <h2 className="font-cinzel text-2xl font-bold text-stone-800 mb-5">Our Details</h2>
              <div className="space-y-4">
                {[
                  { icon: MapPin, title: "Address", value: "Amrut Plaza, Office no. 304, 3rd Floor, Chendani Koliwada, station road, Thane(W)" },
                  { icon: Phone, title: "Phone", value: "+91 7039222272" },
                  { icon: Mail, title: "Email", value: "contact@alokit.co" },
                ].map(({ icon: Icon, title, value }) => (
                  <div key={title} className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-amber-700" />
                    </div>
                    <div>
                      <p className="font-jost font-semibold text-stone-800 text-sm">{title}</p>
                      <p className="font-jost text-stone-500 text-sm">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

         
          
          </div>
        </div>
      </div>
    </div>
  );
}
