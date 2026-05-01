// app/gemstone-consultation-form/page.tsx

"use client";

import { useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Mail,
  MapPin,
  User,
  ArrowRight,
  ArrowLeft,
  Lock,
  ShieldCheck,
} from "lucide-react";

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export default function GemstoneConsultationFormPage() {
  const [step, setStep] = useState<"billing" | "summary">("billing");
  const [submitted, setSubmitted] = useState(false);
  const [takeKundaliReport, setTakeKundaliReport] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    dob: "2026-04-27T14:25",
    gender: "Male",
    language: "English",
    city: "",
    pinCode: "",
    state: "",
    country: "India",
  });

  const basePrice = 94.06;
  const gst = 16.94;
  const kundaliReportPrice = 399;
  const totalPayable = takeKundaliReport
    ? 111 + kundaliReportPrice
    : 111;

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const errors = {
    firstName: !formData.firstName.trim(),
    lastName: !formData.lastName.trim(),
    phone: !/^[6-9]\d{9}$/.test(formData.phone),
    email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
    dob: !formData.dob,
    city: !formData.city.trim(),
    pinCode: !/^\d{6}$/.test(formData.pinCode),
    state: !formData.state,
  };

  const hasErrors = Object.values(errors).some(Boolean);

  const handleBillingSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);

    if (hasErrors) return;

    setStep("summary");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePayment = () => {
    console.log("Payment started", {
      user: formData,
      takeKundaliReport,
      totalPayable,
    });

    // Add Razorpay logic here
  };

  const inputClass = (hasError?: boolean) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 ${
      submitted && hasError
        ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
        : "border-slate-300 focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
    }`;

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#111833] via-[#4b176f] to-[#6d1594] px-4 py-10 text-white sm:px-6 lg:px-8">
      <section className="mx-auto max-w-4xl text-center">
        <h1 className="bg-gradient-to-r from-orange-400 via-pink-400 to-fuchsia-400 bg-clip-text text-3xl font-extrabold leading-tight text-transparent sm:text-5xl">
          Get your personalized gemstones
          <br />
          consultation
        </h1>

        <p className="mt-4 text-base font-medium text-white/90 sm:text-lg">
          Personalized consultation ensures you get exactly what you need
        </p>

        <div className="mx-auto mt-5 h-0.5 w-64 rounded-full bg-gradient-to-r from-transparent via-pink-400 to-transparent" />
      </section>

      {step === "billing" ? (
        <section className="mx-auto mt-7 max-w-xl">
          <div className="overflow-hidden rounded-2xl bg-white shadow-2xl shadow-black/30">
            <div className="h-2 bg-gradient-to-r from-orange-500 via-pink-500 to-fuchsia-500" />

            <form onSubmit={handleBillingSubmit} className="px-6 py-7 sm:px-8">
              <div className="text-center">
                <h2 className="text-2xl font-extrabold text-slate-800">
                  Billing Details
                </h2>
                <p className="mt-2 text-sm font-medium text-slate-500">
                  Please fill in your information below to continue
                </p>
              </div>

              <div className="my-6 h-px bg-slate-200" />

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold text-red-500">
                    First Name *
                  </label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        updateField("firstName", e.target.value)
                      }
                      placeholder="Enter your first name"
                      className={`${inputClass(errors.firstName)} px-10`}
                    />
                  </div>
                  {submitted && errors.firstName && (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      First Name is required
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold text-red-500">
                    Last Name *
                  </label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        updateField("lastName", e.target.value)
                      }
                      placeholder="Enter your last name"
                      className={`${inputClass(errors.lastName)} px-10`}
                    />
                  </div>
                  {submitted && errors.lastName && (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      Last Name is required
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-xs font-bold text-red-500">
                  Phone Number *
                </label>

                <div
                  className={`flex overflow-hidden rounded-xl border bg-white transition ${
                    submitted && errors.phone
                      ? "border-red-400 focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-100"
                      : "border-slate-300 focus-within:border-pink-500 focus-within:ring-4 focus-within:ring-pink-100"
                  }`}
                >
                  <div className="flex items-center gap-2 border-r border-slate-200 px-3 text-sm font-semibold text-slate-700">
                    <span>🇮🇳</span>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                    <span>+91</span>
                  </div>

                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full px-4 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  />
                </div>

                {submitted && errors.phone && (
                  <p className="mt-2 text-xs font-medium text-red-500">
                    Please enter a valid 10-digit phone number
                  </p>
                )}
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-xs font-bold text-red-500">
                  Email Address *
                </label>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="Enter your email address"
                    className={`${inputClass(errors.email)} px-10`}
                  />
                </div>

                {submitted && errors.email && (
                  <p className="mt-2 text-xs font-medium text-red-500">
                    Please enter a valid email address
                  </p>
                )}
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-xs font-bold text-slate-800">
                  Date and Time of Birth *
                </label>

                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type="datetime-local"
                    value={formData.dob}
                    onChange={(e) => updateField("dob", e.target.value)}
                    className={`${inputClass(errors.dob)} px-10 font-medium`}
                  />
                </div>

                {submitted && errors.dob && (
                  <p className="mt-2 text-xs font-medium text-red-500">
                    Date and time of birth is required
                  </p>
                )}
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold text-red-500">
                    Gender *
                  </label>

                  <div className="flex gap-3">
                    {["Male", "Female"].map((gender) => (
                      <label
                        key={gender}
                        className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                          formData.gender === gender
                            ? "border-orange-400 bg-orange-50 text-slate-900"
                            : "border-slate-300 bg-white text-slate-600 hover:border-pink-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="gender"
                          value={gender}
                          checked={formData.gender === gender}
                          onChange={(e) =>
                            updateField("gender", e.target.value)
                          }
                          className="h-4 w-4 accent-orange-500"
                        />
                        {gender}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold text-red-500">
                    Language *
                  </label>

                  <div className="flex gap-3">
                    {["Hindi", "English"].map((language) => (
                      <label
                        key={language}
                        className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                          formData.language === language
                            ? "border-orange-400 bg-orange-50 text-slate-900"
                            : "border-slate-300 bg-white text-slate-600 hover:border-pink-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="language"
                          value={language}
                          checked={formData.language === language}
                          onChange={(e) =>
                            updateField("language", e.target.value)
                          }
                          className="h-4 w-4 accent-orange-500"
                        />
                        {language}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold text-red-500">
                    City of Birth *
                  </label>

                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      placeholder="Enter city of birth"
                      className={`${inputClass(errors.city)} px-10`}
                    />
                  </div>

                  {submitted && errors.city && (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      City is required
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold text-red-500">
                    PIN Code *
                  </label>

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={formData.pinCode}
                    onChange={(e) =>
                      updateField("pinCode", e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="Enter PIN code"
                    className={inputClass(errors.pinCode)}
                  />

                  {submitted && errors.pinCode && (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      Please enter a valid 6-digit PIN code
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold text-red-500">
                    State *
                  </label>

                  <div className="relative">
                    <select
                      value={formData.state}
                      onChange={(e) => updateField("state", e.target.value)}
                      className={inputClass(errors.state)}
                    >
                      <option value="">Select state</option>
                      {indianStates.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>

                  {submitted && errors.state && (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      State is required
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold text-red-500">
                    Country *
                  </label>

                  <input
                    type="text"
                    value={formData.country}
                    readOnly
                    className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm font-medium text-slate-600 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 via-orange-500 to-pink-500 px-6 py-4 text-sm font-extrabold text-white shadow-lg shadow-pink-500/25 transition hover:scale-[1.01] hover:shadow-xl"
              >
                Continue to Order Summary
                <ArrowRight className="h-4 w-4" />
              </button>

              <p className="mt-3 text-center text-[10px] font-medium text-slate-400">
                By proceeding you agree to our{" "}
                <a href="/terms-and-conditions" className="underline">
                  Terms
                </a>
                ,{" "}
                <a href="/privacy-policy" className="underline">
                  Privacy
                </a>{" "}
                &{" "}
                <a href="/refund-policy" className="underline">
                  Refund Policy
                </a>
                .
              </p>
            </form>
          </div>
        </section>
      ) : (
        <section className="mx-auto mt-7 max-w-xl">
          <div className="overflow-hidden rounded-2xl bg-white px-6 py-7 text-slate-900 shadow-2xl shadow-black/30 sm:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-extrabold text-slate-800">
                Order Summary
              </h2>
              <p className="mt-2 text-sm font-medium text-slate-500">
                Review your order and complete payment
              </p>
            </div>

            <div className="my-6 h-px bg-slate-200" />

            <div className="rounded-2xl bg-slate-50 p-5">
              <div className="mb-5 flex items-center gap-3">
                <span className="h-7 w-1 rounded-full bg-red-400" />
                <h3 className="text-lg font-extrabold">Your Order</h3>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between text-sm font-extrabold">
                  <span>Gem Consultation FB1</span>
                  <span>₹{basePrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-semibold">₹{basePrice.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-600">GST (18%)</span>
                    <span className="font-semibold">₹{gst.toFixed(2)}</span>
                  </div>

                  {takeKundaliReport && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">
                        Kundali Report Add-on
                      </span>
                      <span className="font-semibold">
                        ₹{kundaliReportPrice.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="border-t border-slate-200 pt-4" />

                  <div className="flex justify-between">
                    <span className="font-medium text-slate-700">
                      Total Payable
                    </span>
                    <span className="font-extrabold text-red-500">
                      ₹{totalPayable.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-orange-300 bg-orange-50">
              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-extrabold sm:text-lg">
                    Kundali Report (12 Month Reading)
                  </h3>

                  <div className="flex items-center gap-1 text-sm font-extrabold">
                    <span className="text-orange-600">₹399</span>
                    <span className="text-slate-700 line-through">₹2999</span>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-orange-200 bg-white p-4">
                  <div className="flex gap-4">
                    <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-lg bg-orange-100 text-3xl">
                      📕
                    </div>

                    <p className="text-xs leading-6 text-slate-600 sm:text-sm">
                      Agale 12 mahine ke liye apni Divinelane Kundali report
                      payein, jo aapke career, relationships, health, aur
                      finance mein growth aur challenges batayegi. Sath hi,
                      upayein aasan gharelu upay struggles ko dur karne aur
                      turant parinaam ke liye.
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <label className="flex cursor-pointer items-center gap-2 text-xs font-bold">
                    <input
                      type="checkbox"
                      checked={takeKundaliReport}
                      onChange={(e) =>
                        setTakeKundaliReport(e.target.checked)
                      }
                      className="h-5 w-5 rounded border-slate-300 accent-orange-500"
                    />
                    Yes, I will take it!
                  </label>

                  <span className="rounded bg-orange-200 px-2 py-1 text-[10px] font-bold text-orange-700">
                    Yeh offer sirf abhi ke liye seemit hain!
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handlePayment}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-4 text-sm font-extrabold text-white shadow-lg shadow-green-600/25 transition hover:scale-[1.01] hover:bg-green-700"
            >
              <Lock className="h-4 w-4" />
              Complete Order - ₹{totalPayable.toFixed(2)}
            </button>

            <button
              onClick={() => {
                setStep("billing");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="mx-auto mt-4 flex w-full max-w-xs items-center justify-center gap-2 rounded-lg bg-slate-200 px-5 py-3 text-xs font-semibold text-slate-500 transition hover:bg-slate-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Billing Details
            </button>

            <div className="my-5 h-px bg-slate-200" />

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-500">
                Powered By
                <span className="text-sm font-extrabold italic text-blue-700">
                  Razorpay
                </span>
              </div>

              <p className="mt-3 text-center text-[10px] font-medium text-slate-400">
                By proceeding you agree to our{" "}
                <a href="/terms-and-conditions" className="underline">
                  Terms
                </a>
                ,{" "}
                <a href="/privacy-policy" className="underline">
                  Privacy
                </a>{" "}
                &{" "}
                <a href="/refund-policy" className="underline">
                  Refund Policy
                </a>
                .
              </p>

              <div className="mt-4 flex items-center justify-center gap-1 text-[11px] font-semibold text-green-600">
                <ShieldCheck className="h-4 w-4" />
                Secure payment
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}