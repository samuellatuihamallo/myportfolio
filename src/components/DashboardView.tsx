/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CharacterProfile, AttributeStat, Quest, SkillNode, StatType } from '../types';
import { Shield, Rocket, ArrowUpRight, Target, BookOpen } from 'lucide-react';
import { audioSynth } from '../utils/audio';

interface DashboardViewProps {
  profile: CharacterProfile;
  stats: AttributeStat[];
  quests: Quest[];
  skills: SkillNode[];
  onSetTab: (tab: string) => void;
  onAllocateStat: (statName: StatType) => void;
  hueColor: string; // e.g. 'hud-blue', 'hud-green', 'hud-purple'
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  stats,
  quests,
  skills,
  onSetTab,
  onAllocateStat,
  hueColor,
}) => {
  const activeQuests = quests.filter((q) => q.status === 'ACTIVE' || q.status === 'CRITICAL');
  
  const handleStatAlloc = (statName: StatType) => {
    if (profile.availablePoints > 0) {
      audioSynth.playUpgrade();
      onAllocateStat(statName);
    } else {
      audioSynth.playAlert();
    }
  };

  // Get color styles based on hue selection
  const getGlowTextClass = () => {
    if (hueColor === 'hud-green') return 'text-hud-green drop-shadow-[0_0_8px_rgba(57,255,20,0.5)]';
    if (hueColor === 'hud-purple') return 'text-hud-purple drop-shadow-[0_0_8px_rgba(112,0,255,0.5)]';
    if (hueColor === 'hud-amber') return 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]';
    return 'text-hud-blue drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]';
  };

  const getGlowBgClass = () => {
    if (hueColor === 'hud-green') return 'bg-hud-green shadow-[0_0_10px_rgba(57,255,20,0.4)]';
    if (hueColor === 'hud-purple') return 'bg-hud-purple shadow-[0_0_10px_rgba(112,0,255,0.4)]';
    if (hueColor === 'hud-amber') return 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.4)]';
    return 'bg-hud-blue shadow-[0_0_10px_rgba(0,240,255,0.4)]';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full" id="dashboard_view">
      {/* Left Column: Stats and Lore (8/12 width) */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        
        {/* CHARACTER CARD - GLASSMORPHIC */}
        <div 
          className="hud-glass p-6 rounded-xl border border-white/10 relative overflow-hidden transition-all duration-300 hover:border-white/15"
          id="character_card"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-hud-blue/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-wrap justify-between items-center gap-2 mb-4 border-b border-white/5 pb-3">
            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-mono tracking-wider px-2 py-0.5 rounded border border-hud-blue/20 bg-hud-blue/5 text-hud-blue`}>
                RANK: EXPERIENCED
              </span>
              <span className="text-[10px] font-mono text-hud-text-dim">
                SYSTEM_UID: 8842-X
              </span>
            </div>
            <div className="text-right text-[10px] font-mono text-hud-text-dim">
              EXP: {profile.xp} / {profile.nextLevelXp} PTS
            </div>
          </div>

          <div className="mb-6">
            <h1 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight text-white mb-2">
              MyPortfolio <span className={getGlowTextClass()}>• Port</span>
            </h1>
            <p className="text-hud-text-dim text-sm max-w-2xl font-sans leading-relaxed">
              LVL {Math.floor(profile.level / 11)} Experienced UI and UX Designer with a passion for creating immersive digital experiences, Backend Developer.
            </p>
          </div>

          {/* Stats Bar Container */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/5 relative">
            {profile.availablePoints > 0 && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-hud-purple/20 border border-hud-purple/50 px-3 py-0.5 rounded-full text-[10px] font-mono text-hud-purple animate-pulse">
                ALLOCATE +{profile.availablePoints} STAT POINTS
              </div>
            )}
            
            {stats.map((stat) => {
              const percentage = (stat.value / stat.max) * 100;
              return (
                <div key={stat.name} className="flex flex-col group relative">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-[11px] font-mono text-hud-text-dim tracking-wider">{stat.name}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-display font-bold text-white">{stat.value}</span>
                      <span className="text-[9px] font-mono text-hud-text-dim">PTS</span>
                    </div>
                  </div>
                  
                  {/* Progress Line */}
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-2 relative">
                    <div 
                      className={`h-full transition-all duration-500 ease-out ${getGlowBgClass()}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  {/* Level Up Indicator Button */}
                  {profile.availablePoints > 0 ? (
                    <button
                      onClick={() => handleStatAlloc(stat.name)}
                      className="text-[9px] font-mono border border-hud-purple/40 hover:bg-hud-purple/20 text-hud-purple px-1.5 py-0.5 rounded text-center transition-all duration-200 mt-1 cursor-pointer hover:scale-105 active:scale-95"
                      title={stat.description}
                    >
                      ALLOCATE +1
                    </button>
                  ) : (
                    <span className="text-[9px] font-mono text-hud-text-dim line-clamp-1 h-3 group-hover:text-white transition-colors duration-200" title={stat.description}>
                      {stat.description}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CHARACTER LORE */}
        <div 
          className="hud-glass p-6 rounded-xl border border-white/10 flex flex-col gap-5"
          id="character_lore"
        >
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-4 bg-hud-blue rounded-sm" />
              <h2 className="text-lg font-display font-semibold text-white tracking-wide">
                MY_LORE
              </h2>
            </div>
            <span className="text-xs font-mono text-hud-text-dim">RECORD_FILE: 001-ALPHA</span>
          </div>

          <div className="text-hud-text-dim text-sm space-y-4 leading-relaxed font-sans">
            <p>
              Initiated into the digital grid on <span className="text-white font-mono">2021-08-19</span> within the sprawling techno-industrial hub of Solo, <span className="text-white font-semibold tracking-wide">Samuel Latuihamallo</span> rapidly manifested a profound affinity for complex code architecture. What began as an innate curiosity quickly evolved into a masterful understanding of both elegant frontend interfaces and robust backend logic.
            </p>
          </div>

          {/* Generated Widescreen Character Image */}
          <div className="w-full overflow-hidden rounded-lg border border-white/10 relative group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 opacity-70 group-hover:opacity-40 transition-opacity duration-300" />
            <img 
              src="/src/assets/images/cyberpunk_lore_dashboard_1784373351126.jpg" 
              alt="Kinetic Dashboard Cyber Console" 
              className="w-full h-auto aspect-[16/9] object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.src = "https://picsum.photos/seed/cyberpunk/800/450";
              }}
            />
            {/* Holographic scanning overlay */}
            <div className="absolute inset-0 hud-scanlines pointer-events-none opacity-20" />
            <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-hud-green animate-ping" />
              <span className="text-[10px] font-mono text-hud-green tracking-widest bg-black/60 px-2 py-0.5 rounded border border-hud-green/30">
                ACTIVE SCANNING
              </span>
            </div>
          </div>

          {/* DESKRIPSI DI BAWAH GAMBAR YANG SUDAH DIPERBARUI */}
          <div className="text-hud-text-dim text-sm space-y-4 leading-relaxed font-sans">
            <p>
              Specializing in full-stack orchestration, this operative is renowned for deploying high-efficiency management dashboards, securing core architecture through robust authentication networks, and designing responsive, multi-themed data interfaces. From automated utility scripting to fine-tuning database schemas, every routine is compiled to achieve absolute operational synergy and seamless user engagement.
            </p>
          </div>

          {/* Footer Cards - Allegiance & Objective */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div className="hud-glass p-4 rounded-lg border border-white/5 bg-white/[0.02] flex items-center justify-between group hover:bg-white/[0.04] transition-all">
              <div className="flex flex-col">
                <span className="text-[9px] font-mono text-hud-text-dim tracking-widest">KEY ALLEGIANCE</span>
                <span className="text-sm font-display font-bold text-white mt-1">{profile.allegiance}</span>
              </div>
              <Shield className="w-8 h-8 text-hud-blue/50 group-hover:text-hud-blue transition-colors duration-300" />
            </div>

            <div className="hud-glass p-4 rounded-lg border border-white/5 bg-white/[0.02] flex items-center justify-between group hover:bg-white/[0.04] transition-all">
              <div className="flex flex-col">
                <span className="text-[9px] font-mono text-hud-text-dim tracking-widest">CURRENT OBJECTIVE</span>
                <span className="text-sm font-display font-bold text-white mt-1">{profile.objective}</span>
              </div>
              <Rocket className="w-8 h-8 text-hud-green/50 group-hover:text-hud-green transition-colors duration-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Contact Button, Active Quests and Skill Metrics (4/12 width) */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        
        {/* INITIATE CONTACT BUTTON */}
        <button
          onClick={() => {
            audioSynth.playSuccess();
            onSetTab('LOGS');
          }}
          className="w-full py-4 px-6 bg-hud-blue hover:bg-hud-blue/90 text-black font-display font-extrabold text-sm tracking-widest rounded-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_0_20px_rgba(0,240,255,0.35)] hover:shadow-[0_0_30px_rgba(0,240,255,0.55)] cursor-pointer group hover:scale-[1.01] active:scale-[0.99] hud-clip-br"
          id="initiate_contact_btn"
        >
          INITIATE CONTACT
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </button>

        {/* ACTIVE_QUESTS LIST */}
        <div 
          className="hud-glass p-5 rounded-xl border border-white/10 flex flex-col gap-4"
          id="active_quests_card"
        >
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-hud-blue" />
              <h3 className="text-xs font-mono font-bold tracking-widest text-white uppercase">
                ACTIVE_QUESTS
              </h3>
            </div>
            <span className="text-[9px] font-mono text-hud-blue bg-hud-blue/10 px-2 py-0.5 rounded border border-hud-blue/20">
              {activeQuests.length}_ACTIVE
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {activeQuests.map((quest) => (
              <div 
                key={quest.id}
                onClick={() => {
                  audioSynth.playClick();
                  onSetTab('QUESTS');
                }}
                className={`p-4 rounded-lg border ${quest.status === 'CRITICAL' ? 'border-red-500/30 hover:border-red-500/50 bg-red-500/[0.02]' : 'border-white/5 hover:border-white/15 bg-white/[0.01]'} hover:bg-white/[0.03] transition-all cursor-pointer relative group`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] font-mono text-hud-text-dim">
                    LVL {quest.level} // {quest.category}
                  </span>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    quest.status === 'CRITICAL' 
                      ? 'text-red-400 bg-red-950/40 border border-red-500/30 animate-pulse' 
                      : 'text-hud-blue bg-hud-blue/10 border border-hud-blue/20'
                  }`}>
                    {quest.status}
                  </span>
                </div>
                
                <h4 className="text-sm font-display font-bold text-white group-hover:text-hud-blue transition-colors duration-200">
                  {quest.title}
                </h4>

                {quest.tags && quest.tags.length > 0 && (
                  <div className="flex gap-1.5 mt-2.5">
                    {quest.tags.map((tag) => (
                      <span key={tag} className="text-[8px] font-mono bg-white/5 border border-white/10 px-1.5 py-0.5 text-hud-text-dim rounded uppercase">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* SKILL METRICS */}
        <div 
          className="hud-glass p-5 rounded-xl border border-white/10 flex flex-col gap-4"
          id="skill_metrics_card"
        >
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-hud-green" />
              <h3 className="text-xs font-mono font-bold tracking-widest text-white uppercase">
                SKILL_METRICS
              </h3>
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-1">
            {/* FRONTEND ARCH */}
            <div>
              <div className="flex justify-between text-[10px] font-mono tracking-wider mb-1">
                <span className="text-hud-text-dim">FRONTEND ARCH</span>
                <span className="text-hud-blue font-bold">95%</span>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-2 flex-1 rounded-sm ${
                      i < 9 
                        ? 'bg-hud-blue shadow-[0_0_5px_rgba(0,240,255,0.3)]' 
                        : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* SYSTEMS DESIGN */}
            <div>
              <div className="flex justify-between text-[10px] font-mono tracking-wider mb-1">
                <span className="text-hud-text-dim">SYSTEMS DESIGN</span>
                <span className="text-hud-green font-bold">88%</span>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-2 flex-1 rounded-sm ${
                      i < 8 
                        ? 'bg-hud-green shadow-[0_0_5px_rgba(57,255,20,0.3)]' 
                        : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* MOTION GRAPHICS */}
            <div>
              <div className="flex justify-between text-[10px] font-mono tracking-wider mb-1">
                <span className="text-hud-text-dim">MOTION GRAPHICS</span>
                <span className="text-hud-purple font-bold">72%</span>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-2 flex-1 rounded-sm ${
                      i < 7 
                        ? 'bg-hud-purple shadow-[0_0_5px_rgba(112,0,255,0.3)]' 
                        : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};