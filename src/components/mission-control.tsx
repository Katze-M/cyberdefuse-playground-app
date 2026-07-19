import { Bot, TerminalSquare, AlertTriangle, ShieldCheck, Cpu } from "lucide-react";
import { Scenario } from "@/data/scenarios";

interface MentorMessage {
  role: "mentor" | "system";
  text: string;
}

interface MissionControlProps {
  activeScenario: Scenario;
  mentorMessages: MentorMessage[];
  isEvaluating: boolean;
}

export function MissionControl({ activeScenario, mentorMessages, isEvaluating }: MissionControlProps) {
  return (
    <div className="w-full lg:w-1/4 min-h-[300px] lg:min-h-0 bg-[var(--color-cyber-bg)] border-b lg:border-r lg:border-b-0 border-[var(--color-cyber-border)] flex flex-col z-10 relative">
      <div className="p-4 border-b border-[var(--color-cyber-border)] flex items-center space-x-3 bg-[var(--color-cyber-panel)]">
        <div className="w-10 h-10 rounded-full bg-[var(--color-cyber-accent)]/20 flex items-center justify-center border border-[var(--color-cyber-accent)]">
          <Bot className="w-6 h-6 text-[var(--color-cyber-accent)]" />
        </div>
        <div>
          <h2 className="font-bold text-[var(--color-cyber-text)] tracking-wider">CYBER_MENTOR</h2>
          <p className="text-xs text-[var(--color-cyber-muted)]">AI Security Analyst // Online</p>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
        {mentorMessages.map((msg, idx) => (
          <div key={idx} className={`flex items-start space-x-3 ${msg.role === 'system' ? 'opacity-80' : ''}`}>
            {msg.role === 'mentor' ? (
              <div className="mt-1 flex-shrink-0">
                <Bot className="w-5 h-5 text-[var(--color-cyber-accent)]" />
              </div>
            ) : (
              <div className="mt-1 flex-shrink-0">
                <TerminalSquare className="w-5 h-5 text-[var(--color-cyber-muted)]" />
              </div>
            )}
            <div className={`rounded-r-lg rounded-bl-lg p-3 text-sm font-mono shadow-sm
              ${msg.role === 'mentor' 
                ? 'bg-[var(--color-cyber-panel)] border border-[var(--color-cyber-border)] text-[var(--color-cyber-text)]' 
                : 'bg-black/40 text-[var(--color-cyber-muted)] border border-transparent'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isEvaluating && (
          <div className="flex items-start space-x-3">
            <div className="mt-1 flex-shrink-0">
              <Bot className="w-5 h-5 text-[var(--color-cyber-accent)] animate-pulse" />
            </div>
            <div className="bg-[var(--color-cyber-panel)] border border-[var(--color-cyber-border)] rounded-r-lg rounded-bl-lg p-3 text-sm font-mono flex items-center space-x-2">
              <Cpu className="w-4 h-4 animate-spin text-[var(--color-cyber-accent)]" />
              <span>Analyzing patch...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-[var(--color-cyber-border)] bg-[var(--color-cyber-panel)]">
        <h3 className="text-xs uppercase tracking-widest text-[var(--color-cyber-muted)] mb-2">Current Objective</h3>
        <p className="text-sm text-[var(--color-cyber-text)] font-mono">{activeScenario.vulnerabilityContext}</p>
      </div>
    </div>
  );
}
