import React, { useState, useEffect } from 'react';
import { Mail, X, CheckCircle, ExternalLink, Calendar, Warehouse, DollarSign, Inbox, Sparkles } from 'lucide-react';
import { fetchRecentEmails } from '../services/api';
import { playClickSound } from '../utils/audio';

export default function EmailInboxModal({ isOpen, onClose }) {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadEmails = async () => {
    setLoading(true);
    try {
      const res = await fetchRecentEmails();
      if (res.success && res.data) {
        setEmails(res.data);
        if (res.data.length > 0 && !selectedEmail) {
          setSelectedEmail(res.data[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching recent emails:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadEmails();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-5xl bg-[#0f0f16] border border-[#27273a] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Top Bar */}
        <div className="p-4 sm:px-6 bg-[#14141d] border-b border-[#222232] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-950/80 border border-red-800 text-red-500 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-black text-sm sm:text-base text-white uppercase">
                AUTOMATED DISPATCHED CONFIRMATION EMAILS
              </h3>
              <p className="text-[11px] text-neutral-400">
                Inspect real-time HTML deeds dispatched by the server email service
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-[#1c1c28] hover:bg-[#2c2c3e] text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Split: List on Left, HTML Preview on Right */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Email List Column */}
          <div className="w-full md:w-80 bg-[#0b0b10] border-r border-[#20202e] overflow-y-auto max-h-[300px] md:max-h-none">
            <div className="p-3 border-b border-[#1a1a26] text-[10px] uppercase font-bold text-neutral-400 flex justify-between">
              <span>Dispatched Records</span>
              <span className="font-mono text-white">{emails.length} Emails</span>
            </div>

            {loading ? (
              <div className="p-4 space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-[#14141c] rounded animate-pulse" />
                ))}
              </div>
            ) : emails.length > 0 ? (
              <div className="divide-y divide-[#171724]">
                {emails.map((em) => {
                  const isSelected = selectedEmail && selectedEmail.id === em.id;
                  const dateStr = new Date(em.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  return (
                    <div
                      key={em.id || em.orderNumber}
                      onClick={() => {
                        playClickSound();
                        setSelectedEmail(em);
                      }}
                      className={`p-3.5 cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#181824] border-l-4 border-[#e50914]'
                          : 'hover:bg-[#12121c]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-1">
                        <span className="font-mono font-bold text-red-400">#{em.orderNumber}</span>
                        <span>{dateStr}</span>
                      </div>
                      <div className="font-bold text-white text-xs truncate">
                        {em.vehicleName || 'Supercar Purchase'}
                      </div>
                      <div className="text-[11px] text-neutral-400 truncate mt-0.5 font-mono">
                        To: {em.to}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-neutral-500 space-y-2">
                <Inbox className="w-8 h-8 mx-auto text-neutral-600" />
                <p>No emails dispatched yet in this session.</p>
                <p className="text-[10px] text-neutral-600">Complete a vehicle purchase to see the automated deed here.</p>
              </div>
            )}
          </div>

          {/* Email Preview Pane */}
          <div className="flex-1 bg-[#09090d] flex flex-col overflow-hidden">
            {selectedEmail ? (
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Email Meta header */}
                <div className="p-4 bg-[#12121a] border-b border-[#20202e] flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div>
                    <div className="font-bold text-white text-sm">
                      {selectedEmail.subject}
                    </div>
                    <div className="text-neutral-400 mt-0.5">
                      <span className="text-neutral-500 font-mono">From:</span> concierge@legendarymotors.vip &bull; <span className="text-neutral-500 font-mono">To:</span> <strong className="text-white font-mono">{selectedEmail.to}</strong>
                    </div>
                  </div>

                  {selectedEmail.etherealUrl && (
                    <a
                      href={selectedEmail.etherealUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-[#1f1f2d] hover:bg-[#2a2a3e] text-neutral-200 text-xs rounded flex items-center gap-1.5 border border-[#303046]"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                      <span>Ethereal Mailbox</span>
                    </a>
                  )}
                </div>

                {/* HTML Render Iframe */}
                <div className="flex-1 bg-[#0b0b0e] p-2 overflow-auto">
                  <iframe
                    title="Email Preview"
                    srcDoc={selectedEmail.htmlContent}
                    className="w-full h-full min-h-[480px] rounded-lg border-0 bg-transparent"
                  />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8 text-neutral-500 text-xs text-center">
                Select an email from the left sidebar to inspect its content.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
