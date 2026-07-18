/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CharacterProfile, AttributeStat, Quest, SkillNode, ArmoryItem, UplinkMessage } from '../types';

export const INITIAL_PROFILE: CharacterProfile = {
  name: 'SAMUEL L',
  title: ' • Port ',
  level: 99,
  xp: 82400,
  nextLevelXp: 100000,
  availablePoints: 5,
  allegiance: 'THE VOID PROTOCOL',
  objective: 'SYSTEM OVERHAUL V2.0',
};

export const INITIAL_STATS: AttributeStat[] = [
  {
    name: 'AGILITY',
    value: 94,
    max: 100,
    description: 'Execution velocity, layout responsiveness, UI framerate assembly, and quick keyboard shortcuts.',
  },
  {
    name: 'INTELLIGENCE',
    value: 99,
    max: 100,
    description: 'System architectural abstraction, algorithmic performance, memory profiling, and core logic safety.',
  },
  {
    name: 'STAMINA',
    value: 82,
    max: 100,
    description: 'Compilation resilience, long-term focus, code-review endurance, and transaction log processing.',
  },
  {
    name: 'CHARISMA',
    value: 88,
    max: 100,
    description: 'Developer advocacy, pull request descriptions, system design documentation, and API design empathy.',
  },
];

export const INITIAL_QUESTS: Quest[] = [
  {
    id: 'q1',
    title: 'Implement Neural Dashboard',
    level: 42,
    category: 'INTERFACE',
    status: 'ACTIVE',
    tags: ['REACT', 'THREE.JS'],
    description: 'Construct a state-of-the-art glassmorphic cockpit console displaying real-time responsive telemetry streams and nested diagnostic panels.',
    requirements: [
      'Implement backdrop filter blur (12px) structures on standard layouts',
      'Integrate responsive pixel grids matching fluid HUD coordinates',
      'Create custom sound synthesizers on key actions'
    ],
    rewardXP: 4200,
    rewardSkill: 'Motion Graphics',
  },
  {
    id: 'q2',
    title: 'Optimize Core Flux Engine',
    level: 38,
    category: 'BACKEND',
    status: 'COMPLETED',
    tags: ['NODE.JS', 'EXPRESS'],
    description: 'Refactor binary event queues inside Express streaming routers to reduce critical message-brokering overhead to sub-millisecond latencies.',
    requirements: [
      'Eliminate garbage-collection pauses inside memory cycles',
      'Pool active socket connections for high-frequency relays',
      'Migrate monolithic assets routing directly onto edge-server CDNs'
    ],
    rewardXP: 3800,
  },
  {
    id: 'q3',
    title: 'Stabilize Spatial Database',
    level: 55,
    category: 'ARCH',
    status: 'CRITICAL',
    tags: ['POSTGRES', 'INDEXING'],
    description: 'Isolate and neutralize heavy deadlocks occurring inside PostgreSQL shards under synchronized high-concurrency client updates.',
    requirements: [
      'Establish row-level locks on primary writing transactions',
      'Re-index geographic coordinate clusters with highly efficient GIST layouts',
      'Establish container fallback orchestrators for database failovers'
    ],
    rewardXP: 6500,
    rewardSkill: 'Systems Architecture',
  },
  {
    id: 'q4',
    title: 'Integrate Gemini Cognitive Stream',
    level: 80,
    category: 'DATA',
    status: 'ACTIVE',
    tags: ['GEMINI_API', 'AI'],
    description: 'Construct server-side secure endpoints feeding system audit trails into Gemini context windows for auto-triage of network alerts.',
    requirements: [
      'Define strict server-side API proxy shielding of client sessions',
      'Establish prompt boundaries avoiding structural schema leaks',
      'Render streaming markdown solutions in real-time interfaces'
    ],
    rewardXP: 9500,
    rewardSkill: 'AI Engineering',
  }
];

