'use client';

import { useEffect, useRef, useState } from 'react';

const BOOT_SEQUENCE = [
  { text: '$ Initializing secure shell...', delay: 0, color: 'var(--text-muted)' },
  { text: '$ Loading profile: res4ad', delay: 400, color: 'var(--text-muted)' },
  { text: '$ Scanning targets...', delay: 800, color: 'var(--text-muted)' },
  { text: '', delay: 1100, color: '' },
  { text: '  ██████╗ ███████╗███████╗██╗  ██╗ █████╗ ██████╗', delay: 1200, color: 'var(--accent)' },
  { text: '  ██╔══██╗██╔════╝██╔════╝██║  ██║██╔══██╗██╔══██╗', delay: 1250, color: 'var(--accent)' },
  { text: '  ██████╔╝█████╗  ███████╗███████║███████║██║  ██║', delay: 1300, color: 'var(--accent)' },
  { text: '  ██╔══██╗██╔══╝  ╚════██║╚════██║██╔══██║██║  ██║', delay: 1350, color: 'var(--accent)' },
  { text: '  ██║  ██║███████╗███████║     ██║██║  ██║██████╔╝', delay: 1400, color: 'var(--accent)' },
  { text: '  ╚═╝  ╚═╝╚══════╝╚══════╝     ╚═╝╚═╝  ╚═╝╚═════╝', delay: 1450, color: 'var(--accent)' },
  { text: '', delay: 1600, color: '' },
  { text: '  user@kali:~$ whoami', delay: 1700, color: 'var(--text)' },
  { text: '  Reshad Rustemov — Pentester & Red Team Enthusiast', delay: 2000, color: 'var(--accent)' },
  { text: '', delay: 2200, color: '' },
  { text: '  user@kali:~$ cat skills.txt', delay: 2400, color: 'var(--text)' },
  { text: '  [+] Web Application Security', delay: 2700, color: '#4499ff' },
  { text: '  [+] Active Directory Attacks', delay: 2900, color: '#4499ff' },
  { text: '  [+] Penetration Testing', delay: 3100, color: '#4499ff' },
  { text: '  [+] Red Team Operations', delay: 3300, color: '#4499ff' },
  { text: '', delay: 3500, color: '' },
  { text: '  user@kali:~$ cat status.txt', delay: 3700, color: 'var(--text)' },
  { text: '  [AVAILABLE] — Open for pentest engagements & freelance work', delay: 4000, color: '#00ff88' },
];

export default function HeroTerminal() {
  const [lines, setLines] = useState<{ text: string; color: string }[]>([]);
  const [done, setDone] = useState(false);
  const termRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    BOOT_SEQUENCE.forEach((item, i) => {
      const t = setTimeout(() => {
        setLines(prev => [...prev, { text: item.text, color: item.color }]);
        if (i === BOOT_SEQUENCE.length - 1) setDone(true);
        if (termRef.current) {
          termRef.current.scrollTop = termRef.current.scrollHeight;
        }
      }, item.delay);
      timers.push(t);
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={{
      background: '#0a0a0a',
      border: '1px solid var(--border)',
      borderRadius: 10,
      overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,255,136,0.06)',
    }}>
      {/* Terminal title bar */}
      <div style={{
        background: '#111',
        padding: '0.6rem 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff5f57' }} />
        <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#febc2e' }} />
        <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#28c840' }} />
        <span style={{
          marginLeft: '0.5rem', color: 'var(--text-dim)', fontSize: '0.75rem',
          fontFamily: 'JetBrains Mono, monospace',
        }}>res4ad@kali: ~</span>
      </div>
      {/* Terminal body */}
      <div
        ref={termRef}
        style={{
          padding: '1.25rem',
          minHeight: 340,
          maxHeight: 400,
          overflowY: 'auto',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.78rem',
          lineHeight: 1.7,
        }}
      >
        {lines.map((line, i) => (
          <div key={i} style={{ color: line.color || 'var(--text-muted)', whiteSpace: 'pre' }}>
            {line.text}
          </div>
        ))}
        {done && (
          <div style={{ color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <span style={{ color: 'var(--accent)' }}>  user@kali:~$</span>
            <span style={{ color: 'var(--text)' }}> _</span>
            <span className="cursor-blink" style={{ display: 'inline-block', width: 8, height: 16, background: 'var(--accent)', marginLeft: 1, verticalAlign: 'middle' }} />
          </div>
        )}
      </div>
    </div>
  );
}
