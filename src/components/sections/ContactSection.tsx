import React, { useState } from 'react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { SectionHeader } from '../common/SectionHeader';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Magnetic } from '../common/Magnetic';
import { showToast } from '../common/Toast';
import { GithubIcon, LinkedinIcon, YoutubeIcon, GrabCadIcon } from '../common/Icons';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  FileText, 
  ExternalLink, 
  CheckCircle2, 
  MessageSquare,
  Copy,
  Box,
  Sparkles
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const sectionRef = useScrollReveal<HTMLElement>();
  const { data } = usePortfolioData();
  const { profile, socialLinks } = data;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Robotics Engineering Collaboration',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} Copied!`, `${text} has been copied to your clipboard.`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      showToast('Message Transmitted!', 'Your engineering inquiry has been received.');
      setFormData({
        name: '',
        email: '',
        subject: 'Robotics Engineering Collaboration',
        message: '',
      });
    }, 650);
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github': return <GithubIcon className="w-4 h-4" />;
      case 'linkedin': return <LinkedinIcon className="w-4 h-4" />;
      case 'youtube': return <YoutubeIcon className="w-4 h-4" />;
      case 'grabcad': return <GrabCadIcon className="w-4 h-4" />;
      default: return <Box className="w-4 h-4" />;
    }
  };

  return (
    <section ref={sectionRef} id="contact" className="py-28 relative border-t border-cyan-500/10 bg-[#020713] overflow-hidden">
      {/* Environmental laser glow */}
      <div className="absolute left-1/2 -top-24 -translate-x-1/2 w-[600px] h-[350px] bg-cyan-500/[0.045] blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badgeText="Initiate Transmission"
          badgeVariant="cyan"
          title="Engineering Inquiries & Collaboration"
          subtitle="Open for full-time robotics engineering appointments, R&D consultations, and autonomous system integrations."
        />

        {/* Oversized Editorial Banner */}
        <div className="mb-12 text-center reveal-fade-up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/40 border border-cyan-400/30 text-cyan-300 text-xs font-mono mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>DIRECT TELEMETRY GATEWAY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-white tracking-tight max-w-3xl mx-auto leading-tight">
            Let's Engineer The Future of <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-white bg-clip-text text-transparent">Physical Autonomy</span>.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Contact Channels & Credentials */}
          <div className="lg:col-span-5 space-y-6 reveal-on-scroll">
            <Card padding="lg" className="space-y-6 border-cyan-500/20 bg-[#061120]/85 backdrop-blur-md">
              <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
                <MessageSquare className="w-5 h-5 text-cyan-400" />
                <span>Direct Contact Channels</span>
              </h3>

              <div className="space-y-3.5 text-sm">
                {/* Email with copy button */}
                <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 group hover:border-cyan-500/40 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 rounded-lg bg-slate-800 text-cyan-400 shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-mono uppercase text-slate-400">Email Address</div>
                      <a
                        href={`mailto:${profile.email}`}
                        className="text-slate-200 font-medium hover:text-cyan-300 transition-colors truncate block"
                      >
                        {profile.email}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(profile.email, 'Email Address')}
                    className="p-2 rounded-lg bg-slate-800/80 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 transition-all shrink-0"
                    title="Copy Email"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                {/* Phone with copy button */}
                <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 group hover:border-sky-500/40 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 rounded-lg bg-slate-800 text-sky-400 shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-mono uppercase text-slate-400">Direct Line / WhatsApp</div>
                      <a
                        href={`tel:${profile.phone}`}
                        className="text-slate-200 font-medium hover:text-sky-300 transition-colors font-mono truncate block"
                      >
                        {profile.phone}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(profile.phone, 'Phone Number')}
                    className="p-2 rounded-lg bg-slate-800/80 hover:bg-sky-500/20 text-slate-400 hover:text-sky-300 transition-all shrink-0"
                    title="Copy Phone Number"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                {/* Location */}
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="p-2.5 rounded-lg bg-slate-800 text-amber-400 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase text-slate-400">Location Base</div>
                    <div className="text-slate-200 font-medium text-xs sm:text-sm">{profile.location}</div>
                  </div>
                </div>
              </div>

              {/* Resume download box */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-[#07192f] border border-cyan-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Full Engineering Curriculum Vitae</div>
                    <div className="text-[10px] font-mono text-slate-400">PDF Document • Verified Credentials</div>
                  </div>
                </div>

                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 text-xs font-mono font-semibold rounded-lg bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 hover:brightness-110 transition-all flex items-center gap-1.5 shadow-md"
                >
                  <span>Download</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Social Channels */}
              <div className="pt-2 border-t border-slate-800/80">
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 font-semibold">
                  Professional Channels:
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {socialLinks.map((soc) => (
                    <a
                      key={soc.id}
                      href={soc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-cyan-400/50 hover:bg-slate-800 transition-all shadow-sm"
                    >
                      <span className="text-cyan-400">{getSocialIcon(soc.platform)}</span>
                      <span className="truncate font-medium">{soc.platform}</span>
                    </a>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Right: Message Dispatch Form */}
          <div className="lg:col-span-7 reveal-on-scroll delay-100">
            <Card padding="lg" className="border-cyan-500/20 bg-[#061120]/85 backdrop-blur-md">
              <h3 className="text-lg font-bold text-white mb-2 font-display">
                Dispatch Technical Message
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mb-6">
                Transmit project requirements, autonomous system specifications, or career opportunities directly to my terminal.
              </p>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-4 animate-fadeIn">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-lg font-bold text-white">Transmission Completed</h4>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                    Your inquiry has been successfully transmitted. I will review your technical specifications and follow up via email promptly.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSubmitted(false)}
                    className="mt-2"
                  >
                    Send Another Transmission
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-300">
                        Full Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Dr. Alex Mercer"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-300">
                        Email Address <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. alex@aerorobotics.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">
                      Engineering Domain / Topic
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                    >
                      <option value="Robotics Engineering Collaboration">Robotics Engineering Collaboration</option>
                      <option value="Embedded Firmware Opportunity">Embedded Firmware Opportunity</option>
                      <option value="Mechanical CAD / Actuator Design Inquiry">Mechanical CAD / Actuator Design Inquiry</option>
                      <option value="Research & Academic Inquiries">Research & Academic Inquiries</option>
                      <option value="General Engineering Question">General Engineering Question</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">
                      Message Specifications <span className="text-rose-400">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Outline your engineering project scope, robot kinematics requirements, or role specifications..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors resize-none"
                    />
                  </div>

                  <Magnetic strength={0.2}>
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      loading={loading}
                      icon={<Send className="w-4 h-4" />}
                      iconPosition="right"
                      className="w-full justify-center bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 font-bold hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]"
                    >
                      Transmit Engineering Message
                    </Button>
                  </Magnetic>
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
