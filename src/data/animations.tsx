import React from 'react';
import { UserX, Server, Database, Network, User, Wifi, Users, ShieldAlert } from "lucide-react";
import { ScenarioAnimationData, NodeConfig, PacketConfig } from "@/types/animation";

export const animations: Record<string, ScenarioAnimationData> = {
  "s3-exposure": {
    nodes: (step, isBlocked) => [
      { id: 'attacker', label: 'Attacker', icon: <UserX className="w-8 h-8" />, left: '20%', color: (step >= 4 && !isBlocked) ? 'text-red-500 border-red-500/50' : 'text-[var(--color-cyber-muted)]' },
      { id: 's3', label: 'S3 Bucket', icon: <Database className="w-8 h-8" />, left: '80%', color: step === 2 && !isBlocked ? 'text-red-500 border-red-500 animate-pulse' : 'text-blue-400' },
    ],
    packets: (step) => {
      const p: PacketConfig[] = [];
      if (step === 1) p.push({ id: 'p1', label: 'GET /*', from: '20%', to: '80%', color: 'bg-red-500' });
      if (step === 3) p.push({ id: 'p2', label: 'Customer Data', from: '80%', to: '20%', color: 'bg-green-500' });
      return p;
    },
    description: (step) => {
      if (step === 2) return "S3 Policy Evaluated: Publicly Accessible!";
      if (step >= 4) return "Data Exfiltrated!";
      return "";
    }
  },
  "sql-injection": {
    nodes: (step, isBlocked) => [
      { id: 'attacker', label: 'Attacker', icon: <UserX className="w-8 h-8" />, left: '15%', color: (step >= 4 && !isBlocked) ? 'text-red-500 border-red-500/50' : 'text-[var(--color-cyber-muted)]' },
      { id: 'web', label: 'Web Server', icon: <Server className="w-8 h-8" />, left: '50%', color: step === 1 && !isBlocked ? 'text-red-500 animate-pulse' : 'text-blue-400' },
      { id: 'db', label: 'Database', icon: <Database className="w-8 h-8" />, left: '85%', color: step === 3 && !isBlocked ? 'text-red-500 animate-pulse' : 'text-purple-400' },
    ],
    packets: (step) => {
      const p: PacketConfig[] = [];
      if (step === 1) p.push({ id: 'p1', label: "' OR 1=1", from: '15%', to: '50%', color: 'bg-red-500' });
      if (step === 2) p.push({ id: 'p2', label: "SELECT * FROM users", from: '50%', to: '85%', color: 'bg-red-500' });
      if (step === 3) p.push({ id: 'p3', label: "All Users Table", from: '85%', to: '50%', color: 'bg-green-500' });
      if (step >= 4) p.push({ id: 'p4', label: "Admin Credentials", from: '50%', to: '15%', color: 'bg-green-500' });
      return p;
    },
    description: (step) => {
      if (step >= 4) return "Database Dumped!";
      return "";
    }
  },
  "ssrf": {
    nodes: (step, isBlocked) => [
      { id: 'attacker', label: 'Attacker', icon: <UserX className="w-8 h-8" />, left: '15%', color: (step >= 4 && !isBlocked) ? 'text-red-500 border-red-500/50' : 'text-[var(--color-cyber-muted)]' },
      { id: 'web', label: 'Public Proxy', icon: <Server className="w-8 h-8" />, left: '50%', color: 'text-blue-400' },
      { id: 'internal', label: 'Internal Server', icon: <Network className="w-8 h-8" />, left: '85%', color: step === 3 && !isBlocked ? 'text-red-500 animate-pulse' : 'text-purple-400' },
    ],
    packets: (step) => {
      const p: PacketConfig[] = [];
      if (step === 1) p.push({ id: 'p1', label: "url=10.0.0.1", from: '15%', to: '50%', color: 'bg-red-500' });
      if (step === 2) p.push({ id: 'p2', label: "fetch(10.0.0.1)", from: '50%', to: '85%', color: 'bg-red-500' });
      if (step === 3) p.push({ id: 'p3', label: "Internal Metadata", from: '85%', to: '50%', color: 'bg-green-500' });
      if (step >= 4) p.push({ id: 'p4', label: "Internal Metadata", from: '50%', to: '15%', color: 'bg-green-500' });
      return p;
    },
    description: (step) => {
      if (step >= 4) return "Internal Network Compromised!";
      return "";
    }
  },
  "iam-privilege-escalation": {
    nodes: (step, isBlocked) => [
      { id: 'attacker', label: 'Attacker (Low Priv)', icon: <UserX className="w-8 h-8" />, left: '20%', color: (step >= 4 && !isBlocked) ? 'text-red-500 border-red-500/50' : 'text-[var(--color-cyber-muted)]' },
      { id: 'iam', label: 'AWS IAM', icon: <ShieldAlert className="w-8 h-8" />, left: '80%', color: step === 2 && !isBlocked ? 'text-red-500 border-red-500 animate-pulse' : 'text-blue-400' },
    ],
    packets: (step) => {
      const p: PacketConfig[] = [];
      if (step === 1) p.push({ id: 'p1', label: 'AttachPolicy(AdministratorAccess)', from: '20%', to: '80%', color: 'bg-red-500' });
      if (step === 3) p.push({ id: 'p2', label: 'Admin Access Granted', from: '80%', to: '20%', color: 'bg-green-500' });
      return p;
    },
    description: (step) => {
      if (step === 2) return "IAM Evaluates: Wildcard Action Allowed!";
      if (step >= 4) return "Full Cloud Takeover!";
      return "";
    }
  },
  "stored-xss": {
    nodes: (step, isBlocked) => [
      { id: 'attacker', label: 'Attacker', icon: <UserX className="w-8 h-8" />, left: '15%', color: 'text-red-500' },
      { id: 'db', label: 'Database', icon: <Database className="w-8 h-8" />, left: '50%', color: step === 1 && !isBlocked ? 'text-red-500 animate-pulse' : 'text-purple-400' },
      { id: 'user', label: 'Innocent User', icon: <User className="w-8 h-8" />, left: '85%', color: (step >= 4 && !isBlocked) ? 'text-red-500 border-red-500/50' : 'text-blue-400' },
    ],
    packets: (step) => {
      const p: PacketConfig[] = [];
      if (step === 1) p.push({ id: 'p1', label: "<script>steal()</script>", from: '15%', to: '50%', color: 'bg-red-500' });
      if (step === 2) p.push({ id: 'p2', label: "GET /comments", from: '85%', to: '50%', color: 'bg-blue-400' });
      if (step === 3) p.push({ id: 'p3', label: "Unsanitized Script", from: '50%', to: '85%', color: 'bg-red-500' });
      if (step >= 4) p.push({ id: 'p4', label: "Session Cookie", from: '85%', to: '15%', color: 'bg-green-500' });
      return p;
    },
    description: (step) => {
      if (step === 2) return "User views the infected page...";
      if (step >= 4) return "Script executes in browser, stealing session!";
      return "";
    }
  },
  "insecure-deserialization": {
    nodes: (step, isBlocked) => [
      { id: 'attacker', label: 'Attacker', icon: <UserX className="w-8 h-8" />, left: '20%', color: (step >= 4 && !isBlocked) ? 'text-red-500 border-red-500/50' : 'text-[var(--color-cyber-muted)]' },
      { id: 'server', label: 'Backend Server', icon: <Server className="w-8 h-8" />, left: '80%', color: step === 2 && !isBlocked ? 'text-red-500 border-red-500 animate-pulse' : 'text-blue-400' },
    ],
    packets: (step) => {
      const p: PacketConfig[] = [];
      if (step === 1) p.push({ id: 'p1', label: 'cookie: {rce_payload}', from: '20%', to: '80%', color: 'bg-red-500' });
      if (step === 3) p.push({ id: 'p2', label: 'Reverse Shell', from: '80%', to: '20%', color: 'bg-green-500' });
      return p;
    },
    description: (step) => {
      if (step === 2) return "Server blindly deserializes and executes payload!";
      if (step >= 4) return "Remote Code Execution Achieved!";
      return "";
    }
  },
  "mitm": {
    nodes: (step, isBlocked) => [
      { id: 'user', label: 'User', icon: <User className="w-8 h-8" />, left: '15%', color: 'text-blue-400' },
      { id: 'wifi', label: 'Public Wi-Fi', icon: <Wifi className="w-8 h-8" />, left: '50%', color: (step >= 2 && !isBlocked) ? 'text-red-500 animate-pulse' : 'text-yellow-400' },
      { id: 'server', label: 'HTTP Server', icon: <Server className="w-8 h-8" />, left: '85%', color: 'text-purple-400' },
    ],
    packets: (step) => {
      const p: PacketConfig[] = [];
      if (step === 1) p.push({ id: 'p1', label: 'Login(password123)', from: '15%', to: '50%', color: 'bg-blue-400' });
      if (step === 2) p.push({ id: 'p2', label: 'Login(password123)', from: '50%', to: '85%', color: 'bg-red-500' });
      if (step === 3) p.push({ id: 'p3', label: "Success", from: '85%', to: '50%', color: 'bg-green-500' });
      if (step >= 4) p.push({ id: 'p4', label: "Success", from: '50%', to: '15%', color: 'bg-green-500' });
      return p;
    },
    description: (step) => {
      if (step === 2) return "Attacker sniffing unencrypted HTTP traffic!";
      if (step >= 4) return "Password intercepted in plaintext!";
      return "";
    }
  },
  "session-hijacking": {
    nodes: (step, isBlocked) => [
      { id: 'attacker', label: 'Attacker', icon: <UserX className="w-8 h-8" />, left: '20%', color: (step >= 4 && !isBlocked) ? 'text-red-500 border-red-500/50' : 'text-[var(--color-cyber-muted)]' },
      { id: 'server', label: 'Web Server', icon: <Server className="w-8 h-8" />, left: '80%', color: step === 2 && !isBlocked ? 'text-red-500 border-red-500 animate-pulse' : 'text-blue-400' },
    ],
    packets: (step) => {
      const p: PacketConfig[] = [];
      if (step === 1) p.push({ id: 'p1', label: 'GET /dashboard (Stolen Cookie)', from: '20%', to: '80%', color: 'bg-red-500' });
      if (step === 3) p.push({ id: 'p2', label: 'Private Dashboard Data', from: '80%', to: '20%', color: 'bg-green-500' });
      return p;
    },
    description: (step) => {
      if (step === 2) return "Server validates session cookie (thinks it's the real user)";
      if (step >= 4) return "Account Hijacked!";
      return "";
    }
  },
  "brute-force": {
    nodes: (step, isBlocked) => [
      { id: 'botnet', label: 'Botnet', icon: <Users className="w-8 h-8" />, left: '20%', color: (step >= 4 && !isBlocked) ? 'text-red-500 border-red-500/50' : 'text-red-500' },
      { id: 'server', label: 'Login Endpoint', icon: <Server className="w-8 h-8" />, left: '80%', color: step >= 1 && !isBlocked ? 'text-red-500 border-red-500 animate-pulse' : 'text-blue-400' },
    ],
    packets: (step) => {
      const p: PacketConfig[] = [];
      if (step === 1) {
        p.push({ id: 'p1a', label: 'admin/1234', from: '20%', to: '80%', color: 'bg-red-500', delay: 0 });
        p.push({ id: 'p1b', label: 'admin/password', from: '20%', to: '80%', color: 'bg-red-500', delay: 300 });
        p.push({ id: 'p1c', label: 'admin/admin', from: '20%', to: '80%', color: 'bg-red-500', delay: 600 });
      }
      if (step === 2) {
        p.push({ id: 'p2a', label: 'admin/qwerty', from: '20%', to: '80%', color: 'bg-red-500', delay: 0 });
        p.push({ id: 'p2b', label: 'admin/letmein', from: '20%', to: '80%', color: 'bg-red-500', delay: 300 });
      }
      if (step === 3) p.push({ id: 'p3', label: 'Match Found! (admin/qwerty)', from: '80%', to: '20%', color: 'bg-green-500' });
      return p;
    },
    description: (step) => {
      if (step === 2) return "No Rate Limiting: Flooding server with guesses...";
      if (step >= 4) return "Account Breached!";
      return "";
    }
  },
  "command-injection": {
    nodes: (step, isBlocked) => [
      { id: 'attacker', label: 'Attacker', icon: <UserX className="w-8 h-8" />, left: '15%', color: (step >= 4 && !isBlocked) ? 'text-red-500 border-red-500/50' : 'text-[var(--color-cyber-muted)]' },
      { id: 'web', label: 'Web Server', icon: <Server className="w-8 h-8" />, left: '50%', color: step === 1 && !isBlocked ? 'text-red-500 animate-pulse' : 'text-blue-400' },
      { id: 'terminal', label: 'OS Terminal', icon: <Network className="w-8 h-8" />, left: '85%', color: step === 3 && !isBlocked ? 'text-red-500 animate-pulse' : 'text-purple-400' },
    ],
    packets: (step) => {
      const p: PacketConfig[] = [];
      if (step === 1) p.push({ id: 'p1', label: "127.0.0.1; cat /etc/passwd", from: '15%', to: '50%', color: 'bg-red-500' });
      if (step === 2) p.push({ id: 'p2', label: "exec('ping... ; cat /etc/passwd')", from: '50%', to: '85%', color: 'bg-red-500' });
      if (step === 3) p.push({ id: 'p3', label: "root:x:0:0...", from: '85%', to: '50%', color: 'bg-green-500' });
      if (step >= 4) p.push({ id: 'p4', label: "root:x:0:0...", from: '50%', to: '15%', color: 'bg-green-500' });
      return p;
    },
    description: (step) => {
      if (step === 2) return "Server blindly executes the raw string in the OS Shell!";
      if (step >= 4) return "System Secrets Exfiltrated!";
      return "";
    }
  },
  "path-traversal": {
    nodes: (step, isBlocked) => [
      { id: 'attacker', label: 'Attacker', icon: <UserX className="w-8 h-8" />, left: '15%', color: (step >= 4 && !isBlocked) ? 'text-red-500 border-red-500/50' : 'text-[var(--color-cyber-muted)]' },
      { id: 'web', label: 'Web Server', icon: <Server className="w-8 h-8" />, left: '50%', color: step === 1 && !isBlocked ? 'text-red-500 animate-pulse' : 'text-blue-400' },
      { id: 'fs', label: 'File System', icon: <Database className="w-8 h-8" />, left: '85%', color: step === 3 && !isBlocked ? 'text-red-500 animate-pulse' : 'text-purple-400' },
    ],
    packets: (step) => {
      const p: PacketConfig[] = [];
      if (step === 1) p.push({ id: 'p1', label: "../../../../etc/shadow", from: '15%', to: '50%', color: 'bg-red-500' });
      if (step === 2) p.push({ id: 'p2', label: "fs.readFile('../../../../etc/shadow')", from: '50%', to: '85%', color: 'bg-red-500' });
      if (step === 3) p.push({ id: 'p3', label: "shadow_hash_data", from: '85%', to: '50%', color: 'bg-green-500' });
      if (step >= 4) p.push({ id: 'p4', label: "shadow_hash_data", from: '50%', to: '15%', color: 'bg-green-500' });
      return p;
    },
    description: (step) => {
      if (step === 2) return "Server escapes the upload directory using '../' sequences.";
      if (step >= 4) return "Shadow Password File Leaked!";
      return "";
    }
  },
  "idor": {
    nodes: (step, isBlocked) => [
      { id: 'attacker', label: 'Attacker (User 5)', icon: <UserX className="w-8 h-8" />, left: '15%', color: (step >= 4 && !isBlocked) ? 'text-red-500 border-red-500/50' : 'text-[var(--color-cyber-muted)]' },
      { id: 'web', label: 'API Endpoint', icon: <Server className="w-8 h-8" />, left: '50%', color: step === 1 && !isBlocked ? 'text-red-500 animate-pulse' : 'text-blue-400' },
      { id: 'db', label: 'Database', icon: <Database className="w-8 h-8" />, left: '85%', color: step === 3 && !isBlocked ? 'text-red-500 animate-pulse' : 'text-purple-400' },
    ],
    packets: (step) => {
      const p: PacketConfig[] = [];
      if (step === 1) p.push({ id: 'p1', label: "GET /api/users/1", from: '15%', to: '50%', color: 'bg-red-500' });
      if (step === 2) p.push({ id: 'p2', label: "SELECT * FROM users WHERE id=1", from: '50%', to: '85%', color: 'bg-red-500' });
      if (step === 3) p.push({ id: 'p3', label: "Admin Profile Data", from: '85%', to: '50%', color: 'bg-green-500' });
      if (step >= 4) p.push({ id: 'p4', label: "Admin Profile Data", from: '50%', to: '15%', color: 'bg-green-500' });
      return p;
    },
    description: (step) => {
      if (step === 2) return "API fails to verify if User 5 is allowed to view User 1.";
      if (step >= 4) return "Admin Data Accessed via IDOR!";
      return "";
    }
  },
  "csrf": {
    nodes: (step, isBlocked) => [
      { id: 'attacker', label: 'Attacker Site', icon: <UserX className="w-8 h-8" />, left: '15%', color: 'text-red-500' },
      { id: 'user', label: 'Victim Browser', icon: <User className="w-8 h-8" />, left: '50%', color: (step >= 2 && !isBlocked) ? 'text-red-500 animate-pulse' : 'text-blue-400' },
      { id: 'server', label: 'Bank Server', icon: <Server className="w-8 h-8" />, left: '85%', color: step === 3 && !isBlocked ? 'text-red-500 animate-pulse' : 'text-purple-400' },
    ],
    packets: (step) => {
      const p: PacketConfig[] = [];
      if (step === 1) p.push({ id: 'p1', label: "Phishing Link", from: '15%', to: '50%', color: 'bg-red-500' });
      if (step === 2) p.push({ id: 'p2', label: "POST /update-email (Auto Cookie)", from: '50%', to: '85%', color: 'bg-red-500' });
      if (step === 3) p.push({ id: 'p3', label: "Email Changed to Attacker's", from: '85%', to: '50%', color: 'bg-green-500' });
      return p;
    },
    description: (step) => {
      if (step === 2) return "Browser automatically attaches session cookie to attacker's request!";
      if (step >= 4) return "Account Compromised via CSRF!";
      return "";
    }
  },
  "open-redirect": {
    nodes: (step, isBlocked) => [
      { id: 'attacker', label: 'Attacker Link', icon: <UserX className="w-8 h-8" />, left: '15%', color: 'text-red-500' },
      { id: 'server', label: 'Our Login Server', icon: <Server className="w-8 h-8" />, left: '50%', color: step === 1 && !isBlocked ? 'text-red-500 animate-pulse' : 'text-blue-400' },
      { id: 'evil', label: 'Evil Clone Site', icon: <Network className="w-8 h-8" />, left: '85%', color: (step >= 4 && !isBlocked) ? 'text-red-500 border-red-500/50 animate-pulse' : 'text-purple-400' },
    ],
    packets: (step) => {
      const p: PacketConfig[] = [];
      if (step === 1) p.push({ id: 'p1', label: "/login?next=http://evil.com", from: '15%', to: '50%', color: 'bg-red-500' });
      if (step === 2) p.push({ id: 'p2', label: "HTTP 302 Redirect to evil.com", from: '50%', to: '15%', color: 'bg-green-500' });
      if (step === 3) p.push({ id: 'p3', label: "Victim blindly follows redirect", from: '15%', to: '85%', color: 'bg-red-500' });
      if (step >= 4) p.push({ id: 'p4', label: "Victim enters credentials here", from: '85%', to: '15%', color: 'bg-green-500' });
      return p;
    },
    description: (step) => {
      if (step === 2) return "Server blindly redirects user to the untrusted domain.";
      if (step >= 4) return "Victim Phished successfully!";
      return "";
    }
  },
  "ddos": {
    nodes: (step, isBlocked) => [
      { id: 'bot1', label: 'Botnet Node 1', icon: <Users className="w-8 h-8" />, left: '10%', color: 'text-red-500' },
      { id: 'bot2', label: 'Botnet Node 2', icon: <Users className="w-8 h-8" />, left: '25%', color: 'text-red-500' },
      { id: 'server', label: 'Database API', icon: <Database className="w-8 h-8" />, left: '80%', color: (step >= 2 && !isBlocked) ? 'text-red-500 border-red-500/80 animate-[ping_0.5s_cubic-bezier(0,0,0.2,1)_infinite]' : 'text-blue-400' },
    ],
    packets: (step) => {
      const p: PacketConfig[] = [];
      if (step === 1 || step === 2) {
        // Barrage of packets
        for (let i = 0; i < 15; i++) {
          p.push({ id: `p1_${i}`, label: "HTTP GET /api/search", from: '10%', to: '80%', color: 'bg-red-500', delay: i * 50 });
          p.push({ id: `p2_${i}`, label: "HTTP GET /api/search", from: '25%', to: '80%', color: 'bg-red-500', delay: (i * 50) + 25 });
        }
      }
      if (step >= 3) {
        // Even more intense
        for (let i = 0; i < 20; i++) {
          p.push({ id: `p3_${i}`, label: "HTTP GET /api/search", from: '10%', to: '80%', color: 'bg-red-500', delay: i * 30 });
          p.push({ id: `p4_${i}`, label: "HTTP GET /api/search", from: '25%', to: '80%', color: 'bg-red-500', delay: (i * 30) + 15 });
        }
      }
      return p;
    },
    description: (step) => {
      if (step === 1) return "Botnet initiates massive flood of search requests...";
      if (step === 2) return "Database CPU utilization spiking to 100%!";
      if (step >= 3) return "Service Crashed: Denial of Service Successful!";
      return "";
    }
  }
};
