/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type StatType = 'AGILITY' | 'INTELLIGENCE' | 'STAMINA' | 'CHARISMA';

export interface AttributeStat {
  name: StatType;
  value: number;
  max: number;
  description: string;
}

export type QuestStatus = 'ACTIVE' | 'COMPLETED' | 'CRITICAL';

export interface Quest {
  id: string;
  title: string;
  level: number;
  category: 'INTERFACE' | 'BACKEND' | 'ARCH' | 'DATA';
  status: QuestStatus;
  tags: string[];
  description: string;
  requirements: string[];
  rewardXP: number;
  rewardSkill?: string;
}

export interface SkillNode {
  id: string;
  name: string;
  category: 'FRONTEND' | 'SYSTEMS' | 'MOTION_GRAPHICS' | 'CORE_DEV';
  level: number;
  maxLevel: number;
  progress: number; // 0-100
  unlocked: boolean;
  description: string;
  connections: string[]; // IDs of parent/connected nodes
}

export type RarityType = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';

export interface ArmoryItem {
  id: string;
  name: string;
  category: 'MAIN_WEAPON' | 'EXOSUIT' | 'NEURAL_LINK' | 'CORE_ENGINE';
  rarity: RarityType;
  stats: {
    label: string;
    value: string;
  }[];
  description: string;
  equipped: boolean;
  modelUrl?: string;
  techTag: string;
}

export interface UplinkMessage {
  id: string;
  userIdentifier: string;
  uplinkAddress: string;
  message: string;
  timestamp: string;
  status: 'TRANSMITTING' | 'STABILIZED' | 'ARCHIVED';
}

export interface CharacterProfile {
  name: string;
  title: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  availablePoints: number;
  allegiance: string;
  objective: string;
}
