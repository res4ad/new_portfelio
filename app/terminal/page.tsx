import type { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import TerminalClient from './TerminalClient';

export const metadata: Metadata = {
  title: 'Interactive Terminal',
  description: 'A simulated Linux terminal environment. Try common commands like whoami, ls, nmap, and more.',
};

async function getCommands() {
  const { data } = await supabase
    .from('terminal_commands')
    .select('command,output')
    .eq('is_active', true)
    .order('sort_order');
  return data || [];
}

export default async function TerminalPage() {
  const commands = await getCommands();
  const commandMap: Record<string, string> = {};
  commands.forEach((c: { command: string; output: string }) => {
    commandMap[c.command] = c.output;
  });

  return (
    <div style={{ paddingTop: 80 }}>
      <section className="grid-bg" style={{ padding: '4rem 1.5rem 3rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent)', fontSize: '0.78rem', marginBottom: '0.75rem' }}>{'// terminal.exe'}</p>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
            Interactive Terminal
          </h1>
          <div className="section-divider" />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '1rem' }}>
            Simulated Linux environment. Type <code style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent)', background: 'rgba(0,255,136,0.08)', padding: '0.1em 0.4em', borderRadius: 4, fontSize: '0.9em' }}>help</code> to see available commands.
          </p>
        </div>
      </section>

      <section style={{ padding: '2rem 1.5rem 4rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <TerminalClient commandMap={commandMap} />
        </div>
      </section>
    </div>
  );
}
