import React, { useState } from 'react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { SectionHeader } from '../common/SectionHeader';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
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
  Box
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: 'Robotics Engineering Collaboration',
        message: '',
      });
    }, 600);
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
    <section ref={sectionRef} id="contact" className="py-20 relative border-t border-slate-800/80 bg-background-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badgeText="Get In Touch"
          badgeVariant="cyan"
          title="Contact & Engineering Inquiries"
          subtitle="Open to full-time robotics/mechatronics engineering roles, research collaborations, and technical consultations."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-6 reveal-on-scroll">
            <Card padding="lg" className="space-y-6 border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-engineering-cyan" />
                <span>Direct Contact Channels</span>
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3.5 p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <div className="p-2 rounded-lg bg-slate-800 text-cyan-400 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-mono uppercase text-slate-400">Email Address</div>
                    <a
                      href={`mailto:${profile.email}`}
                      className="text-slate-200 font-medium hover:text-engineering-cyanGlow transition-colors"
                    >
                      {profile.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <div className="p-2 rounded-lg bg-slate-800 text-sky-400 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-mono uppercase text-slate-400">Direct Line / WhatsApp</div>
                    <a
                      href={`tel:${profile.phone}`}
                      className="text-slate-200 font-medium hover:text-engineering-cyanGlow transition-colors font-mono"
                    >
                      {profile.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <div className="p-2 rounded-lg bg-slate-800 text-amber-400 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-mono uppercase text-slate-400">Location & Availability</div>
                    <div className="text-slate-200 font-medium">{profile.location}</div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-slate-900/50 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-engineering-blue/20 text-sky-400 border border-sky-500/30">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Full Engineering Resume</div>
                    <div className="text-[10px] font-mono text-slate-400">PDF Format • Updated 2024</div>
                  </div>
                </div>

                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-xs font-mono rounded-lg bg-engineering-blue text-white hover:bg-sky-600 transition-colors flex items-center gap-1"
                >
                  <span>Download</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
                  Professional Networks:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {socialLinks.map((soc) => (
                    <a
                      key={soc.id}
                      href={soc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
                    >
                      <span className="text-engineering-cyan">{getSocialIcon(soc.platform)}</span>
                      <span className="truncate">{soc.platform}</span>
                    </a>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-7 reveal-on-scroll delay-100">
            <Card padding="lg" className="border-slate-800">
              <h3 className="text-lg font-bold text-white mb-2">
                Send a Direct Message
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mb-6">
                Fill out the form below to initiate discussion regarding engineering positions, project inquiries, or research collaborations.
              </p>

              {submitted ? (
                <div className="p-6 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3 animate-fadeIn">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white">Message Transmitted Successfully</h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Thank you for reaching out. I have received your message and will respond promptly via email.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSubmitted(false)}
                    className="mt-2"
                  >
                    Send Another Message
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
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900/90 border border-slate-700/80 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-engineering-cyan focus:ring-1 focus:ring-engineering-cyan transition-colors"
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
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900/90 border border-slate-700/80 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-engineering-cyan focus:ring-1 focus:ring-engineering-cyan transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">
                      Topic / Domain
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-engineering-cyan focus:ring-1 focus:ring-engineering-cyan transition-colors"
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
                      Message Details <span className="text-rose-400">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Outline your project scope, engineering requirements, or role specifications..."
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900/90 border border-slate-700/80 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-engineering-cyan focus:ring-1 focus:ring-engineering-cyan transition-colors resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    loading={loading}
                    icon={<Send className="w-4 h-4" />}
                    iconPosition="right"
                    className="w-full justify-center"
                  >
                    Transmit Engineering Inquiry
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
