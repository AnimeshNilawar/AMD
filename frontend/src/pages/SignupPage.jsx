import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { signup, error } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await signup(email, password, { full_name: fullName });
            navigate('/');
        } catch {
            // error is handled by context
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-cream flex items-center justify-center px-4">
            <div className="w-full max-w-[400px] animate-fade-in-up">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div
                        className="font-display text-[32px] font-bold text-forest cursor-pointer inline-block"
                        onClick={() => navigate('/')}
                    >
                        Wander<span className="text-terra">AI</span>
                    </div>
                    <p className="text-[13px] text-muted mt-1">Create your account to start exploring</p>
                </div>

                {/* Card */}
                <div className="bg-warm border border-border rounded-2xl p-7 shadow-sm">
                    <h2 className="font-display text-[22px] font-semibold text-text-primary mb-5">Create account</h2>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                        <div>
                            <label className="text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5 block">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="John Doe"
                                required
                                className="w-full border-[1.5px] border-border bg-sand rounded-xl px-4 py-2.5 text-[13px] font-body text-text-primary outline-none transition-colors focus:border-forest placeholder:text-muted"
                            />
                        </div>

                        <div>
                            <label className="text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5 block">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full border-[1.5px] border-border bg-sand rounded-xl px-4 py-2.5 text-[13px] font-body text-text-primary outline-none transition-colors focus:border-forest placeholder:text-muted"
                            />
                        </div>

                        <div>
                            <label className="text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5 block">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Min. 6 characters"
                                required
                                minLength={6}
                                className="w-full border-[1.5px] border-border bg-sand rounded-xl px-4 py-2.5 text-[13px] font-body text-text-primary outline-none transition-colors focus:border-forest placeholder:text-muted"
                            />
                        </div>

                        {error && (
                            <div className="bg-crowd-high-bg border border-crowd-high/20 rounded-xl px-3.5 py-2.5 text-[12px] text-crowd-high font-medium">
                                ⚠️ {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-forest text-white rounded-xl py-3 text-[13px] font-semibold cursor-pointer border-none hover:bg-forest-mid transition-all font-body disabled:opacity-50 disabled:cursor-not-allowed mt-1"
                        >
                            {submitting ? 'Creating account…' : 'Create Account'}
                        </button>
                    </form>

                    <div className="text-center mt-5 text-[12px] text-muted">
                        Already have an account?{' '}
                        <Link to="/login" className="text-forest font-semibold hover:underline">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
