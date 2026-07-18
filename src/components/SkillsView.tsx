/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SkillNode } from '../types';
import { BookOpen, Sparkles, ChevronRight, Lock, Unlock, HelpCircle } from 'lucide-react';
import { audioSynth } from '../utils/audio';

interface SkillsViewProps {
  skills: SkillNode[];
  onUpgradeSkill: (id: string) => void;
  availablePoints: number;
}

export const SkillsView: React.FC<SkillsViewProps> = ({
  skills,
  onUpgradeSkill,
  availablePoints,
}) => {
  const [selectedSkillId, setSelectedSkillId] = useState<string>(skills[0]?.id || '');
  const selectedSkill = skills.find((s) => s.id === selectedSkillId);

  const handleSelectSkill = (id: string) => {
    audioSynth.playClick();
    setSelectedSkillId(id);
  };

  const handleUpgrade = (id: string) => {
    const node = skills.find((s) => s.id === id);
    if (!node) return;

    if (availablePoints > 0 && node.level < node.maxLevel) {
      audioSynth.playUpgrade();
      onUpgradeSkill(id);
    } else {
      audioSynth.playAlert();
    }
  };

  // Group skills by category
  const categories = {
    FRONTEND: skills.filter((s) => s.category === 'FRONTEND'),
    SYSTEMS: skills.filter((s) => s.category === 'SYSTEMS'),
    MOTION_GRAPHICS: skills.filter((s) => s.category === 'MOTION_GRAPHICS'),
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full" id="skills_view">
      
      {/* Left Column: Skill Tree Visual Layout (8/12 width) */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        
        {/* HUD Stats overview card */}
        <div className="hud-glass p-5 rounded-xl border border-white/10 flex justify-between items-center relative overflow-hidden">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-hud-green" />
            <div>
              <h2 className="text-md font-display font-bold text-white uppercase tracking-wide">
                COGNITIVE_SKILL_TREE
              </h2>
              <p className="text-[10px] font-mono text-hud-text-dim">ALLOCATE EARNED XP METRICS TO SYNAPSE MODULES</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-hud-green/10 border border-hud-green/30 px-4 py-2 rounded-lg animate-pulse">
            <Sparkles className="w-4 h-4 text-hud-green" />
            <div className="flex flex-col text-right">
              <span className="text-[9px] font-mono text-hud-green">AVAILABLE_POINTS</span>
              <span className="text-md font-display font-extrabold text-white">{availablePoints} PTS</span>
            </div>
          </div>
        </div>

        {/* Skill Category Node Grids */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* FRONTEND ARCH */}
          <div className="hud-glass p-4 rounded-xl border border-white/10 flex flex-col gap-4">
            <div className="border-b border-white/5 pb-2">
              <h3 className="text-xs font-mono font-bold tracking-wider text-hud-blue uppercase">
                // FRONTEND_ARCH
              </h3>
            </div>

            <div className="flex flex-col gap-3">
              {categories.FRONTEND.map((node) => {
                const isSelected = node.id === selectedSkillId;
                const isMax = node.level === node.maxLevel;
                return (
                  <div
                    key={node.id}
                    onClick={() => handleSelectSkill(node.id)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer relative group ${
                      isSelected
                        ? 'border-hud-blue/50 bg-hud-blue/[0.02]'
                        : 'border-white/5 hover:border-white/15 bg-white/[0.01]'
                    }`}
                  >
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-xs font-display font-bold text-white group-hover:text-hud-blue transition-colors">
                        {node.name.split(' (')[0]}
                      </span>
                      <span className="text-[10px] font-mono text-hud-text-dim">
                        {node.level}/{node.maxLevel}
                      </span>
                    </div>

                    {/* Progress Segment */}
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          isMax ? 'bg-hud-green' : 'bg-hud-blue'
                        }`}
                        style={{ width: `${(node.level / node.maxLevel) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SYSTEMS DESIGN */}
          <div className="hud-glass p-4 rounded-xl border border-white/10 flex flex-col gap-4">
            <div className="border-b border-white/5 pb-2">
              <h3 className="text-xs font-mono font-bold tracking-wider text-hud-green uppercase">
                // SYSTEMS_DESIGN
              </h3>
            </div>

            <div className="flex flex-col gap-3">
              {categories.SYSTEMS.map((node) => {
                const isSelected = node.id === selectedSkillId;
                const isMax = node.level === node.maxLevel;
                return (
                  <div
                    key={node.id}
                    onClick={() => handleSelectSkill(node.id)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer relative group ${
                      isSelected
                        ? 'border-hud-green/50 bg-hud-green/[0.02]'
                        : 'border-white/5 hover:border-white/15 bg-white/[0.01]'
                    }`}
                  >
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-xs font-display font-bold text-white group-hover:text-hud-green transition-colors">
                        {node.name.split(' (')[0]}
                      </span>
                      <span className="text-[10px] font-mono text-hud-text-dim">
                        {node.level}/{node.maxLevel}
                      </span>
                    </div>

                    {/* Progress Segment */}
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          isMax ? 'bg-hud-green' : 'bg-hud-green'
                        }`}
                        style={{ width: `${(node.level / node.maxLevel) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MOTION GRAPHICS */}
          <div className="hud-glass p-4 rounded-xl border border-white/10 flex flex-col gap-4">
            <div className="border-b border-white/5 pb-2">
              <h3 className="text-xs font-mono font-bold tracking-wider text-hud-purple uppercase">
                // MOTION_GRAPHICS
              </h3>
            </div>

            <div className="flex flex-col gap-3">
              {categories.MOTION_GRAPHICS.map((node) => {
                const isSelected = node.id === selectedSkillId;
                const isMax = node.level === node.maxLevel;
                return (
                  <div
                    key={node.id}
                    onClick={() => handleSelectSkill(node.id)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer relative group ${
                      isSelected
                        ? 'border-hud-purple/50 bg-hud-purple/[0.02]'
                        : 'border-white/5 hover:border-white/15 bg-white/[0.01]'
                    }`}
                  >
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-xs font-display font-bold text-white group-hover:text-hud-purple transition-colors">
                        {node.name.split(' (')[0]}
                      </span>
                      <span className="text-[10px] font-mono text-hud-text-dim">
                        {node.level}/{node.maxLevel}
                      </span>
                    </div>

                    {/* Progress Segment */}
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          isMax ? 'bg-hud-green' : 'bg-hud-purple'
                        }`}
                        style={{ width: `${(node.level / node.maxLevel) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* SVG Node Connections background representation */}
        <div className="hud-glass p-5 rounded-xl border border-white/5 bg-white/[0.01] text-xs leading-relaxed text-hud-text-dim">
          <div className="flex gap-2 items-center text-white font-mono font-bold mb-1 uppercase text-[11px]">
            <Unlock className="w-3.5 h-3.5 text-hud-blue" />
            SYNAPTIC CORE MATRIX PATHS
          </div>
          Every point invested increases cognitive efficiency. Gaining higher levels releases structural point pools, bypassing previous threshold gates to allow complex WebGL rendering, and full-stack Express socket pipeline allocations.
        </div>
      </div>

      {/* Right Column: Node Details & Point Allocation (4/12 width) */}
      <div className="lg:col-span-4">
        {selectedSkill ? (
          <div className="hud-glass p-6 rounded-xl border border-white/10 flex flex-col gap-5 h-full relative overflow-hidden">
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-hud-green/5 rounded-full blur-2xl pointer-events-none" />

            <div className="border-b border-white/5 pb-3">
              <span className="text-[9px] font-mono text-hud-text-dim uppercase tracking-widest">
                SYNAPSE_ID: NODE_{selectedSkill.id.toUpperCase()}
              </span>
              <h3 className="text-xl font-display font-extrabold text-white mt-1 leading-tight">
                {selectedSkill.name}
              </h3>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[9px] font-mono text-hud-green font-bold tracking-widest">
                COGNITIVE_MODULE_DESCRIPTION:
              </span>
              <p className="text-hud-text-dim text-xs leading-relaxed">
                {selectedSkill.description}
              </p>
            </div>

            {/* Level status breakdown */}
            <div className="bg-black/30 p-4 rounded-lg border border-white/5 flex flex-col gap-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-hud-text-dim">UPGRADE COOLDOWN</span>
                <span className="text-white">INSTANT</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-hud-text-dim">CURRENT INTENSITY</span>
                <span className="text-white font-bold">{selectedSkill.level * 20}% LEVEL</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-hud-text-dim">GATE STATUS</span>
                <span className="text-hud-green font-bold flex items-center gap-1">
                  <Unlock className="w-3 h-3" /> UNLOCKED
                </span>
              </div>
            </div>

            {/* Point Allocation Trigger */}
            <div className="mt-auto pt-6 border-t border-white/5">
              {selectedSkill.level >= selectedSkill.maxLevel ? (
                <div className="w-full py-3 bg-hud-green/10 border border-hud-green/30 text-hud-green font-mono text-center text-xs tracking-widest rounded-lg flex items-center justify-center gap-1.5 uppercase">
                  <Sparkles className="w-4 h-4" />
                  MAX NODE CAPACTIY REACHED
                </div>
              ) : (
                <button
                  onClick={() => handleUpgrade(selectedSkill.id)}
                  disabled={availablePoints === 0}
                  className={`w-full py-3.5 font-display font-extrabold text-xs tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all ${
                    availablePoints > 0
                      ? 'bg-hud-green hover:bg-hud-green/90 text-black shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:shadow-[0_0_25px_rgba(57,255,20,0.45)] cursor-pointer'
                      : 'bg-white/5 border border-white/10 text-hud-text-dim cursor-not-allowed'
                  } uppercase hud-clip-br`}
                >
                  <Unlock className="w-4 h-4" />
                  ALLOCATE_POINT // UPGRADE
                </button>
              )}
              {availablePoints === 0 && selectedSkill.level < selectedSkill.maxLevel && (
                <p className="text-[10px] font-mono text-center text-hud-purple mt-2 animate-pulse uppercase">
                  Complete active quests or level up to gather skill points!
                </p>
              )}
            </div>

          </div>
        ) : (
          <div className="hud-glass p-12 rounded-xl border border-white/10 text-center text-hud-text-dim text-sm h-full flex flex-col justify-center items-center">
            Select a synapse module node to allocate cognitive points.
          </div>
        )}
      </div>

    </div>
  );
};
