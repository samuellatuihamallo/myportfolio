/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UplinkMessage } from '../types';
import { Send, Terminal, Shield, Wifi, Linkedin, Github, CheckCircle, Clock } from 'lucide-react';
import { audioSynth } from '../utils/audio';

interface LogsViewProps {
  messages: UplinkMessage[];
  onSendMessage: (message: Omit<UplinkMessage, 'id' | 'timestamp' | 'status'>) => void;
}

export const LogsView: React.FC<LogsViewProps> = ({
  messages,
  onSendMessage,
}) => {
  // Form State
  const [userIdentifier, setUserIdentifier] = useState('');
  const [uplinkAddress, setUplinkAddress] = useState('');
  const [messageText, setMessageText] = useState('');

  // Encryption Animation Sequence
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [transmissionLogs, setTransmissionLogs] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userIdentifier.trim() || !uplinkAddress.trim() || !messageText.trim()) {
      audioSynth.playAlert();
      return;
    }

    audioSynth.playClick();
    setIsTransmitting(true);
    setTransmissionLogs([]);
    setIsSuccess(false);

    const logs = [
      'INITIALIZING HYPERION ENCRYPTION LINK...',
      'SHIELD_GATE: SCANNING SSL CERTIFICATES...',
      'ESTABLISHING SECURE MULTI-NODE CONDUIT...',
      'TUNNEL: ROTATING SECURITY PACKETS (AES-256-GCM)...',
      'BYPASSING DEFENSIVE MAIN SYSTEM FIREWALLS...',
      'PACKET ROUTING SUCCESSFUL // JAKARTA_NODE_01',
      'UPLINK STABILIZED // FLUX COMPLETED.'
    ];

    for (let i = 0; i < logs.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setTransmissionLogs((prev) => [...prev, logs[i]]);
      if (i % 2 === 0) {
        audioSynth.playClick();
      }
    }

    setTimeout(() => {
      audioSynth.playSuccess();
      onSendMessage({
        userIdentifier: userIdentifier.trim(),
        uplinkAddress: uplinkAddress.trim(),
        message: messageText.trim(),
      });
      setIsTransmitting(false);
      setIsSuccess(true);

      // Reset fields
      setUserIdentifier('');
      setUplinkAddress('');
      setMessageText('');
    }, 400);
  };

  const handleSocialClick = (platform: string, url: string) => {
    audioSynth.playSuccess();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex flex-col gap-6 w-full" id="logs_view">
      
      {/* HEADER PROTOCOL BLOCK */}
      <div className="border-l-2 border-hud-blue pl-4 mb-4">
        <span className="text-[10px] font-mono text-hud-blue tracking-widest uppercase block mb-1">
          COMMUNICATION_PROTOCOL // SECURE_UPLINK
        </span>
        <h2 className="text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight leading-none mb-2">
          PARTY INVITE<span className="animate-pulse text-hud-blue">|</span>
        </h2>
        <p className="text-hud-text-dim text-sm max-w-3xl leading-relaxed">
          Initialize a direct secure uplink to synchronize developer quests, propose joint contract operations, or coordinate interview timelines. Operator responses are dispatched based on active context queue parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Diagnostics and Social Nodes (4/12 width) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Node Status Badge */}
          <div className="hud-glass p-4 rounded-xl border border-white/10 flex justify-between items-center">
            <span className="text-xs font-mono font-bold text-hud-text-dim">UPLINK_NODE_STATUS</span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-hud-green/10 border border-hud-green/30 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-hud-green animate-ping" />
              <span className="text-[9px] font-mono font-bold text-hud-green tracking-wider">ACTIVE</span>
            </div>
          </div>

          {/* Current Zone Coordinates */}
          <div className="hud-glass p-4 rounded-xl border border-white/5 bg-white/[0.01]">
            <span className="text-[9px] font-mono text-hud-text-dim tracking-widest uppercase block mb-1">CURRENT_ZONE</span>
            <span className="text-md font-display font-bold text-white uppercase tracking-wide">
              INDONESIA_WEST-01
            </span>
          </div>

          {/* Operating hours */}
          <div className="hud-glass p-4 rounded-xl border border-white/5 bg-white/[0.01]">
            <span className="text-[9px] font-mono text-hud-text-dim tracking-widest uppercase block mb-1">OPERATING_WINDOW</span>
            <span className="text-md font-display font-bold text-white uppercase tracking-wide">
              08:00 - 21:00 WIB
            </span>
          </div>

          {/* Social Network Gates */}
          <div className="flex flex-col gap-2">
            <span className="text-[9px] font-mono text-hud-blue font-bold tracking-widest uppercase px-1">
              ESTABLISH_NETWORK_CONNECTIONS:
            </span>
            
            <button
              onClick={() => handleSocialClick('LinkedIn', 'https://linkedin.com/')}
              className="hud-glass p-3.5 rounded-xl border border-white/5 hover:border-hud-blue/40 bg-white/[0.01] hover:bg-hud-blue/[0.02] flex items-center justify-between group transition-all cursor-pointer"
            >
              <div className="flex flex-col items-start text-left">
                <span className="text-[8px] font-mono text-hud-text-dim">ESTABLISH_NETWORK</span>
                <span className="text-xs font-display font-bold text-white mt-0.5 group-hover:text-hud-blue transition-colors">LinkedIn</span>
              </div>
              <Linkedin className="w-5 h-5 text-hud-text-dim group-hover:text-hud-blue transition-colors" />
            </button>

            <button
              onClick={() => handleSocialClick('GitHub', 'https://github.com/samuellatuihamallo')}
              className="hud-glass p-3.5 rounded-xl border border-white/5 hover:border-hud-green/40 bg-white/[0.01] hover:bg-hud-green/[0.02] flex items-center justify-between group transition-all cursor-pointer"
            >
              <div className="flex flex-col items-start text-left">
                <span className="text-[8px] font-mono text-hud-text-dim">FETCH_RESOURCES</span>
                <span className="text-xs font-display font-bold text-white mt-0.5 group-hover:text-hud-green transition-colors">GitHub</span>
              </div>
              <Github className="w-5 h-5 text-hud-text-dim group-hover:text-hud-green transition-colors" />
            </button>
          </div>

          {/* Diagnostic Integrity */}
          <div className="hud-glass p-4 rounded-xl border border-white/10 flex flex-col gap-2">
            <div className="flex justify-between items-center text-[10px] font-mono tracking-wider">
              <span className="text-hud-text-dim">SIGNAL_INTEGRITY</span>
              <span className="text-hud-blue font-bold">98%</span>
            </div>
            {/* Horizontal progress bar segment */}
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-hud-blue shadow-[0_0_8px_rgba(0,240,255,0.4)]" style={{ width: '98%' }} />
            </div>
          </div>

        </div>

        {/* Right Column: Secure Form and Terminal Overlay (8/12 width) */}
        <div className="lg:col-span-8">
          
          {/* UPLINK FORM MODULE */}
          <div className="hud-glass p-6 rounded-xl border border-white/10 flex flex-col gap-5 relative overflow-hidden h-full">
            
            {/* Warning Shield Graphic */}
            <Shield className="absolute top-6 right-6 w-12 h-12 text-white/[0.02] pointer-events-none" />

            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-hud-blue" />
                <h3 className="text-xs font-mono font-bold tracking-widest text-white uppercase">
                  UPLINK FORM
                </h3>
              </div>
              <span className="text-[9px] font-mono text-hud-blue tracking-widest animate-pulse">
                ESTABLISHING_ENCRYPTED_TUNNEL...
              </span>
            </div>

            {isTransmitting ? (
              /* TRANSMITTING TERMINAL INTERACTIVE SCREEN */
              <div className="bg-black/60 border border-hud-blue/30 rounded-lg p-5 font-mono text-xs text-hud-blue space-y-2 h-[260px] overflow-y-auto">
                <div className="flex justify-between items-center text-[10px] text-hud-text-dim border-b border-hud-blue/20 pb-1.5 mb-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>SECURE_ENCRYPTION_SHELL v1.4</span>
                  </div>
                  <span className="animate-pulse">ONLINE</span>
                </div>
                {transmissionLogs.map((log, idx) => (
                  <div key={idx} className="leading-relaxed">
                    <span className="text-hud-text-dim pr-1.5">&gt;</span> {log}
                  </div>
                ))}
                <div className="w-2 h-4 bg-hud-blue inline-block animate-pulse ml-1" />
              </div>
            ) : isSuccess ? (
              /* SUCCESS CONFIRMATION BLOCK */
              <div className="bg-hud-green/[0.01] border border-hud-green/30 rounded-xl p-6 flex flex-col items-center justify-center text-center gap-4 h-[260px] animate-in fade-in zoom-in duration-200">
                <div className="p-3 bg-hud-green/10 rounded-full border border-hud-green/20">
                  <CheckCircle className="w-8 h-8 text-hud-green" />
                </div>
                <div>
                  <h4 className="text-md font-display font-bold text-white uppercase tracking-wider">
                    Uplink Synchronized Successfully!
                  </h4>
                  <p className="text-hud-text-dim text-xs font-mono max-w-md mt-1.5 leading-relaxed">
                    A secure cryptographic record has been committed to our logs. We will establish direct communications once queue resources permit.
                  </p>
                </div>
                <button
                  onClick={() => {
                    audioSynth.playClick();
                    setIsSuccess(false);
                  }}
                  className="px-4 py-2 bg-hud-green/15 hover:bg-hud-green/25 border border-hud-green/30 text-hud-green font-mono text-[10px] tracking-widest rounded-lg transition-all cursor-pointer"
                >
                  TRANSMIT_NEW_LOG
                </button>
              </div>
            ) : (
              /* ACTIVE FORM FIELDS */
              <form onSubmit={handleSendMessage} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-hud-blue font-bold tracking-widest">
                      User Identifier
                    </label>
                    <input
                      type="text"
                      required
                      value={userIdentifier}
                      onChange={(e) => setUserIdentifier(e.target.value)}
                      placeholder="e.g. GUEST_1234"
                      className="bg-black/30 border border-white/10 focus:border-hud-blue rounded-lg px-3.5 py-2.5 text-xs text-white outline-none font-mono tracking-wider placeholder:text-white/20"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-hud-blue font-bold tracking-widest">
                      Uplink Address
                    </label>
                    <input
                      type="email"
                      required
                      value={uplinkAddress}
                      onChange={(e) => setUplinkAddress(e.target.value)}
                      placeholder="e.g. COMM_LINK@DOMAIN.EXT"
                      className="bg-black/30 border border-white/10 focus:border-hud-blue rounded-lg px-3.5 py-2.5 text-xs text-white outline-none font-mono tracking-wider placeholder:text-white/20"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-hud-blue font-bold tracking-widest">
                    Quest Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="DEFINE OBJECTIVES AND PROJECT PARAMETERS..."
                    className="bg-black/30 border border-white/10 focus:border-hud-blue rounded-lg px-3.5 py-2.5 text-xs text-white outline-none font-sans leading-relaxed placeholder:text-white/20"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
                  <span className="text-[10px] font-mono text-hud-text-dim flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-hud-green" />
                    VERIFIED_SECURE_UPLINK // TLS_1.3
                  </span>
                  <button
                    type="submit"
                    className="py-3 px-6 bg-hud-blue hover:bg-hud-blue/95 text-black font-display font-extrabold text-xs tracking-widest rounded-lg flex items-center gap-3 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.25)] hover:shadow-[0_0_25px_rgba(0,240,255,0.45)] group hud-clip-br"
                  >
                    SEND REQUEST
                    <Send className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>

      </div>

      {/* UPLINKS LOG DATABASE */}
      <div className="hud-glass p-5 rounded-xl border border-white/5 bg-white/[0.01] mt-4">
        <div className="flex items-center gap-2 border-b border-white/5 pb-2.5 mb-4">
          <Clock className="w-4 h-4 text-hud-purple" />
          <h3 className="text-xs font-mono font-bold tracking-widest text-white uppercase">
            SECURE_UPLINK_HISTORIC_LOGS
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className="bg-black/30 border border-white/5 hover:border-white/10 p-4 rounded-lg flex flex-col gap-2 transition-all"
            >
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-white font-bold">{msg.userIdentifier}</span>
                <span className="text-hud-text-dim">{msg.timestamp}</span>
              </div>
              <p className="text-xs text-hud-text-dim font-sans leading-relaxed line-clamp-2">
                "{msg.message}"
              </p>
              <div className="flex justify-between items-center text-[9px] font-mono pt-1.5 border-t border-white/5">
                <span className="text-hud-blue">{msg.uplinkAddress}</span>
                <span className={`px-1.5 py-0.5 rounded ${
                  msg.status === 'STABILIZED' ? 'text-hud-green bg-hud-green/10' : 'text-hud-text-dim bg-white/5'
                }`}>
                  {msg.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};