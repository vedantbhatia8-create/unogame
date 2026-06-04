export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { signOut } from '@/app/actions';

const ADMIN_EMAIL = 'vedantbhatia8@gmail.com';

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) redirect('/');

  const admin = createAdminClient();
  const { data: { users } } = await admin.auth.admin.listUsers({ perPage: 200 });

  const sorted = (users ?? []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <div style={{
      minHeight: '100vh', background: '#0d0a18',
      fontFamily: "'Nunito', system-ui, sans-serif",
      padding: '40px 24px', boxSizing: 'border-box',
    }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <span style={{ fontSize: 28 }}>🃏</span>
              <span style={{
                fontFamily: "'Fredoka', sans-serif", fontWeight: 700,
                color: '#fff', fontSize: 26,
              }}>UNO Admin</span>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: 700 }}>
              Signed in as {user.email}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <a href="/" style={{
              padding: '9px 18px', borderRadius: 12,
              background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)',
              fontWeight: 800, fontSize: 13, textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>← Game</a>
            <form action={signOut}>
              <button style={{
                padding: '9px 18px', borderRadius: 12, border: 'none', cursor: 'pointer',
                background: 'rgba(228,0,43,0.15)', color: '#ff6b6b',
                fontWeight: 800, fontSize: 13,
                fontFamily: "'Nunito', system-ui, sans-serif",
              }}>Sign out</button>
            </form>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Total Users', value: sorted.length, color: '#0095DA' },
            { label: 'Last 7 days', value: sorted.filter(u => new Date(u.created_at) > new Date(Date.now() - 7 * 86400000)).length, color: '#1FA84C' },
            { label: 'Last 30 days', value: sorted.filter(u => new Date(u.created_at) > new Date(Date.now() - 30 * 86400000)).length, color: '#A78BFA' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{
              background: 'rgba(255,255,255,0.05)', borderRadius: 18,
              border: '1px solid rgba(255,255,255,0.08)', padding: '20px 24px',
            }}>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontWeight: 800, fontSize: 12, letterSpacing: 1, marginBottom: 6 }}>{label.toUpperCase()}</div>
              <div style={{ color, fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 40 }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Users table */}
        <div style={{
          background: 'rgba(255,255,255,0.04)', borderRadius: 20,
          border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden',
        }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>All Users</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                  {['User', 'Joined', 'Last Sign In', 'Provider'].map(h => (
                    <th key={h} style={{
                      padding: '12px 24px', textAlign: 'left',
                      color: 'rgba(255,255,255,0.4)', fontWeight: 800,
                      fontSize: 11, letterSpacing: 1,
                    }}>{h.toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((u, i) => {
                  const provider = u.app_metadata?.provider ?? 'email';
                  const isAdmin = u.email === ADMIN_EMAIL;
                  return (
                    <tr key={u.id} style={{
                      borderTop: '1px solid rgba(255,255,255,0.05)',
                      background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                    }}>
                      <td style={{ padding: '14px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: '50%',
                            background: isAdmin ? '#E4002B' : '#2a2150',
                            display: 'grid', placeItems: 'center', fontSize: 14, flexShrink: 0,
                          }}>{isAdmin ? '👑' : '🎴'}</div>
                          <div>
                            <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>
                              {u.email}
                              {isAdmin && <span style={{ marginLeft: 8, fontSize: 10, background: '#E4002B', color: '#fff', padding: '2px 7px', borderRadius: 6, fontWeight: 900, letterSpacing: 0.5 }}>ADMIN</span>}
                            </div>
                            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 700 }}>{u.id.slice(0, 8)}…</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 24px', color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 700 }}>
                        {new Date(u.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '14px 24px', color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 700 }}>
                        {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      </td>
                      <td style={{ padding: '14px 24px' }}>
                        <span style={{
                          fontSize: 11, fontWeight: 900, letterSpacing: 0.5,
                          padding: '3px 10px', borderRadius: 8,
                          background: provider === 'google' ? 'rgba(66,133,244,0.2)' : 'rgba(255,255,255,0.08)',
                          color: provider === 'google' ? '#4285F4' : 'rgba(255,255,255,0.5)',
                        }}>{provider.toUpperCase()}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {sorted.length === 0 && (
              <div style={{ padding: '48px 24px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 14, fontWeight: 700 }}>
                No users yet.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