export const INITIAL_SKILLS: SkillNode[] = [
  // Frontend Arch category
  {
    id: 's1',
    name: 'React Ecosystem (Vite/SPA)',
    category: 'FRONTEND',
    level: 5,
    maxLevel: 5,
    progress: 100,
    unlocked: true,
    description: 'Mastery of reactive virtual DOM cycles, custom hooks orchestration, and state managers.',
    connections: ['s2', 's3'],
  },
  {
    id: 's2',
    name: 'Tailwind Styling Fluent',
    category: 'FRONTEND',
    level: 5,
    maxLevel: 5,
    progress: 100,
    unlocked: true,
    description: 'Fluid custom utility construction, theme extensions, custom gradients, and container alignments.',
    connections: [],
  },
  {
    id: 's3',
    name: 'Motion Animations',
    category: 'FRONTEND',
    level: 3,
    maxLevel: 5,
    progress: 60,
    unlocked: true,
    description: 'Staggered entrances, keyframe transformations, layout shifts, and physical spring physics.',
    connections: [],
  },

  // Systems Design
  {
    id: 's4',
    name: 'Fullstack Express Engines',
    category: 'SYSTEMS',
    level: 4,
    maxLevel: 5,
    progress: 80,
    unlocked: true,
    description: 'High performance routing, stream pipes, CORS security, and rate limit protections.',
    connections: ['s5'],
  },
  {
    id: 's5',
    name: 'Relational Database Arch',
    category: 'SYSTEMS',
    level: 3,
    maxLevel: 5,
    progress: 60,
    unlocked: true,
    description: 'Transaction isolations, nested sub-queries, and composite indexing schemas.',
    connections: [],
  },

  // Motion Graphics
  {
    id: 's6',
    name: 'Holographic UI Canvas',
    category: 'MOTION_GRAPHICS',
    level: 2,
    maxLevel: 5,
    progress: 40,
    unlocked: true,
    description: 'WebGL shader operations, SVG line drawing, and dynamic particle matrices.',
    connections: [],
  },
  {
    id: 's7',
    name: 'Web Audio Synthesizers',
    category: 'MOTION_GRAPHICS',
    level: 3,
    maxLevel: 5,
    progress: 60,
    unlocked: true,
    description: 'Creating musical intervals, sweep filters, custom gains, and sound buffers natively.',
    connections: [],
  }
];

export const INITIAL_ARMORY: ArmoryItem[] = [
  {
    id: 'a1',
    name: 'Apex Shell Console (Zsh/Tmux)',
    category: 'MAIN_WEAPON',
    rarity: 'LEGENDARY',
    stats: [
      { label: 'VELOCITY BOOST', value: '+45%' },
      { label: 'DEPLOY CHANCE', value: '+20%' },
      { label: 'COOLDOWN SPEED', value: '+30%' }
    ],
    description: 'A fully tuned terminal customized with multiplexed grids and ultra-fast command aliases. Cuts through heavy diagnostics like a laser.',
    equipped: true,
    techTag: 'Linux Bash',
  },
  {
    id: 'a2',
    name: 'Hyperion Text Matrix (VS Code)',
    category: 'MAIN_WEAPON',
    rarity: 'EPIC',
    stats: [
      { label: 'SYNTAX SENSE', value: '+35%' },
      { label: 'DEBUG RESOLVE', value: '+40%' }
    ],
    description: 'Ergonomic developer cockpit styled with optimal high-contrast themes and neural autocomplete links.',
    equipped: false,
    techTag: 'TypeScript',
  },
  {
    id: 'a3',
    name: 'Tailwind Hyper-Exosuit',
    category: 'EXOSUIT',
    rarity: 'LEGENDARY',
    stats: [
      { label: 'LAYOUT INTEGRITY', value: '+50%' },
      { label: 'MOBILE DENSITY', value: '+40%' },
      { label: 'GLOW RESISTANCE', value: '+25%' }
    ],
    description: 'A lightweight aerodynamic protective armor enabling fluid responsive layouts that scale gracefully from watches to giant display grids.',
    equipped: true,
    techTag: 'Tailwind CSS',
  },
  {
    id: 'a4',
    name: 'Vite Fusion Engine v6',
    category: 'CORE_ENGINE',
    rarity: 'EPIC',
    stats: [
      { label: 'START ENERGY', value: 'Instant' },
      { label: 'COMPRESS RATIO', value: '4.2x' },
      { label: 'HMR STABILIZER', value: 'Online' }
    ],
    description: 'A lightning-fast compilation core that powers instant server startups and tiny static build bundle footprints.',
    equipped: true,
    techTag: 'ViteJS',
  },
  {
    id: 'a5',
    name: 'Gemini Cognitive Matrix',
    category: 'NEURAL_LINK',
    rarity: 'LEGENDARY',
    stats: [
      { label: 'INTELLIGENCE LEVEL', value: 'MAX' },
      { label: 'AI GENERATION SPEED', value: '0.4s' },
      { label: 'TRIAGE AUTONOMY', value: '+95%' }
    ],
    description: 'A sophisticated AI-neural module feeding semantic problem vectors directly to cloud intelligence arrays for real-time code-repair.',
    equipped: true,
    techTag: 'Gemini AI',
  }
];

export const INITIAL_UPLINKS: UplinkMessage[] = [
  {
    id: 'u1',
    userIdentifier: 'RECRUITER_ALPHA',
    uplinkAddress: 'contact@cyber-corps.net',
    message: 'Greetings Architect. We observed your neural dashboard and would love to initiate a joint tactical mission on our high-performance UI pipeline.',
    timestamp: '2026-07-17 19:42:15',
    status: 'STABILIZED',
  },
  {
    id: 'u2',
    userIdentifier: 'GUEST_0832',
    uplinkAddress: 'quantum_dev@gmail.com',
    message: 'Testing signal integrity from Southern Dome region. Outstanding responsive animations here, the visual flow feels incredibly organic!',
    timestamp: '2026-07-18 01:10:04',
    status: 'ARCHIVED',
  }
];
