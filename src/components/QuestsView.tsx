/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Quest, QuestStatus } from '../types';
import { Target, CheckCircle2, Circle, Trophy, Terminal, Code2, PlusCircle, Trash2, X } from 'lucide-react';
import { audioSynth } from '../utils/audio';

interface QuestsViewProps {
  quests: Quest[];
  onCompleteQuest: (id: string, xpReward: number, skillReward?: string) => void;
  onAddQuest: (quest: Quest) => void;
  onDeleteQuest: (id: string) => void;
  profileLevel: number;
}

export const QuestsView: React.FC<QuestsViewProps> = ({
  quests,
  onCompleteQuest,
  onAddQuest,
  onDeleteQuest,
  profileLevel,
}) => {
  const [selectedQuestId, setSelectedQuestId] = useState<string>(quests[0]?.id || '');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  
  // Custom Quest Modal / Form State
  const [isAddingQuest, setIsAddingQuest] = useState(false);
  const [newQuestTitle, setNewQuestTitle] = useState('');
  const [newQuestCategory, setNewQuestCategory] = useState<'INTERFACE' | 'BACKEND' | 'ARCH' | 'DATA'>('INTERFACE');
  const [newQuestLevel, setNewQuestLevel] = useState(30);
  const [newQuestDesc, setNewQuestDesc] = useState('');
  const [newQuestTags, setNewQuestTags] = useState('');
  const [newQuestRequirements, setNewQuestRequirements] = useState('');

  // Hacking / Executing code simulation state for selected quest
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [checkedRequirements, setCheckedRequirements] = useState<Record<string, boolean>>({});

  const selectedQuest = quests.find((q) => q.id === selectedQuestId);

  const handleQuestSelect = (id: string) => {
    audioSynth.playClick();
    setSelectedQuestId(id);
    setIsExecuting(false);
    setExecutionLogs([]);
    setCheckedRequirements({});
  };

  const toggleRequirement = (reqIndex: number) => {
    audioSynth.playClick();
    const key = `${selectedQuestId}-${reqIndex}`;
    setCheckedRequirements(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleExecuteQuest = async () => {
    if (!selectedQuest || selectedQuest.status === 'COMPLETED' || isExecuting) return;
    
    audioSynth.playClick();
    setIsExecuting(true);
    setExecutionLogs([]);

    const logs = [
      `UPLINK_ESTABLISHED // TARGET: QUEST_${selectedQuest.id.toUpperCase()}`,
      `LOADING CRITICAL PARAMETERS // LEVEL ${selectedQuest.level}`,
      `VALIDATING CODE ARCHITECTURES...`,
      `PARSING SYMBOLS AND TYPE BOUNDARIES...`,
      `COMMITTING SEGMENTED TRANSACTIONS TO DATABASE...`,
      `RUNNING UNIT TESTS ON RECONSTRUCTION PHASES...`,
      `PASS [12/12] INTEGRITY CHECKS GREEN`,
      `UPLINK COMMITTED // HARVESTING REWARDS...`
    ];

    for (let i = 0; i < logs.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      setExecutionLogs((prev) => [...prev, logs[i]]);
      if (i % 2 === 0) {
        audioSynth.playClick();
      }
    }

    setTimeout(() => {
      audioSynth.playSuccess();
      onCompleteQuest(selectedQuest.id, selectedQuest.rewardXP, selectedQuest.rewardSkill);
      setIsExecuting(false);
    }, 400);
  };

  const handleAddQuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestTitle.trim() || !newQuestDesc.trim()) {
      audioSynth.playAlert();
      return;
    }

    const requirementsArray = newQuestRequirements
      .split('\n')
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    const tagsArray = newQuestTags
      .split(',')
      .map((t) => t.trim().toUpperCase())
      .filter((t) => t.length > 0);

    const newQuest: Quest = {
      id: `q-${Date.now()}`,
      title: newQuestTitle,
      level: Number(newQuestLevel),
      category: newQuestCategory,
      status: 'ACTIVE',
      tags: tagsArray.length > 0 ? tagsArray : [newQuestCategory],
      description: newQuestDesc,
      requirements: requirementsArray.length > 0 ? requirementsArray : ['Execute flawless developer deployment'],
      rewardXP: Number(newQuestLevel) * 100,
    };

    audioSynth.playSuccess();
    onAddQuest(newQuest);
    setSelectedQuestId(newQuest.id);
    setIsAddingQuest(false);

    // Reset Form
    setNewQuestTitle('');
    setNewQuestCategory('INTERFACE');
    setNewQuestLevel(30);
    setNewQuestDesc('');
    setNewQuestTags('');
    setNewQuestRequirements('');
  };

  const handleDeleteQuest = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    audioSynth.playAlert();
    onDeleteQuest(id);
    if (selectedQuestId === id) {
      const remaining = quests.filter(q => q.id !== id);
      if (remaining.length > 0) {
        setSelectedQuestId(remaining[0].id);
      }
    }
  };

  const categories = ['ALL', 'INTERFACE', 'BACKEND', 'ARCH', 'DATA'];

  const filteredQuests = quests.filter((q) => {
    if (activeCategory === 'ALL') return true;
    return q.category === activeCategory;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full" id="quests_view">
      
      {/* Left Column: Quest Listing (5/12 width) */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-hud-blue" />
            <h2 className="text-xl font-display font-bold text-white tracking-wide">
              QUESTS_LOG
            </h2>
          </div>
          <button
            onClick={() => {
              audioSynth.playClick();
              setIsAddingQuest(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-hud-blue/15 hover:bg-hud-blue/25 border border-hud-blue/30 hover:border-hud-blue/50 text-hud-blue font-mono text-[11px] tracking-wider rounded-lg transition-all cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            ADD_QUEST
          </button>
        </div>

        {/* Filter Category Tabs */}
        <div className="flex flex-wrap gap-1.5 bg-white/[0.02] border border-white/5 p-1 rounded-lg">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                audioSynth.playClick();
                setActiveCategory(cat);
              }}
              className={`flex-1 min-w-[60px] text-center py-1.5 text-[10px] font-mono tracking-widest rounded-md uppercase transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-hud-blue text-black font-extrabold shadow-[0_0_8px_rgba(0,240,255,0.25)]'
                  : 'text-hud-text-dim hover:text-white hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Quests Scroll List */}
        <div className="flex flex-col gap-2.5 max-h-[600px] overflow-y-auto pr-1">
          {filteredQuests.length === 0 ? (
            <div className="text-center py-12 hud-glass rounded-lg text-hud-text-dim text-sm">
              No quests detected in this network node.
            </div>
          ) : (
            filteredQuests.map((quest) => {
              const isSelected = quest.id === selectedQuestId;
              const isCompleted = quest.status === 'COMPLETED';
              const isCritical = quest.status === 'CRITICAL';

              return (
                <div
                  key={quest.id}
                  onClick={() => handleQuestSelect(quest.id)}
                  className={`hud-glass p-4 rounded-xl border transition-all cursor-pointer relative group flex justify-between items-start ${
                    isSelected 
                      ? 'border-hud-blue/40 bg-hud-blue/[0.03] shadow-[0_0_15px_rgba(0,240,255,0.08)]' 
                      : isCritical 
                        ? 'border-red-500/20 hover:border-red-500/40 bg-red-500/[0.01]' 
                        : 'border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="flex flex-col gap-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono text-hud-text-dim uppercase tracking-wider">
                        LVL {quest.level} // {quest.category}
                      </span>
                      {isCompleted && (
                        <span className="w-1.5 h-1.5 rounded-full bg-hud-green" />
                      )}
                    </div>
                    
                    <h3 className={`text-md font-display font-bold transition-all ${
                      isCompleted 
                        ? 'text-hud-text-dim line-through decoration-hud-green/30' 
                        : isSelected 
                          ? 'text-hud-blue' 
                          : 'text-white'
                    }`}>
                      {quest.title}
                    </h3>

                    <div className="flex flex-wrap gap-1 mt-1">
                      {quest.tags.map(tag => (
                        <span key={tag} className="text-[8px] font-mono bg-white/5 border border-white/10 text-hud-text-dim px-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3 self-stretch justify-between pl-2">
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                      isCompleted 
                        ? 'text-hud-green bg-hud-green/10 border border-hud-green/20' 
                        : isCritical 
                          ? 'text-red-400 bg-red-950/40 border border-red-500/30 animate-pulse' 
                          : 'text-hud-blue bg-hud-blue/10 border border-hud-blue/20'
                    }`}>
                      {quest.status}
                    </span>

                    {quest.id.startsWith('q-') && (
                      <button
                        onClick={(e) => handleDeleteQuest(quest.id, e)}
                        className="text-hud-text-dim hover:text-red-400 p-1 rounded hover:bg-white/5 transition-colors cursor-pointer"
                        title="Delete Quest"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Column: Quest View Details (7/12 width) */}
      <div className="lg:col-span-7">
        {selectedQuest ? (
          <div className="hud-glass p-6 rounded-xl border border-white/10 flex flex-col gap-5 h-full relative overflow-hidden">
            
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-hud-blue/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-wrap justify-between items-center gap-2 border-b border-white/5 pb-3">
              <span className="text-[10px] font-mono text-hud-text-dim uppercase tracking-widest">
                SYS_UID: QUEST_{selectedQuest.id.toUpperCase()} // LVL {selectedQuest.level} {selectedQuest.category}
              </span>
              <span className={`text-xs font-mono font-bold uppercase tracking-widest ${
                selectedQuest.status === 'COMPLETED' ? 'text-hud-green' : 'text-hud-blue'
              }`}>
                {selectedQuest.status}
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-display font-extrabold text-white mb-2 leading-tight">
                {selectedQuest.title}
              </h2>
              <p className="text-hud-text-dim text-sm font-sans leading-relaxed">
                {selectedQuest.description}
              </p>
            </div>

            {/* Tasks / Objectives Checklist */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-mono text-hud-blue font-bold tracking-widest">
                UPLINK_OBJECTIVES:
              </span>
              <div className="flex flex-col gap-2">
                {selectedQuest.requirements.map((req, idx) => {
                  const reqKey = `${selectedQuest.id}-${idx}`;
                  const isChecked = checkedRequirements[reqKey] || selectedQuest.status === 'COMPLETED';
                  
                  return (
                    <div 
                      key={idx}
                      onClick={() => {
                        if (selectedQuest.status !== 'COMPLETED') {
                          toggleRequirement(idx);
                        }
                      }}
                      className={`flex items-start gap-3 p-3 rounded-lg border transition-all select-none ${
                        selectedQuest.status === 'COMPLETED'
                          ? 'border-hud-green/10 bg-hud-green/[0.01]'
                          : isChecked
                            ? 'border-hud-blue/20 bg-hud-blue/[0.02] cursor-pointer'
                            : 'border-white/5 hover:border-white/10 hover:bg-white/[0.01] cursor-pointer'
                      }`}
                    >
                      {isChecked ? (
                        <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${
                          selectedQuest.status === 'COMPLETED' ? 'text-hud-green' : 'text-hud-blue'
                        }`} />
                      ) : (
                        <Circle className="w-4 h-4 mt-0.5 shrink-0 text-hud-text-dim group-hover:text-white" />
                      )}
                      <span className={`text-xs font-mono leading-relaxed ${
                        isChecked 
                          ? 'text-hud-text-dim line-through decoration-white/20' 
                          : 'text-white'
                      }`}>
                        {req}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reward Information */}
            <div className="grid grid-cols-2 gap-4 border-t border-b border-white/5 py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-hud-blue/10 rounded-lg border border-hud-blue/20">
                  <Trophy className="w-5 h-5 text-hud-blue" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono text-hud-text-dim">REWARD_XP</span>
                  <span className="text-sm font-display font-bold text-white">+{selectedQuest.rewardXP} XP</span>
                </div>
              </div>

              {selectedQuest.rewardSkill && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-hud-purple/10 rounded-lg border border-hud-purple/20">
                    <Code2 className="w-5 h-5 text-hud-purple" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-mono text-hud-text-dim">REWARD_UNLOCK</span>
                    <span className="text-sm font-display font-bold text-white">{selectedQuest.rewardSkill}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Execution / Code terminal block */}
            {isExecuting && (
              <div className="flex-1 bg-black/80 border border-hud-blue/30 rounded-lg p-4 font-mono text-xs text-hud-blue space-y-1 h-44 overflow-y-auto">
                <div className="flex justify-between items-center text-[10px] text-hud-text-dim border-b border-hud-blue/20 pb-1 mb-2">
                  <div className="flex items-center gap-1.5">
                    <Terminal className="w-3 h-3 text-hud-blue" />
                    <span>SYS_KINETIC_SHELL v2.0</span>
                  </div>
                  <span className="animate-pulse">COMMUNICATION ONLINE</span>
                </div>
                {executionLogs.map((log, idx) => (
                  <div key={idx} className="leading-relaxed">
                    <span className="text-hud-text-dim pr-1.5">&gt;</span> {log}
                  </div>
                ))}
                <div className="w-2 h-4 bg-hud-blue inline-block animate-pulse ml-1" />
              </div>
            )}

            {/* Bottom Execute Button */}
            {!isExecuting && (
              <div className="mt-auto">
                {selectedQuest.status === 'COMPLETED' ? (
                  <div className="w-full py-3.5 bg-hud-green/10 border border-hud-green/30 text-hud-green font-mono text-center text-xs tracking-widest rounded-lg flex items-center justify-center gap-2 uppercase">
                    <CheckCircle2 className="w-4 h-4" />
                    Quest fully cleared and synced with mainframe
                  </div>
                ) : (
                  <button
                    onClick={handleExecuteQuest}
                    className="w-full py-3.5 bg-hud-blue hover:bg-hud-blue/90 text-black font-display font-extrabold text-xs tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] cursor-pointer group uppercase hud-clip-br"
                  >
                    <Code2 className="w-4 h-4 transition-transform group-hover:rotate-12" />
                    EXECUTE_CONTRACT // SYNC QUEST
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="hud-glass p-12 rounded-xl border border-white/10 text-center text-hud-text-dim text-sm h-full flex flex-col justify-center items-center">
            Select a developer quest from the log database.
          </div>
        )}
      </div>

      {/* Add Custom Quest Modal */}
      {isAddingQuest && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="hud-glass rounded-xl border border-white/15 p-6 w-full max-w-xl flex flex-col gap-4 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-hud-blue" />
                INITIATE_CUSTOM_QUEST
              </h3>
              <button
                onClick={() => {
                  audioSynth.playClick();
                  setIsAddingQuest(false);
                }}
                className="text-hud-text-dim hover:text-white p-1 rounded hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddQuestSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono text-hud-blue tracking-wider">QUEST_NAME</label>
                  <input
                    type="text"
                    required
                    value={newQuestTitle}
                    onChange={(e) => setNewQuestTitle(e.target.value)}
                    placeholder="e.g. Implement Docker Configs"
                    className="bg-black/40 border border-white/10 focus:border-hud-blue rounded-lg px-3 py-2 text-xs text-white outline-none font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono text-hud-blue tracking-wider">CATEGORY</label>
                  <select
                    value={newQuestCategory}
                    onChange={(e: any) => setNewQuestCategory(e.target.value)}
                    className="bg-black/40 border border-white/10 focus:border-hud-blue rounded-lg px-3 py-2 text-xs text-white outline-none font-mono"
                  >
                    <option value="INTERFACE">INTERFACE (Frontend)</option>
                    <option value="BACKEND">BACKEND (Servers)</option>
                    <option value="ARCH">ARCH (Database/Devops)</option>
                    <option value="DATA">DATA (AI/Pipelines)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono text-hud-blue tracking-wider">SUGGESTED_LEVEL</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={newQuestLevel}
                    onChange={(e) => setNewQuestLevel(Number(e.target.value))}
                    className="bg-black/40 border border-white/10 focus:border-hud-blue rounded-lg px-3 py-2 text-xs text-white outline-none font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono text-hud-blue tracking-wider">TECH_TAGS (COMMA SEPARATED)</label>
                  <input
                    type="text"
                    value={newQuestTags}
                    onChange={(e) => setNewQuestTags(e.target.value)}
                    placeholder="e.g. DOCKER, K8S, AWS"
                    className="bg-black/40 border border-white/10 focus:border-hud-blue rounded-lg px-3 py-2 text-xs text-white outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono text-hud-blue tracking-wider">QUEST_DESCRIPTION</label>
                <textarea
                  required
                  rows={2}
                  value={newQuestDesc}
                  onChange={(e) => setNewQuestDesc(e.target.value)}
                  placeholder="Outline the scope and stakes of this custom developer mission..."
                  className="bg-black/40 border border-white/10 focus:border-hud-blue rounded-lg px-3 py-2 text-xs text-white outline-none font-sans"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono text-hud-blue tracking-wider">MILESTONES / COMPILATION STEPS (ONE PER LINE)</label>
                <textarea
                  rows={3}
                  value={newQuestRequirements}
                  onChange={(e) => setNewQuestRequirements(e.target.value)}
                  placeholder="e.g. Configure compose files&#10;Verify persistent volume mappings&#10;Deploy cluster node telemetry"
                  className="bg-black/40 border border-white/10 focus:border-hud-blue rounded-lg px-3 py-2 text-xs text-white outline-none font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-hud-blue hover:bg-hud-blue/90 text-black font-display font-extrabold text-xs tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.25)]"
              >
                INITIATE_TACTICAL_CONTRACT
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
