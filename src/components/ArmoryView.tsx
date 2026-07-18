/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArmoryItem, RarityType } from '../types';
import { Shield, Sparkles, AlertCircle, HelpCircle, Swords, Cpu, Share2 } from 'lucide-react';
import { audioSynth } from '../utils/audio';

interface ArmoryViewProps {
  items: ArmoryItem[];
  onToggleEquip: (id: string) => void;
}

export const ArmoryView: React.FC<ArmoryViewProps> = ({
  items,
  onToggleEquip,
}) => {
  const [selectedItemId, setSelectedItemId] = useState<string>(items[0]?.id || '');
  const selectedItem = items.find((item) => item.id === selectedItemId);

  const handleSelectItem = (id: string) => {
    audioSynth.playClick();
    setSelectedItemId(id);
  };

  const handleToggleEquip = (id: string) => {
    audioSynth.playSuccess();
    onToggleEquip(id);
  };

  const getRarityColor = (rarity: RarityType) => {
    switch (rarity) {
      case 'LEGENDARY':
        return 'text-hud-blue border-hud-blue/40 bg-hud-blue/5';
      case 'EPIC':
        return 'text-hud-purple border-hud-purple/40 bg-hud-purple/5';
      case 'RARE':
        return 'text-blue-400 border-blue-400/40 bg-blue-400/5';
      default:
        return 'text-hud-text-dim border-white/10 bg-white/5';
    }
  };

  const getRarityBadge = (rarity: RarityType) => {
    switch (rarity) {
      case 'LEGENDARY':
        return 'bg-hud-blue/20 text-hud-blue border border-hud-blue/30 shadow-[0_0_8px_rgba(0,240,255,0.2)]';
      case 'EPIC':
        return 'bg-hud-purple/20 text-hud-purple border border-hud-purple/30 shadow-[0_0_8px_rgba(112,0,255,0.2)]';
      case 'RARE':
        return 'bg-blue-950/40 text-blue-400 border border-blue-500/30';
      default:
        return 'bg-white/10 text-hud-text-dim border border-white/10';
    }
  };

  const getItemIcon = (category: string) => {
    switch (category) {
      case 'MAIN_WEAPON':
        return <Swords className="w-5 h-5" />;
      case 'EXOSUIT':
        return <Shield className="w-5 h-5" />;
      case 'NEURAL_LINK':
        return <Cpu className="w-5 h-5" />;
      default:
        return <Cpu className="w-5 h-5" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full" id="armory_view">
      
      {/* Left Column: Tech Weapons Grid (7/12 width) */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-2">
            <Swords className="w-5 h-5 text-hud-blue" />
            <h2 className="text-xl font-display font-bold text-white tracking-wide">
              ARMORY_VAULT
            </h2>
          </div>
          <span className="text-[10px] font-mono text-hud-text-dim">EQUIP ARSENAL FOR ADAPTIVE MODIFIERS</span>
        </div>

        {/* Weapons grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((item) => {
            const isSelected = item.id === selectedItemId;
            const isEquipped = item.equipped;
            const rarityStyle = getRarityColor(item.rarity);

            return (
              <div
                key={item.id}
                onClick={() => handleSelectItem(item.id)}
                className={`hud-glass p-4 rounded-xl border transition-all cursor-pointer relative group flex flex-col justify-between min-h-[160px] ${
                  isSelected 
                    ? 'border-hud-blue/50 bg-hud-blue/[0.02] shadow-[0_0_15px_rgba(0,240,255,0.06)]' 
                    : 'border-white/5 hover:border-white/15 hover:bg-white/[0.01]'
                }`}
              >
                {/* Equipped status ribbon */}
                {isEquipped && (
                  <div className="absolute top-3 right-3 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-hud-green animate-ping" />
                    <span className="text-[8px] font-mono text-hud-green bg-hud-green/10 border border-hud-green/30 px-2 py-0.5 rounded tracking-widest uppercase font-bold">
                      EQUIPPED
                    </span>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${rarityStyle}`}>
                    {getItemIcon(item.category)}
                  </div>

                  <div>
                    <span className="text-[8px] font-mono text-hud-text-dim block mb-0.5">
                      {item.category.replace('_', ' ')} // {item.techTag}
                    </span>
                    <h3 className="text-sm font-display font-bold text-white group-hover:text-hud-blue transition-colors">
                      {item.name}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                  <span className={`text-[8px] font-mono px-2 py-0.5 rounded ${getRarityBadge(item.rarity)}`}>
                    {item.rarity}
                  </span>
                  <span className="text-[10px] font-mono text-hud-text-dim group-hover:text-white transition-colors">
                    SPEC_SHEET &gt;
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Gear Blueprint & Modifiers Details (5/12 width) */}
      <div className="lg:col-span-5">
        {selectedItem ? (
          <div className="hud-glass p-6 rounded-xl border border-white/10 flex flex-col gap-5 h-full relative overflow-hidden">
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-hud-purple/5 rounded-full blur-2xl pointer-events-none" />

            <div className="border-b border-white/5 pb-3">
              <span className="text-[9px] font-mono text-hud-text-dim uppercase tracking-widest">
                BLUEPRINT_ID: {selectedItem.id.toUpperCase()} // RARITY: {selectedItem.rarity}
              </span>
              <h3 className="text-xl font-display font-extrabold text-white mt-1 leading-tight flex items-center gap-2">
                {selectedItem.name}
              </h3>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] font-mono text-hud-blue font-bold tracking-widest">
                SPECIFICATION_DETAILS:
              </span>
              <p className="text-hud-text-dim text-xs leading-relaxed">
                {selectedItem.description}
              </p>
            </div>

            {/* Gear attribute modification list */}
            <div className="flex flex-col gap-2">
              <span className="text-[9px] font-mono text-hud-purple font-bold tracking-widest">
                ACTIVE_TUNNEL_MODIFIERS:
              </span>
              <div className="flex flex-col gap-1.5">
                {selectedItem.stats.map((stat, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2.5 bg-white/[0.01] border border-white/5 rounded-md">
                    <span className="text-[10px] font-mono text-hud-text-dim tracking-wide">{stat.label}</span>
                    <span className="text-xs font-mono font-bold text-hud-green">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-hud-purple/5 border border-hud-purple/20 p-3 rounded-lg flex items-start gap-2.5 mt-2">
              <Cpu className="w-4 h-4 text-hud-purple shrink-0 mt-0.5" />
              <p className="text-[10px] font-mono text-hud-text-dim leading-relaxed">
                Equipping this module overrides structural environment variables, mapping cognitive metrics onto compiler nodes instantly.
              </p>
            </div>

            {/* Toggle Equip Button */}
            <div className="mt-auto pt-6 border-t border-white/5">
              <button
                onClick={() => handleToggleEquip(selectedItem.id)}
                className={`w-full py-3.5 font-display font-extrabold text-xs tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] ${
                  selectedItem.equipped
                    ? 'bg-red-950/40 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-black hover:border-transparent hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                    : 'bg-hud-blue hover:bg-hud-blue/90 text-black'
                } uppercase hud-clip-br`}
              >
                {selectedItem.equipped ? (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    DISENGAGE // UNEQUIP
                  </>
                ) : (
                  <>
                    <Cpu className="w-4 h-4" />
                    ENGAGE // EQUIP MODULE
                  </>
                )}
              </button>
            </div>

          </div>
        ) : (
          <div className="hud-glass p-12 rounded-xl border border-white/10 text-center text-hud-text-dim text-sm h-full flex flex-col justify-center items-center">
            Select a developer module node from the armory vault to engage.
          </div>
        )}
      </div>

    </div>
  );
};
