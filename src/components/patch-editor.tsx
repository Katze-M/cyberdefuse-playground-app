import { Play, Code, CheckCircle, ShieldAlert } from "lucide-react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import { Scenario } from "@/data/scenarios";

interface PatchEditorProps {
  code: string;
  setCode: (code: string) => void;
  activeScenario: Scenario;
  isEvaluating: boolean;
  deployPatch: () => void;
}

export function PatchEditor({ code, setCode, activeScenario, isEvaluating, deployPatch }: PatchEditorProps) {
  return (
    <div className="w-full lg:w-1/3 min-h-[500px] lg:min-h-0 border-t lg:border-l lg:border-t-0 border-[var(--color-cyber-border)] bg-[var(--color-cyber-bg)] flex flex-col z-10 shadow-[-5px_0_15px_rgba(0,0,0,0.5)]">
      <div className="p-3 border-b border-[var(--color-cyber-border)] bg-[var(--color-cyber-panel)] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Code className="w-5 h-5 text-[var(--color-cyber-muted)]" />
          <span className="font-bold text-sm tracking-widest text-[var(--color-cyber-muted)]">SYSTEM_TERMINAL</span>
        </div>
        <div className="flex space-x-1">
          <div className="w-3 h-3 rounded-full bg-[var(--color-cyber-red)]/50"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-[var(--color-cyber-green)]/50"></div>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto bg-[#141414] custom-scrollbar p-2 relative">
        <Editor
          value={code}
          onValueChange={setCode}
          highlight={code => Prism.highlight(code, Prism.languages[activeScenario.language] || Prism.languages.javascript, activeScenario.language)}
          padding={10}
          className="font-mono text-sm editor-container"
          style={{
            fontFamily: '"Fira Code", "JetBrains Mono", monospace',
            minHeight: '100%',
          }}
        />
      </div>

      <div className="p-4 border-t border-[var(--color-cyber-border)] bg-[var(--color-cyber-panel)]">
        <button 
          onClick={deployPatch}
          disabled={isEvaluating}
          className="w-full py-3 bg-[var(--color-cyber-accent)]/10 border border-[var(--color-cyber-accent)] text-[var(--color-cyber-accent)] rounded font-bold tracking-widest uppercase hover:bg-[var(--color-cyber-accent)] hover:text-black transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[var(--color-cyber-accent)] transform -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] opacity-20"></div>
          {isEvaluating ? (
             <span className="animate-pulse">Analyzing...</span>
          ) : (
            <>
              <Play className="w-5 h-5" />
              <span>Deploy Patch</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
