import { authApi } from '../api/authApi';
import { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ThemeSwitcher } from '../components/ThemeSwitcher';
import { useToast } from '../context/NotificationContext';
import { Alert } from '../components/Notification';
import Footer from '../components/Footer';

const Register = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { currentThemeConfig } = useTheme();
    const toast = useToast();
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authApi.register(formData);
            toast.success('Account registered successfully! Please log in.', {
                title: 'Registration Successful',
            });
            navigate('/login');
        } catch (err) {
            const errorMsg = err?.message || err?.response?.data?.message || 'Registration failed. Please try again!';
            setError(errorMsg);
            toast.error(errorMsg, {
                title: 'Registration Failed',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSucess = async (credentialResponse) => {
        try {
            const response = await authApi.googleLogin(credentialResponse.credential);
            login(response.user, response.token);
            toast.success(`Welcome, ${response.user?.name || 'user'}!`, {
                title: 'Google Login Successful',
            });
            navigate('/dashboard');
        } catch (err) {
            const errorMsg = err?.message || "Google login failed. Please try again!";
            setError(errorMsg);
            toast.error(errorMsg, {
                title: 'Google Login Failed',
            });
        }
    };

    const handleGoogleError = () => {
        const errorMsg = "Google login failed. Please try again!";
        setError(errorMsg);
        toast.error(errorMsg, {
            title: 'Authentication Error',
        });
    };

    return (
        <div className='relative flex min-h-screen min-h-[100dvh] flex-col items-center justify-center bg-[var(--bg-main)] p-3 sm:p-4 transition-colors duration-200'>
            {/* Top theme switcher */}
            <div className="absolute top-3 right-3 sm:top-5 sm:right-5 z-20">
                <ThemeSwitcher variant="dropdown" />
            </div>

            <div className='w-full max-w-md rounded-3xl bg-[var(--bg-card)] p-5 sm:p-8 card-theme-shadow border border-[var(--border-color)] transition-all duration-200'>
                <div className="flex items-center justify-center gap-1 mb-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)]">Task</span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-[var(--accent)]">Note</span>
                </div>
                <h1 className='text-lg sm:text-xl text-center font-bold text-[var(--text-muted)] mb-6 uppercase tracking-wider'>Create Account</h1>

                {error && (
                    <Alert
                        type="error"
                        message={error}
                        onClose={() => setError('')}
                        className="mb-5"
                    />
                )}

                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                    <div className="flex flex-col gap-1.5">
                        <label className='text-xs sm:text-sm font-semibold text-[var(--text-main)]'>Full Name</label>
                        <input
                            type="text"
                            name='name'
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder='e.g. John Doe'
                            className='w-full px-3.5 py-2.5 sm:py-3 border border-[var(--border-input)] bg-[var(--bg-subtle)] text-[var(--text-main)] placeholder-[var(--text-muted)]/60 rounded-xl text-sm outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-subtle)] min-h-[44px]' />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className='text-xs sm:text-sm font-semibold text-[var(--text-main)]'>Email</label>
                        <input
                            type="email"
                            name='email'
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder='e.g. john@example.com'
                            className='w-full px-3.5 py-2.5 sm:py-3 border border-[var(--border-input)] bg-[var(--bg-subtle)] text-[var(--text-main)] placeholder-[var(--text-muted)]/60 rounded-xl text-sm outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-subtle)] min-h-[44px]' />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className='text-xs sm:text-sm font-semibold text-[var(--text-main)]'>Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name='password'
                                required
                                value={formData.password}
                                onChange={handleChange}
                                placeholder='At least 6 characters'
                                className='w-full px-3.5 py-2.5 sm:py-3 pr-11 border border-[var(--border-input)] bg-[var(--bg-subtle)] text-[var(--text-main)] placeholder-[var(--text-muted)]/60 rounded-xl text-sm outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-subtle)] min-h-[44px]' />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--accent)] focus:outline-none cursor-pointer p-1 min-w-[32px] min-h-[32px] flex items-center justify-center transition-colors"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] active:scale-[0.99] py-3 font-bold text-white transition-all cursor-pointer btn-theme-shadow disabled:cursor-not-allowed disabled:opacity-60 min-h-[44px]"
                    >
                        {loading ? 'Processing...' : 'Sign Up'}
                    </button>
                </form>
                <p className="mt-4 text-center text-xs sm:text-sm text-[var(--text-muted)]">
                    Already have an account?{' '}
                    <Link to="/login" className="font-bold text-[var(--accent)] hover:opacity-85 hover:underline">
                        Log in now
                    </Link>
                </p>
                <div className="relative mt-5">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[var(--border-color)]"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-[var(--bg-card)] px-2 text-[var(--text-muted)]">Or</span>
                    </div>
                </div>
                <div className="mt-4 flex justify-center w-full overflow-hidden">
                    <GoogleLogin
                        onSuccess={handleGoogleSucess}
                        onError={handleGoogleError}
                        useProminentStyles
                        size="large"
                        text="signup_with"
                        theme={currentThemeConfig?.isDark ? 'filled_black' : 'outline'}
                        shape="rectangular"
                        logo_alignment="center"
                    />
                </div>
            </div>
            <Footer className="mt-4" />
        </div>
    );
};

export default Register;