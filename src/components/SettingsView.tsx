/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CharacterProfile } from '../types';
import { Settings, Volume2, VolumeX, Eye, EyeOff, Radio, RefreshCw, Cpu } from 'lucide-react';
import { audioSynth } from '../utils/audio';

interface SettingsViewProps {
  profile: CharacterProfile;
  onUpdateProfile: (updates: Partial<CharacterProfile>) => void;
  soundEnabled: boolean;
  onToggleSound: (enabled: boolean) => void;
  scanlinesEnabled: boolean;
  onToggleScanlines: (enabled: boolean) => void;
  humEnabled: boolean;
  onToggleHum: (enabled: boolean) => void;
  hueColor: string;
  onSetHueColor: (color: string) => void;
  onResetDatabase: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  onUpdateProfile,
  soundEnabled,
  onToggleSound,
  scanlinesEnabled,
  onToggleScanlines,
  humEnabled,
  onToggleHum,
  hueColor,
  onSetHueColor,
  onResetDatabase,
}) => {
  const [tempName, setTempName] = useState(profile.name);
  const [tempTitle, setTempTitle] = useState(profile.title);
  const [tempObjective, setTempObjective] = useState(profile.objective);

  const handleApplyProfile = (e: React.FormEvent) => {
    e.preventDefault();
    audioSynth.playSuccess();
    onUpdateProfile({
      name: tempName.trim().toUpperCase() || 'SAMUEL L',
      title: tempTitle.trim().toUpperCase() || ' • Port',
      objective: tempObjective.trim().toUpperCase() || 'SYSTEM OVERHAUL V2.0',
    });
  };

  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    audioSynth.setSoundEnabled(nextState);
    onToggleSound(nextState);
    if (nextState) {
      audioSynth.playClick();
    }
  };

  const handleToggleHum = () => {
    if (!soundEnabled) {
      audioSynth.playAlert();
      return;
    }
    const nextState = !humEnabled;
    onToggleHum(nextState);
    if (nextState) {
      audioSynth.startAmbientHum();
    } else {
      audioSynth.stopAmbientHum();
    }
  };

  const handleHueSelect = (color: string) => {
    audioSynth.playClick();
    onSetHueColor(color);
  };

  const handleReset = () => {
    if (window.confirm('WARNING: Resetting database will purge custom quests, attributes and logged messages. Confirm?')) {
      audioSynth.playAlert();
      onResetDatabase();
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full" id="settings_view">
      
      {/* Left Column: Profile Config (7/12 width) */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        
        {/* Core details editor */}
        <div className="hud-glass p-6 rounded-xl border border-white/10 flex flex-col gap-5 relative overflow-hidden">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <Settings className="w-5 h-5 text-hud-blue" />
            <h3 className="text-xs font-mono font-bold tracking-widest text-white uppercase">
              OPERATOR_IDENTITY_PRESETS
            </h3>
          </div>

          <form onSubmit={handleApplyProfile} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-hud-blue font-bold tracking-widest">
                  OPERATOR_TAGNAME
                </label>
                <input
                  type="text"
                  required
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="e.g. SAMUEL L"
                  className="bg-black/30 border border-white/10 focus:border-hud-blue rounded-lg px-3.5 py-2.5 text-xs text-white outline-none font-mono tracking-wider uppercase"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-hud-blue font-bold tracking-widest">
                  CLASSIFIED_TITLE
                </label>
                <input
                  type="text"
                  required
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  placeholder="e.g. KINETIC_ARCHITECT"
                  className="bg-black/30 border border-white/10 focus:border-hud-blue rounded-lg px-3.5 py-2.5 text-xs text-white outline-none font-mono tracking-wider uppercase"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono text-hud-blue font-bold tracking-widest">
                DIRECTIVE_OBJECTIVE
              </label>
              <input
                type="text"
                required
                value={tempObjective}
                onChange={(e) => setTempObjective(e.target.value)}
                placeholder="e.g. SYSTEM OVERHAUL V2.0"
                className="bg-black/30 border border-white/10 focus:border-hud-blue rounded-lg px-3.5 py-2.5 text-xs text-white outline-none font-mono tracking-wider uppercase"
              />
            </div>

            <div className="flex justify-end mt-2">
              <button
                type="submit"
                className="py-2.5 px-6 bg-hud-blue hover:bg-hud-blue/90 text-black font-display font-extrabold text-xs tracking-widest rounded-lg flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.2)] hud-clip-br"
              >
                <Cpu className="w-3.5 h-3.5" />
                COMMIT_IDENTITY_SYMBOLS
              </button>
            </div>
          </form>
        </div>

        {/* HUD Color Accents */}
        <div className="hud-glass p-6 rounded-xl border border-white/10 flex flex-col gap-4">
          <div className="border-b border-white/5 pb-2">
            <h3 className="text-xs font-mono font-bold tracking-widest text-white uppercase">
              HUD_TINT_THEME
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Mana Blue */}
            <button
              onClick={() => handleHueSelect('hud-blue')}
              className={`p-3 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                hueColor === 'hud-blue'
                  ? 'border-hud-blue bg-hud-blue/10 text-hud-blue shadow-[0_0_10px_rgba(0,240,255,0.25)]'
                  : 'border-white/5 hover:border-white/10 bg-white/[0.01]'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-hud-blue" />
              <span className="text-[10px] font-mono tracking-wider">MANA_BLUE</span>
            </button>

            {/* XP Green */}
            <button
              onClick={() => handleHueSelect('hud-green')}
              className={`p-3 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                hueColor === 'hud-green'
                  ? 'border-hud-green bg-hud-green/10 text-hud-green shadow-[0_0_10px_rgba(57,255,20,0.25)]'
                  : 'border-white/5 hover:border-white/10 bg-white/[0.01]'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-hud-green" />
              <span className="text-[10px] font-mono tracking-wider">XP_GREEN</span>
            </button>

            {/* Quantum Purple */}
            <button
              onClick={() => handleHueSelect('hud-purple')}
              className={`p-3 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                hueColor === 'hud-purple'
                  ? 'border-hud-purple bg-hud-purple/10 text-hud-purple shadow-[0_0_10px_rgba(112,0,255,0.25)]'
                  : 'border-white/5 hover:border-white/10 bg-white/[0.01]'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-hud-purple" />
              <span className="text-[10px] font-mono tracking-wider">QUANT_PURPLE</span>
            </button>

            {/* Amber Gold */}
            <button
              onClick={() => handleHueSelect('hud-amber')}
              className={`p-3 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                hueColor === 'hud-amber'
                  ? 'border-amber-400 bg-amber-400/10 text-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.25)]'
                  : 'border-white/5 hover:border-white/10 bg-white/[0.01]'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-amber-400" />
              <span className="text-[10px] font-mono tracking-wider">AMBER_GOLD</span>
            </button>
          </div>
        </div>

      </div>

      {/* Right Column: Audio & Screen Options (5/12 width) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        
        {/* Environmental Audio cockpit */}
        <div className="hud-glass p-6 rounded-xl border border-white/10 flex flex-col gap-5">
          <div className="border-b border-white/5 pb-2 flex justify-between items-center">
            <h3 className="text-xs font-mono font-bold tracking-widest text-white uppercase">
              ATMOSPHERIC_AUDIO
            </h3>
            <span className="text-[8px] font-mono text-hud-text-dim">WEB_AUDIO_CORE_V2.0</span>
          </div>

          <div className="flex flex-col gap-4">
            {/* Master sounds */}
            <div className="flex justify-between items-center p-3 bg-white/[0.01] border border-white/5 rounded-lg">
              <div className="flex flex-col">
                <span className="text-xs font-display font-bold text-white uppercase">SYNAPSE AUDIO FX</span>
                <span className="text-[9px] font-mono text-hud-text-dim mt-0.5">Tactile keyboard clicks & upgrade synthesizers</span>
              </div>
              <button
                onClick={handleToggleSound}
                className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                  soundEnabled
                    ? 'border-hud-blue text-hud-blue bg-hud-blue/5'
                    : 'border-white/10 text-hud-text-dim bg-white/5'
                }`}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>

            {/* Vessel rumbling hum */}
            <div className={`flex justify-between items-center p-3 bg-white/[0.01] border border-white/5 rounded-lg ${!soundEnabled ? 'opacity-40' : ''}`}>
              <div className="flex flex-col">
                <span className="text-xs font-display font-bold text-white uppercase">REACTOR_AMBIENT_HUM</span>
                <span className="text-[9px] font-mono text-hud-text-dim mt-0.5">Low-frequency structural background resonance generator</span>
              </div>
              <button
                onClick={handleToggleHum}
                disabled={!soundEnabled}
                className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                  humEnabled
                    ? 'border-hud-green text-hud-green bg-hud-green/5'
                    : 'border-white/10 text-hud-text-dim bg-white/5'
                }`}
              >
                <Radio className={`w-4 h-4 ${humEnabled ? 'animate-pulse' : ''}`} />
              </button>
            </div>
          </div>

          {/* Hum Live visualizer block */}
          {humEnabled && soundEnabled && (
            <div className="flex items-center justify-between gap-1 h-8 bg-black/40 rounded border border-hud-green/20 p-2.5">
              <span className="text-[9px] font-mono text-hud-green">REACTOR WAVEFORM:</span>
              <div className="flex items-end gap-0.5 h-full">
                {Array.from({ length: 18 }).map((_, i) => {
                  const animDuration = 0.5 + Math.random() * 0.8;
                  const animDelay = Math.random() * 0.4;
                  return (
                    <div
                      key={i}
                      className="w-1 bg-hud-green/80 rounded-t-sm"
                      style={{
                        height: `${20 + Math.random() * 80}%`,
                        animation: `scan ${animDuration}s ease-in-out ${animDelay}s infinite alternate`
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Visual elements configuration */}
        <div className="hud-glass p-6 rounded-xl border border-white/10 flex flex-col gap-5">
          <div className="border-b border-white/5 pb-2">
            <h3 className="text-xs font-mono font-bold tracking-widest text-white uppercase">
              SCANNER_GRID_OPTIONS
            </h3>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center p-3 bg-white/[0.01] border border-white/5 rounded-lg">
              <div className="flex flex-col">
                <span className="text-xs font-display font-bold text-white uppercase">INTERFERENCE SCANLINES</span>
                <span className="text-[9px] font-mono text-hud-text-dim mt-0.5">Simulate analogue CRT cathode scanning streams</span>
              </div>
              <button
                onClick={() => {
                  audioSynth.playClick();
                  onToggleScanlines(!scanlinesEnabled);
                }}
                className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                  scanlinesEnabled
                    ? 'border-hud-blue text-hud-blue bg-hud-blue/5'
                    : 'border-white/10 text-hud-text-dim bg-white/5'
                }`}
              >
                {scanlinesEnabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Purge Database / Disaster block */}
        <div className="hud-glass p-6 rounded-xl border border-red-500/10 flex flex-col gap-4 bg-red-950/5">
          <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest">
            // CRITICAL_RECOVERY_SECTOR
          </span>
          <p className="text-[10px] font-mono text-hud-text-dim leading-relaxed">
            Purging terminal state clears structural attributes point pools, deleted customized quests and archived secure transmissions. This process is irreversible.
          </p>
          <button
            onClick={handleReset}
            className="w-full py-2.5 bg-red-950/40 border border-red-500/30 hover:bg-red-500 hover:text-black hover:border-transparent text-red-400 font-mono text-xs tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            FACTORY_PURGE_DB
          </button>
        </div>

      </div>

    </div>
  );
};
