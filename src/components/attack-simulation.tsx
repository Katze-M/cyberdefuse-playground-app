import { useState, useEffect } from "react";
import { Lock } from "lucide-react";
import { AnimationState, PacketConfig } from "@/types/animation";
import { animations } from "@/data/animations";

const Packet = ({ packet }: { packet: PacketConfig }) => {
  const [pos, setPos] = useState(packet.from);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const startDelay = packet.delay || 50;
    
    // Appear and start moving
    const t1 = setTimeout(() => {
      setVisible(true);
      setPos(packet.to);
    }, startDelay);

    // Disappear after reaching destination
    const t2 = setTimeout(() => {
      setVisible(false);
    }, startDelay + 1300);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [packet]);

  return (
    <div className={`absolute z-30 flex items-center pointer-events-none transition-all duration-[1300ms] ease-in-out ${visible ? 'opacity-100' : 'opacity-0'}`}
         style={{ left: pos, transform: 'translateX(-50%)' }}>
      <div className="relative flex flex-col items-center justify-center -translate-y-1/2">
        <div className={`w-3 h-3 rounded-full ${packet.color} shadow-[0_0_10px_currentColor] ${packet.color.replace('bg-', 'text-')}`}></div>
        <span className={`absolute top-4 text-[10px] font-bold ${packet.color.replace('bg-', 'text-')} whitespace-nowrap bg-[var(--color-cyber-bg)] border border-[var(--color-cyber-border)] px-1.5 py-0.5 rounded shadow-lg`}>
          {packet.label}
        </span>
      </div>
    </div>
  );
};

export function AttackSimulation({ scenarioId, animationState }: { scenarioId: string, animationState: AnimationState }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (animationState === "playing_attack") {
      setStep(0);
      const t1 = setTimeout(() => setStep(1), 1000);
      const t2 = setTimeout(() => setStep(2), 2500);
      const t3 = setTimeout(() => setStep(3), 4000);
      const t4 = setTimeout(() => setStep(4), 5500);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
    } else {
      setStep(0);
    }
  }, [animationState, scenarioId]);

  const isBlocked = animationState === 'blocked';
  const isPlaying = animationState === 'playing_attack';

  const animationData = animations[scenarioId];
  if (!animationData) return null;

  const nodes = animationData.nodes(step, isBlocked);
  const packets = isPlaying ? animationData.packets(step) : [];
  const description = isPlaying ? animationData.description(step) : "";

  return (
    <div className="w-full min-h-[400px] lg:h-full bg-[var(--color-cyber-bg)] relative overflow-hidden flex items-center justify-center border-b lg:border-b-0 border-[var(--color-cyber-border)] p-6 transition-colors duration-1000">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(var(--color-cyber-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-cyber-border)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20 z-0"></div>
      
      {/* Dynamic Description Overlay */}
      {description && (
        <div className="absolute top-6 z-50 bg-red-900/80 text-white px-4 py-2 rounded-md font-bold text-sm tracking-wider animate-pulse border border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] text-center max-w-[80%]">
          {description}
        </div>
      )}

      {/* Connection Line */}
      {nodes.length > 1 && (
        <div className="absolute inset-0 z-10 pointer-events-none flex items-center">
          <div className="w-[70%] h-px bg-[var(--color-cyber-border)] mx-auto relative opacity-50"></div>
        </div>
      )}

      {/* Nodes */}
      {nodes.map(node => (
        <div key={node.id} className="absolute flex flex-col items-center z-20" style={{ left: node.left, transform: 'translateX(-50%)' }}>
          <div className={`w-16 h-16 rounded-full border-2 ${isBlocked ? 'border-[var(--color-cyber-green)] text-[var(--color-cyber-green)] shadow-[0_0_15px_rgba(16,185,129,0.3)]' : `border-[var(--color-cyber-border)] ${node.color} bg-[var(--color-cyber-panel)]`} flex items-center justify-center shadow-lg mb-2 relative transition-all duration-500`}>
            {node.icon}
            {isBlocked && <Lock className="absolute -bottom-2 -right-2 text-[var(--color-cyber-green)] bg-[var(--color-cyber-bg)] rounded-full w-6 h-6 border border-[var(--color-cyber-border)] p-1" />}
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-cyber-muted)] whitespace-nowrap bg-[var(--color-cyber-bg)] px-2 py-0.5 rounded border border-[var(--color-cyber-border)]">
            {node.label}
          </span>
        </div>
      ))}

      {/* Packets */}
      {packets.map(p => (
        <Packet key={p.id} packet={p} />
      ))}

      {/* Static Visuals for Idle/Breached States (When not playing) */}
      {!isPlaying && animationState === 'breach' && (
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          <div className="text-[var(--color-cyber-red)] opacity-10 uppercase tracking-widest text-4xl font-bold animate-pulse transform -rotate-12">
            VULNERABLE
          </div>
        </div>
      )}
      {!isPlaying && isBlocked && (
        <div className="absolute z-10 w-64 h-64 rounded-full border border-[var(--color-cyber-green)] opacity-20 animate-[pulse_3s_ease-in-out_infinite] flex items-center justify-center pointer-events-none">
           <div className="w-56 h-56 rounded-full border border-[var(--color-cyber-green)] opacity-40 animate-ping"></div>
        </div>
      )}
    </div>
  );
}
