"use client";

import { useState, useEffect } from "react";
import { Shield, Play } from "lucide-react";
import { scenarios, Scenario } from "@/data/scenarios";
import { AttackSimulation } from "@/components/attack-simulation";
import { MissionControl } from "@/components/mission-control";
import { PatchEditor } from "@/components/patch-editor";
import { AnimationState } from "@/types/animation";

import "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-json";
import "prismjs/themes/prism-twilight.css";

import { useAuth, SignInButton, SignUpButton, UserButton, Show } from "@clerk/nextjs";

interface MentorMessage {
  role: "mentor" | "system";
  text: string;
}

export default function Dashboard() {
  const { isSignedIn } = useAuth();
  const [activeScenario, setActiveScenario] = useState<Scenario>(scenarios[0]);
  const [code, setCode] = useState(activeScenario.initialCode);
  const [animationState, setAnimationState] = useState<AnimationState>("breach");
  const [mentorMessages, setMentorMessages] = useState<MentorMessage[]>([
    { role: "mentor", text: activeScenario.mentorBriefing }
  ]);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // When scenario changes, reset everything
  useEffect(() => {
    setCode(activeScenario.initialCode);
    setAnimationState("breach");
    setMentorMessages([{ role: "mentor", text: activeScenario.mentorBriefing }]);
  }, [activeScenario]);

  const playAttack = () => {
    setAnimationState("playing_attack");
    setMentorMessages(prev => [...prev, { role: "mentor", text: "Simulating attack vector..." }]);
    setTimeout(() => {
      setAnimationState("breach");
      setMentorMessages(prev => [...prev, { role: "mentor", text: "Simulation complete. System is vulnerable!" }]);
    }, 7500); // 7.5s matches the full step-by-step sequence duration
  };

  const deployPatch = async () => {
    if (!isSignedIn) {
      setMentorMessages(prev => [...prev, { role: "system", text: "ERROR: Authentication required to deploy patches." }]);
      return;
    }

    setIsEvaluating(true);
    setMentorMessages(prev => [...prev, { role: "system", text: "Deploying patch for evaluation..." }]);

    try {
      const response = await fetch("/api/evaluate-patch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          code, 
          scenario: activeScenario.vulnerabilityContext 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to evaluate patch");
      }

      const data = await response.json();
      
      setMentorMessages(prev => [...prev, { role: "mentor", text: data.feedback }]);

      if (data.isSecure) {
        setAnimationState("blocked");
      } else {
        setAnimationState("breach");
      }
    } catch (error: any) {
      setMentorMessages(prev => [...prev, { role: "system", text: `ERROR: ${error.message}` }]);
      setAnimationState("breach");
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans">
      {/* HEADER */}
      <header className="h-16 border-b border-[var(--color-cyber-border)] bg-[var(--color-cyber-bg)] flex items-center justify-between px-6 z-20">
        <div className="flex items-center space-x-3">
          <Shield className="w-8 h-8 text-[var(--color-cyber-accent)] animate-pulse" />
          <h1 className="text-xl font-bold tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-300">
            CyberDefuse_OS
          </h1>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="text-sm font-bold text-[var(--color-cyber-muted)] uppercase tracking-widest">Scenario:</div>
            <select 
              className="bg-[var(--color-cyber-panel)] border border-[var(--color-cyber-border)] text-[var(--color-cyber-text)] px-4 py-2 rounded focus:outline-none focus:border-[var(--color-cyber-accent)] appearance-none cursor-pointer text-sm"
              value={activeScenario.id}
              onChange={(e) => setActiveScenario(scenarios.find(s => s.id === e.target.value) || scenarios[0])}
            >
              {scenarios.map(s => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
          </div>

          <div className="h-8 w-px bg-[var(--color-cyber-border)]"></div>

          <Show when="signed-in">
            <div className="flex items-center space-x-4 h-8">
              <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8 border border-[var(--color-cyber-accent)]" } }} />
            </div>
          </Show>
          <Show when="signed-out">
            <div className="flex items-center space-x-3">
              <SignInButton mode="modal">
                <button className="text-white hover:text-white/80 font-bold tracking-wider text-sm transition-colors">
                  Log In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-1.5 rounded font-bold tracking-wider text-sm transition-colors">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </Show>
        </div>
      </header>

      {/* MAIN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT PANEL: Mentor Chat */}
        <MissionControl 
          activeScenario={activeScenario} 
          mentorMessages={mentorMessages} 
          isEvaluating={isEvaluating} 
        />

        {/* CENTER: Visual Canvas */}
        <div className="flex-1 flex flex-col relative z-0">
          <div className="absolute top-4 right-4 z-50">
            <button 
              onClick={playAttack}
              disabled={animationState === 'playing_attack' || isEvaluating}
              className="bg-red-500/20 hover:bg-red-500/40 border border-red-500 text-red-100 px-4 py-2 rounded-md font-bold tracking-wider text-sm flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4" />
              <span>Simulate Attack</span>
            </button>
          </div>
          <AttackSimulation scenarioId={activeScenario.id} animationState={animationState} />
        </div>

        {/* RIGHT PANEL: Code Editor */}
        <PatchEditor 
          code={code} 
          setCode={setCode} 
          activeScenario={activeScenario} 
          isEvaluating={isEvaluating} 
          deployPatch={deployPatch} 
        />

      </div>
    </div>
  );
}
