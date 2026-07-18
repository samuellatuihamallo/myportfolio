/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  CharacterProfile, 
  AttributeStat, 
  Quest, 
  SkillNode, 
  ArmoryItem, 
  UplinkMessage,
  StatType 
} from './types';
import { 
  INITIAL_PROFILE, 
  INITIAL_STATS, 
  INITIAL_QUESTS, 
  INITIAL_SKILLS, 
  INITIAL_ARMORY, 
  INITIAL_UPLINKS 
} from './utils/data';
import { audioSynth } from './utils/audio';

import { DashboardView } from './components/DashboardView';
import { QuestsView } from './components/QuestsView';
import { SkillsView } from './components/SkillsView';
import { ArmoryView } from './components/ArmoryView';
import { LogsView } from './components/LogsView';
import { SettingsView } from './components/SettingsView';

import { 
  LayoutDashboard, 
  Target, 
  BookOpen, 
  Swords, 
  Terminal, 
  Settings, 
  Radio,
  Cpu,
  Power,
  Zap,
  HardDrive
} from 'lucide-react';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<string>('DASHBOARD');

  // Persistence State Hydration
  const [profile, setProfile] = useState<CharacterProfile>(() => {
    const saved = localStorage.getItem('hud_profile');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  const [stats, setStats] = useState<AttributeStat[]>(() => {
    const saved = localStorage.getItem('hud_stats');
    return saved ? JSON.parse(saved) : INITIAL_STATS;
  });

  const [quests, setQuests] = useState<Quest[]>(() => {
    const saved = localStorage.getItem('hud_quests');
    return saved ? JSON.parse(saved) : INITIAL_QUESTS;
  });

  const [skills, setSkills] = useState<SkillNode[]>(() => {
    const saved = localStorage.getItem('hud_skills');
    return saved ? JSON.parse(saved) : INITIAL_SKILLS;
  });

  const [armory, setArmory] = useState<ArmoryItem[]>(() => {
    const saved = localStorage.getItem('hud_armory');
    return saved ? JSON.parse(saved) : INITIAL_ARMORY;
  });

  const [uplinks, setUplinks] = useState<UplinkMessage[]>(() => {
    const saved = localStorage.getItem('hud_uplinks');
    return saved ? JSON.parse(saved) : INITIAL_UPLINKS;
  });

  // Settings & Atmospheric options
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('hud_sound_enabled');
    return saved ? JSON.parse(saved) : true;
  });

  const [scanlinesEnabled, setScanlinesEnabled] = useState(() => {
    const saved = localStorage.getItem('hud_scanlines_enabled');
    return saved ? JSON.parse(saved) : true;
  });

  const [humEnabled, setHumEnabled] = useState(false);

  const [hueColor, setHueColor] = useState(() => {
    const saved = localStorage.getItem('hud_hue_color');
    return saved ? JSON.parse(saved) : 'hud-blue';
  });

  // System link state
  const [isConnected, setIsConnected] = useState(true);

  // Control body overflow based on connection status
  useEffect(() => {
    if (!isConnected) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = 'auto';
    };
  }, [isConnected]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('hud_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('hud_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('hud_quests', JSON.stringify(quests));
  }, [quests]);

  useEffect(() => {
    localStorage.setItem('hud_skills', JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem('hud_armory', JSON.stringify(armory));
  }, [armory]);

  useEffect(() => {
    localStorage.setItem('hud_uplinks', JSON.stringify(uplinks));
  }, [uplinks]);

  useEffect(() => {
    localStorage.setItem('hud_sound_enabled', JSON.stringify(soundEnabled));
    audioSynth.setSoundEnabled(soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('hud_scanlines_enabled', JSON.stringify(scanlinesEnabled));
  }, [scanlinesEnabled]);

  useEffect(() => {
    localStorage.setItem('hud_hue_color', JSON.stringify(hueColor));
  }, [hueColor]);

  // Clean up ambient sound on unmount
  useEffect(() => {
    return () => {
      audioSynth.stopAmbientHum();
    };
  }, []);

  // Point allocator engine for attributes
  const handleAllocateStat = (statName: StatType) => {
    if (profile.availablePoints <= 0) return;

    setStats((prev) =>
      prev.map((s) => (s.name === statName ? { ...s, value: Math.min(s.max, s.value + 1) } : s))
    );

    setProfile((prev) => ({
      ...prev,
      availablePoints: prev.availablePoints - 1,
    }));
  };

  // Upgrades skill levels
  const handleUpgradeSkill = (id: string) => {
    if (profile.availablePoints <= 0) return;

    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, level: Math.min(s.maxLevel, s.level + 1) } : s))
    );

    setProfile((prev) => ({
      ...prev,
      availablePoints: prev.availablePoints - 1,
    }));
  };

  // Completes a quest, awards XP, handles Level-Up
  const handleCompleteQuest = (id: string, xpReward: number, skillReward?: string) => {
    setQuests((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: 'COMPLETED' } : q))
    );

    setProfile((prev) => {
      const newXp = prev.xp + xpReward;
      let newLvl = prev.level;
      let pointsToGive = 0;
      let nextThreshold = prev.nextLevelXp;

      if (newXp >= nextThreshold) {
        newLvl += 1;
        pointsToGive = 5; // award stat/skill points on level up!
        nextThreshold = Math.floor(nextThreshold * 1.25);
      }

      return {
        ...prev,
        xp: newXp % nextThreshold,
        level: newLvl,
        nextLevelXp: nextThreshold,
        availablePoints: prev.availablePoints + pointsToGive,
      };
    });

    if (skillReward) {
      // Unlock associated skill node if completed
      setSkills((prev) =>
        prev.map((s) => (s.name.includes(skillReward) ? { ...s, unlocked: true } : s))
      );
    }
  };

  // Adds a custom quest
  const handleAddQuest = (newQuest: Quest) => {
    setQuests((prev) => [newQuest, ...prev]);
  };

  // Deletes custom quests
  const handleDeleteQuest = (id: string) => {
    setQuests((prev) => prev.filter((q) => q.id !== id));
  };

  // Equips / Unequips items from Armory and applies modifiers
  const handleToggleEquip = (id: string) => {
    setArmory((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextEquipped = !item.equipped;
          
          // Apply/Remove stat modifiers dynamically
          if (nextEquipped) {
            // Equipped: Boost stats
            if (item.id === 'a1') { // Apex Shell
              adjustStat('AGILITY', 4);
              adjustStat('STAMINA', 2);
            } else if (item.id === 'a2') { // VS Code
              adjustStat('INTELLIGENCE', 5);
            } else if (item.id === 'a3') { // Tailwind Suit
              adjustStat('AGILITY', 8);
            } else if (item.id === 'a4') { // Vite Reactor
              adjustStat('STAMINA', 6);
            } else if (item.id === 'a5') { // Gemini Core
              adjustStat('INTELLIGENCE', 10);
              adjustStat('CHARISMA', 4);
            }
          } else {
            // Unequipped: Revert boosts
            if (item.id === 'a1') {
              adjustStat('AGILITY', -4);
              adjustStat('STAMINA', -2);
            } else if (item.id === 'a2') {
              adjustStat('INTELLIGENCE', -5);
            } else if (item.id === 'a3') {
              adjustStat('AGILITY', -8);
            } else if (item.id === 'a4') {
              adjustStat('STAMINA', -6);
            } else if (item.id === 'a5') {
              adjustStat('INTELLIGENCE', -10);
              adjustStat('CHARISMA', -4);
            }
          }

          return { ...item, equipped: nextEquipped };
        }
        return item;
      })
    );
  };

  const adjustStat = (statName: StatType, amount: number) => {
    setStats((prev) =>
      prev.map((s) => (s.name === statName ? { ...s, value: Math.max(10, Math.min(s.max, s.value + amount)) } : s))
    );
  };

  // Registers a new transmitted message
  const handleSendMessage = (newMsg: Omit<UplinkMessage, 'id' | 'timestamp' | 'status'>) => {
    const formatted: UplinkMessage = {
      ...newMsg,
      id: `u-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'STABILIZED',
    };
    setUplinks((prev) => [formatted, ...prev]);

    // Give some XP reward for submitting a portfolio link!
    setProfile((prev) => ({
      ...prev,
      xp: prev.xp + 1500,
    }));
  };

  // Master reset
  const handleResetDatabase = () => {
    localStorage.clear();
    setProfile(INITIAL_PROFILE);
    setStats(INITIAL_STATS);
    setQuests(INITIAL_QUESTS);
    setSkills(INITIAL_SKILLS);
    setArmory(INITIAL_ARMORY);
    setUplinks(INITIAL_UPLINKS);
    setSoundEnabled(true);
    setScanlinesEnabled(true);
    setHueColor('hud-blue');
  };

  const handleConnectToggle = () => {
    audioSynth.playSuccess();
    setIsConnected(!isConnected);
  };

  // Get current styling classes based on hue color
  const getAccentBorderClass = (tabName: string) => {
    if (activeTab === tabName) {
      if (hueColor === 'hud-green') return 'border-hud-green text-hud-green bg-hud-green/10 font-bold';
      if (hueColor === 'hud-purple') return 'border-hud-purple text-hud-purple bg-hud-purple/10 font-bold';
      if (hueColor === 'hud-amber') return 'border-amber-400 text-amber-400 bg-amber-400/10 font-bold';
      return 'border-hud-blue text-hud-blue bg-hud-blue/10 font-bold';
    }
    return 'border-transparent text-hud-text-dim hover:text-white hover:bg-white/5';
  };

  const getThemeTextGlow = () => {
    if (hueColor === 'hud-green') return 'text-hud-green drop-shadow-[0_0_8px_rgba(57,255,20,0.4)]';
    if (hueColor === 'hud-purple') return 'text-hud-purple drop-shadow-[0_0_8px_rgba(112,0,255,0.4)]';
    if (hueColor === 'hud-amber') return 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]';
    return 'text-hud-blue drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]';
  };

  const getThemeBgClass = () => {
    if (hueColor === 'hud-green') return 'bg-hud-green';
    if (hueColor === 'hud-purple') return 'bg-hud-purple';
    if (hueColor === 'hud-amber') return 'bg-amber-400';
    return 'bg-hud-blue';
  };

  return (
    <div className="min-h-screen bg-hud-dark-950 text-hud-text font-sans relative flex flex-col overflow-x-hidden hud-grid-bg">
      
      {/* Immersive UI Atmospheric Background Glows */}
      <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] glow-purple pulse pointer-events-none z-0" />
      <div className="absolute bottom-[-300px] right-[-100px] w-[800px] h-[800px] glow-purple pulse pointer-events-none z-0" style={{ animationDelay: '-1.5s' }} />

      {/* SCANLINES CRT SIMULATOR OVERLAY */}
      {scanlinesEnabled && (
        <div className="fixed inset-0 pointer-events-none z-50 hud-scanlines opacity-15" />
      )}

      {/* HEADER BANNER FOR GENERAL SYSTEM STATUS */}
      <header className="border-b border-white/5 bg-black/40 backdrop-blur-md px-6 py-4 flex flex-wrap justify-between items-center gap-4 relative z-30">
        <div className="flex items-center gap-2">
          <Zap className={`w-5 h-5 ${getThemeTextGlow()}`} />
          <h1 className="text-lg font-display font-black tracking-wider uppercase flex items-center gap-2 neon-text">
            KINETIC_HUD <span className="text-[11px] font-mono font-normal opacity-65 text-hud-purple">V2.0</span>
          </h1>
        </div>

        {/* Global mini states */}
        <div className="flex items-center gap-5">
          <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-hud-text-dim uppercase">
            <Radio className="w-3.5 h-3.5 animate-pulse text-hud-green" />
            SYNC_STABLE
          </div>

          <div className="flex items-center gap-2.5">
            {/* Operator Quick Stats Panel */}
            <div className="text-right flex flex-col">
              <span className="text-[9px] font-mono text-hud-text-dim tracking-wider uppercase">OPERATOR</span>
              <span className="text-xs font-mono font-bold text-white uppercase">{profile.name}</span>
            </div>
            
            {/* Operator Avatar circle */}
            <div className={`w-8 h-8 rounded-full border border-white/10 overflow-hidden relative ${getThemeTextGlow()}`}>
              <div className="absolute inset-0 bg-gradient-to-tr from-hud-blue/25 to-hud-purple/25" />
              <img 
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=60" 
                alt="Operator"
                className="w-full h-full object-cover relative z-10 opacity-75 grayscale hover:grayscale-0 transition-all duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </header>

      {/* CORE GRID BODY WORKSPACE */}
      <div className="flex-1 flex flex-col md:flex-row relative z-20 w-full max-w-7xl mx-auto p-4 md:p-6 gap-6">
        
        {/* SIDEBAR NAVIGATION PANEL (1/4 width on desktop) */}
        <aside className="md:w-64 shrink-0 flex flex-col gap-5">
          
          {/* Operator general stats summary block */}
          <div className="hud-glass p-5 rounded-xl border border-white/10 relative overflow-hidden flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="text-xs font-mono font-bold tracking-wider text-white uppercase">
                  {profile.name}
                </span>
                <span className="text-[9px] font-mono text-hud-text-dim uppercase mt-0.5">
                  LVL {Math.floor(profile.level / 10)} FULLSTACK
                </span>
              </div>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${getThemeTextGlow()} bg-white/5`}>
                SYS_UID: 01
              </span>
            </div>

            {/* Connection Status Button */}
            <button
              onClick={handleConnectToggle}
              className={`w-full py-2.5 px-4 rounded-lg font-mono text-[10px] tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isConnected
                  ? 'bg-hud-green/15 hover:bg-hud-green/25 border border-hud-green/30 text-hud-green'
                  : 'bg-red-500/10 hover:bg-red-500/25 border border-red-500/30 text-red-400'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              {isConnected ? 'DISENGAGE // CONNECTED' : 'ENGAGE // DISCONNECTED'}
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col gap-1.5">
            {[
              { id: 'DASHBOARD', label: 'DASHBOARD', icon: <LayoutDashboard className="w-4 h-4" /> },
              { id: 'QUESTS', label: 'QUESTS_LOG', icon: <Target className="w-4 h-4" /> },
              { id: 'SKILLS', label: 'SKILLS_TREE', icon: <BookOpen className="w-4 h-4" /> },
              { id: 'ARMORY', label: 'ARMORY_VAULT', icon: <Swords className="w-4 h-4" /> },
              { id: 'LOGS', label: 'SECURE_LOGS', icon: <Terminal className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  audioSynth.playClick();
                  setActiveTab(tab.id);
                }}
                className={`py-3 px-4 border-l-2 text-left rounded-r-lg font-display text-xs tracking-widest uppercase flex items-center gap-3 transition-all cursor-pointer ${getAccentBorderClass(
                  tab.id
                )}`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Bottom Settings Button */}
          <div className="mt-auto">
            <button
              onClick={() => {
                audioSynth.playClick();
                setActiveTab('SETTINGS');
              }}
              className={`w-full py-3 px-4 border-l-2 text-left rounded-r-lg font-display text-xs tracking-widest uppercase flex items-center gap-3 transition-all cursor-pointer ${getAccentBorderClass(
                'SETTINGS'
              )}`}
            >
              <Settings className="w-4 h-4" />
              HUD_SETTINGS
            </button>
          </div>
        </aside>

        {/* MAIN DISPLAY TERMINAL SPACE */}
        <main className="flex-1 min-w-0 flex flex-col">
          {!isConnected ? (
            /* DISCONNECTED SYSTEM OVERRIDE TERMINAL WARNING */
            <div className="hud-glass p-8 rounded-xl border border-red-500/30 bg-red-950/5 flex flex-col justify-center items-center text-center gap-5 min-h-[400px] animate-in fade-in duration-300 overflow-hidden">
              <div className="p-4 bg-red-500/10 rounded-full border border-red-500/30 animate-pulse">
                <Power className="w-10 h-10 text-red-500" />
              </div>
              <div>
                <h2 className="text-xl font-display font-black text-white uppercase tracking-wider">
                  SYSTEM_LINK_DISENGAGED // MAIN_SHIELDS_OFFLINE
                </h2>
                <p className="text-hud-text-dim text-xs font-mono max-w-md mt-2 leading-relaxed">
                  The local security interface has been disconnected from the secure corporate mainframe. Re-engage the master linkage inside the operator profile log card to regain access.
                </p>
              </div>
              <button
                onClick={handleConnectToggle}
                className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-black font-display font-extrabold text-xs tracking-widest rounded-lg transition-all cursor-pointer"
              >
                ENGAGE LINKAGE MAIN
              </button>
            </div>
          ) : (
            /* RENDERING SEAMLESS ACTIVE COMPONENT */
            <div className="flex-1 flex flex-col">
              {activeTab === 'DASHBOARD' && (
                <DashboardView
                  profile={profile}
                  stats={stats}
                  quests={quests}
                  skills={skills}
                  onSetTab={setActiveTab}
                  onAllocateStat={handleAllocateStat}
                  hueColor={hueColor}
                />
              )}
              {activeTab === 'QUESTS' && (
                <QuestsView
                  quests={quests}
                  onCompleteQuest={handleCompleteQuest}
                  onAddQuest={handleAddQuest}
                  onDeleteQuest={handleDeleteQuest}
                  profileLevel={profile.level}
                  isConnected={isConnected}
                />
              )}
              {activeTab === 'SKILLS' && (
                <SkillsView
                  skills={skills}
                  onUpgradeSkill={handleUpgradeSkill}
                  availablePoints={profile.availablePoints}
                />
              )}
              {activeTab === 'ARMORY' && (
                <ArmoryView
                  items={armory}
                  onToggleEquip={handleToggleEquip}
                />
              )}
              {activeTab === 'LOGS' && (
                <LogsView
                  messages={uplinks}
                  onSendMessage={handleSendMessage}
                />
              )}
              {activeTab === 'SETTINGS' && (
                <SettingsView
                  profile={profile}
                  onUpdateProfile={(updates) => setProfile((p) => ({ ...p, ...updates }))}
                  soundEnabled={soundEnabled}
                  onToggleSound={setSoundEnabled}
                  scanlinesEnabled={scanlinesEnabled}
                  onToggleScanlines={setScanlinesEnabled}
                  humEnabled={humEnabled}
                  onToggleHum={setHumEnabled}
                  hueColor={hueColor}
                  onSetHueColor={setHueColor}
                  onResetDatabase={handleResetDatabase}
                />
              )}
            </div>
          )}
        </main>

      </div>

      {/* CORE BOTTOM ARCHITECTURE TICKER DIAL (Mirroring Screen 2 bottom bar) */}
      <footer className="border-t border-white/5 bg-black/60 backdrop-blur-md px-6 py-3 relative z-30 flex flex-wrap justify-between items-center gap-4">
        {/* Core details ticker */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[10px] font-mono text-hud-text-dim">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-hud-green" />
            <span className="text-white font-bold">SYSTEM_STABLE</span>
          </div>
          <div>CPU_LOAD: 12%</div>
          <div>MEM_USAGE: 4.2GB / 64GB</div>
          <div>LATENCY: 22ms</div>
          <div>PACKET_LOSS: 0.00%</div>
          <div>PORT: 3000</div>
          <div>SECURITY_ENCRYPTION: ACTIVE</div>
        </div>

        {/* Geo Coords and Sync indicator */}
        <div className="flex items-center gap-4 text-[10px] font-mono text-hud-text-dim">
          <div className="hidden md:flex items-center gap-1">
            <HardDrive className="w-3.5 h-3.5" />
            LAST_SYNC: 14:02:11 GMT+9 // TOK-01 // HUB
          </div>
          <span className="text-white font-bold uppercase tracking-wider">
            SEC_COORD: 35.6895° N, 139.6917° E
          </span>
        </div>
      </footer>

    </div>
  );
}

