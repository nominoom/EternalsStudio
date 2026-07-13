'use client';

import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Mail, Phone, Share2, Shield, Send, CheckCircle2, FileText, Briefcase } from 'lucide-react';

export default function Contact() {
  const [formType, setFormType] = useState<'inquiry' | 'request'>('inquiry');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    phone: '',
    fileUrl: '',
  });
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const isRequest = formType === 'request';
      const endpoint = isRequest ? '/api/requests' : '/api/contact';
      
      const payload = isRequest ? {
        clientName: `${formData.firstName} ${formData.lastName}`.trim(),
        clientEmail: formData.email,
        clientPhone: formData.phone,
        subject: formData.subject,
        description: formData.message,
        fileUrl: formData.fileUrl,
      } : formData;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setShowSuccess(true);
        if (isRequest && data.request) {
          const localRequests = JSON.parse(localStorage.getItem('localCustomRequests') || '[]');
          localStorage.setItem('localCustomRequests', JSON.stringify([data.request, ...localRequests]));
        }
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          company: '',
          subject: '',
          message: '',
          phone: '',
          fileUrl: '',
        });
      } else {
        throw new Error(data.error || 'Failed to submit message');
      }
    } catch (err: any) {
      alert(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <>
      <Navbar />

      <main className="flex-1 relative overflow-hidden bg-transparent text-slate-900 dark:text-slate-50 py-16 px-6 sm:px-8">
        
        {/* Header */}
        <section className="mx-auto max-w-7xl relative z-10 text-center flex flex-col items-center gap-4 py-8 mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            Contact <span className="bg-gradient-to-r from-teal-400 to-indigo-500 bg-clip-text text-transparent">Us</span>
          </h1>
          <p className="text-lg font-medium text-slate-500 dark:text-slate-400 max-w-xl">
            Get in touch with our design and development team or submit a project specification request directly to the studio.
          </p>
        </section>

        {/* 2-Column Layout */}
        <section className="mx-auto max-w-7xl relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-20">
          
          {/* Left Form Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-8 shadow-sm">
            
            {/* Form Type Tab Selector */}
            {!showSuccess && (
              <div className="grid grid-cols-2 gap-2 mb-8 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-xl border border-slate-200/30 dark:border-slate-800/30">
                <button
                  type="button"
                  onClick={() => setFormType('inquiry')}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    formType === 'inquiry'
                      ? 'bg-white dark:bg-slate-900 shadow-sm text-teal-600 dark:text-teal-400'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
                  }`}
                >
                  <FileText size={14} />
                  <span>General Inquiry</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormType('request')}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    formType === 'request'
                      ? 'bg-white dark:bg-slate-900 shadow-sm text-teal-600 dark:text-teal-400'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
                  }`}
                >
                  <Briefcase size={14} />
                  <span>Project Request</span>
                </button>
              </div>
            )}

            {showSuccess ? (
              <div className="flex flex-col items-center text-center gap-4 py-16">
                <CheckCircle2 size={56} className="text-teal-500" />
                <h3 className="text-xl font-extrabold">Submission Sent!</h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-sm">
                  {formType === 'request'
                    ? 'Your project request has been logged successfully. Our administrators will review the details and delegate it to the team portal.'
                    : 'Thank you for contacting Eternals Studio. A member of our support team will reply inside 24 to 48 hours.'}
                </p>
                <button
                  onClick={() => setShowSuccess(false)}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Send Another Submission
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="firstName" className="text-xs font-bold text-slate-600 dark:text-slate-400">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First Name"
                      className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition-all"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="lastName" className="text-xs font-bold text-slate-600 dark:text-slate-400">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last Name"
                      className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-xs font-bold text-slate-600 dark:text-slate-400">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition-all"
                    required
                  />
                </div>

                {formType === 'request' && (
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="phone" className="text-xs font-bold text-slate-600 dark:text-slate-400">Phone Number (For Callback)</label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(555) 000-0000"
                      className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition-all"
                      required
                    />
                  </div>
                )}

                {formType === 'inquiry' && (
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="company" className="text-xs font-bold text-slate-600 dark:text-slate-400">Company (Optional)</label>
                    <input
                      type="text"
                      id="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Your Company"
                      className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition-all"
                    />
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="subject" className="text-xs font-bold text-slate-600 dark:text-slate-400">Project Subject / Topic</label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder={formType === 'request' ? "e.g. Esports Team Branding Package" : "e.g. General Inquiry"}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition-all"
                    required
                  />
                </div>

                {formType === 'request' && (
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="fileUrl" className="text-xs font-bold text-slate-600 dark:text-slate-400">Reference File Link (Drive, Dropbox, Figma)</label>
                    <input
                      type="url"
                      id="fileUrl"
                      value={formData.fileUrl}
                      onChange={handleChange}
                      placeholder="https://drive.google.com/..."
                      className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition-all"
                    />
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-xs font-bold text-slate-600 dark:text-slate-400">
                    {formType === 'request' ? 'Project Requirements & Scope Details' : 'Message'}
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={formType === 'request' ? "Describe the scope of work, timeline constraints, aesthetic styles, or custom formats required..." : "Describe your design or development goals..."}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition-all resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-sm py-3 mt-2 shadow-md shadow-teal-500/10 disabled:opacity-50 transition-all cursor-pointer"
                >
                  <Send size={16} />
                  <span>{submitting ? 'Submitting...' : formType === 'request' ? 'Submit Project Request' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Info Stack */}
          <div className="flex flex-col gap-6 w-full">
            {/* Card 1 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6 shadow-sm flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Mail size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Support</span>
                <a href="mailto:Eternalsanctuarygg@gmail.com" className="font-extrabold text-sm hover:text-teal-500 transition-colors">
                  Eternalsanctuarygg@gmail.com
                </a>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6 shadow-sm flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Phone size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Connect Directly</span>
                <a href="tel:+12405233976" className="font-extrabold text-sm hover:text-indigo-500 transition-colors">
                  (240) 523-3976
                </a>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6 shadow-sm flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center">
                <Share2 size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Social Channels</span>
                <span className="font-extrabold text-sm">Instagram, Discord & Twitter</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6 shadow-sm flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Shield size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Typical Response Time</span>
                <span className="font-extrabold text-sm">24 ~ 48 Hours Guaranteed</span>
              </div>
            </div>
          </div>

        </section>
      </main>

      <Footer />
    </>
  );
}
