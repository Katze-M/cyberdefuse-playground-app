import React from 'react';

export type AnimationState = "idle" | "playing_attack" | "breach" | "blocked";

export interface NodeConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
  left: string;
  color: string;
}

export interface PacketConfig {
  id: string;
  label: string;
  from: string;
  to: string;
  color: string;
  delay?: number;
}

export interface ScenarioAnimationData {
  nodes: (step: number, isBlocked: boolean) => NodeConfig[];
  packets: (step: number) => PacketConfig[];
  description: (step: number) => string;
}
