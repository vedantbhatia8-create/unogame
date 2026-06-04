import { signOut } from '@/app/actions';
import SignInButton from './SignInButton';

export default function AuthButton({ user }) {
  if (!user) {
    return <SignInButton />;
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.15)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderRadius: 12,
        padding: '7px 8px 7px 14px',
      }}
    >
      <span
        style={{
          color: 'rgba(255,255,255,0.75)',
          fontFamily: "'Nunito', system-ui, sans-serif",
          fontWeight: 700,
          fontSize: 13,
          maxWidth: 180,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {user.email}
      </span>
      <form action={signOut}>
        <button
          type="submit"
          style={{
            border: 'none',
            cursor: 'pointer',
            background: 'rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.85)',
            fontFamily: "'Nunito', system-ui, sans-serif",
            fontWeight: 800,
            fontSize: 12,
            padding: '5px 11px',
            borderRadius: 8,
            transition: 'background .15s',
          }}
        >
          Sign out
        </button>
      </form>
    </div>
  );
}
