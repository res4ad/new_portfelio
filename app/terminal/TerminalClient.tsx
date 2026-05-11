'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';

interface TerminalClientProps {
  commandMap: Record<string, string>;
}

interface HistoryEntry {
  type: 'input' | 'output' | 'error' | 'system';
  text: string;
}

const HELP_TEXT = `Available commands:
  whoami         - Current user
  pwd            - Print working directory
  ls             - List files
  ls -la         - List all files with details
  cat README.md  - Read README file
  ps aux         - Running processes
  sudo -l        - Sudo privileges
  nmap           - Nmap usage
  top            - System monitor
  ifconfig       - Network interfaces
  history        - Command history
  uname -a       - System information
  cd [dir]       - Change directory
  clear          - Clear terminal
  help           - Show this help

Note: This is a simulated environment. No real commands are executed.`;

export default function TerminalClient({ commandMap }: TerminalClientProps) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([
    { type: 'system', text: '╔══════════════════════════════════════════════════════════╗' },
    { type: 'system', text: '║     res4ad@kali — Interactive Terminal Simulator          ║' },
    { type: 'system', text: '║     Type "help" for available commands                    ║' },
    { type: 'system', text: '╚══════════════════════════════════════════════════════════╝' },
    { type: 'system', text: '' },
  ]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [histIndex, setHistIndex] = useState(-1);
  const [cwd, setCwd] = useState('/home/res4ad');
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const getPrompt = () => `res4ad@kali:${cwd}$`;

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const newHistory: HistoryEntry[] = [
      ...history,
      { type: 'input', text: `${getPrompt()} ${trimmed}` },
    ];

    setCmdHistory(prev => [trimmed, ...prev]);
    setHistIndex(-1);

    if (trimmed === 'clear') {
      setHistory([{ type: 'system', text: 'Terminal cleared. Type "help" for commands.' }, { type: 'system', text: '' }]);
      setInput('');
      return;
    }

    if (trimmed === 'help') {
      const lines = HELP_TEXT.split('\n');
      lines.forEach(line => newHistory.push({ type: 'output', text: line }));
      newHistory.push({ type: 'output', text: '' });
      setHistory(newHistory);
      setInput('');
      return;
    }

    // Handle cd
    if (trimmed.startsWith('cd ')) {
      const dir = trimmed.slice(3).trim();
      if (dir === '~' || dir === '') {
        setCwd('/home/res4ad');
        newHistory.push({ type: 'output', text: '' });
      } else if (dir === '..') {
        const parts = cwd.split('/').filter(Boolean);
        parts.pop();
        setCwd('/' + parts.join('/') || '/');
        newHistory.push({ type: 'output', text: '' });
      } else if (dir.startsWith('/')) {
        setCwd(dir);
        newHistory.push({ type: 'output', text: '' });
      } else {
        if (commandMap['cd projects'] && dir === 'projects') {
          setCwd(cwd + '/projects');
          newHistory.push({ type: 'output', text: '' });
        } else {
          newHistory.push({ type: 'error', text: `bash: cd: ${dir}: No such file or directory` });
        }
      }
      setHistory(newHistory);
      setInput('');
      return;
    }

    // Check custom commands from DB
    const output = commandMap[trimmed];
    if (output) {
      output.split('\n').forEach(line => newHistory.push({ type: 'output', text: line }));
      newHistory.push({ type: 'output', text: '' });
    } else {
      // Handle unknown commands
      newHistory.push({ type: 'error', text: `bash: ${trimmed.split(' ')[0]}: command not found` });
      newHistory.push({ type: 'output', text: `Try "help" for a list of available commands.` });
    }

    newHistory.push({ type: 'output', text: '' });
    setHistory(newHistory);
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const newIndex = Math.min(histIndex + 1, cmdHistory.length - 1);
        setHistIndex(newIndex);
        setInput(cmdHistory[newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIndex > 0) {
        const newIndex = histIndex - 1;
        setHistIndex(newIndex);
        setInput(cmdHistory[newIndex] || '');
      } else {
        setHistIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Basic tab completion
      const allCmds = Object.keys(commandMap);
      const matches = allCmds.filter(c => c.startsWith(input));
      if (matches.length === 1) setInput(matches[0]);
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setHistory([{ type: 'system', text: '' }]);
    }
  };

  return (
    <div
      style={{
        background: '#0a0a0a',
        border: '1px solid var(--border)',
        borderRadius: 10,
        overflow: 'hidden',
        boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
      }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Title bar */}
      <div style={{
        background: '#111',
        padding: '0.65rem 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        borderBottom: '1px solid var(--border)',
        userSelect: 'none',
      }}>
        <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff5f57' }} />
        <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#febc2e' }} />
        <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#28c840' }} />
        <span style={{ marginLeft: '0.5rem', color: 'var(--text-dim)', fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace' }}>
          res4ad@kali: {cwd}
        </span>
      </div>

      {/* Terminal output */}
      <div style={{
        padding: '1rem 1.25rem',
        minHeight: 420,
        maxHeight: 560,
        overflowY: 'auto',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '0.8rem',
        lineHeight: 1.65,
        cursor: 'text',
      }}>
        {history.map((entry, i) => (
          <div key={i} style={{
            color: entry.type === 'input' ? 'white'
              : entry.type === 'error' ? '#ff6644'
              : entry.type === 'system' ? 'var(--accent)'
              : 'var(--text-muted)',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
          }}>
            {entry.text}
          </div>
        ))}

        {/* Input line */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: 'var(--accent)', whiteSpace: 'nowrap' }}>{getPrompt()}</span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            spellCheck={false}
            autoComplete="off"
            style={{
              background: 'none',
              border: 'none',
              outline: 'none',
              color: 'white',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.8rem',
              flex: 1,
              caretColor: 'var(--accent)',
            }}
          />
          <span className="cursor-blink" style={{ width: 8, height: '1em', background: 'var(--accent)', display: 'inline-block', verticalAlign: 'middle' }} />
        </div>
        <div ref={bottomRef} />
      </div>

      {/* Status bar */}
      <div style={{
        background: '#0d0d0d',
        borderTop: '1px solid var(--border)',
        padding: '0.4rem 1.25rem',
        display: 'flex',
        gap: '1.5rem',
        fontSize: '0.7rem',
        fontFamily: 'JetBrains Mono, monospace',
      }}>
        <span style={{ color: 'var(--accent)' }}>● LIVE</span>
        <span style={{ color: 'var(--text-dim)' }}>{cwd}</span>
        <span style={{ color: 'var(--text-dim)', marginLeft: 'auto' }}>Press Tab to autocomplete • ↑↓ for history</span>
      </div>
    </div>
  );
}
