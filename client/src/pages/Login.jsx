import { authApi } from "../api/authApi";
import { useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/NotificationContext";
import { Alert } from "../components/Notification";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const toast = useToast();
    const [formData, setFormData] = useState({ email: '', password: '' });
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
            const response = await authApi.login(formData);
            login(response.user, response.token);
            toast.success(`Chào mừng ${response.user?.name || 'bạn'} quay trở lại!`, {
                title: 'Đăng nhập thành công',
            });
            navigate('/dashboard');
        } catch (err) {
            const errorMsg = err?.message || err?.response?.data?.message || "Email hoặc mật khẩu không chính xác. Vui lòng thử lại!";
            setError(errorMsg);
            toast.error(errorMsg, {
                title: 'Đăng nhập thất bại',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSucess = async (credentialResponse) => {
        try {
            const response = await authApi.googleLogin(credentialResponse.credential);
            login(response.user, response.token);
            toast.success(`Chào mừng ${response.user?.name || 'bạn'}!`, {
                title: 'Đăng nhập Google thành công',
            });
            navigate('/dashboard');
        } catch (err) {
            const errorMsg = err?.message || "Đăng nhập Google thất bại. Vui lòng thử lại!";
            setError(errorMsg);
            toast.error(errorMsg, {
                title: 'Đăng nhập Google thất bại',
            });
        }
    };

    const handleGoogleError = () => {
        const errorMsg = "Đăng nhập Google thất bại. Vui lòng thử lại!";
        setError(errorMsg);
        toast.error(errorMsg, {
            title: 'Lỗi xác thực',
        });
    };

    return (
        <div className="flex min-h-screen justify-center items-center bg-pink-100/60 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl shadow-pink-200/30 border border-pink-100">
                <div className="flex items-center justify-center gap-1 mb-2">
                    <span className="text-2xl font-bold text-gray-800">Task</span>
                    <span className="text-2xl font-bold text-pink-500">Note</span>
                </div>
                <h1 className="text-xl text-center font-bold text-gray-600 mb-6 uppercase tracking-wider">Đăng nhập</h1>

                {error && (
                    <Alert
                        type="error"
                        message={error}
                        onClose={() => setError('')}
                        className="mb-5"
                    />
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="VD: nguyenvana@gmail.com"
                            className="text-sm border rounded-xl px-3.5 py-2.5 border-gray-200 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-200" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">Mật khẩu</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Nhập mật khẩu..."
                                className="w-full pr-10 text-sm border rounded-xl px-3.5 py-2.5 border-gray-200 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-200" />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500 focus:outline-none cursor-pointer p-1"
                                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 text-white text-sm bg-pink-400 hover:bg-pink-500 w-full rounded-xl py-3 font-semibold transition cursor-pointer shadow-md shadow-pink-200/50 disabled:cursor-not-allowed disabled:opacity-60">
                       {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </button>
                </form>
                <div className="flex justify-end mt-3">
                    <Link
                        className="text-xs text-gray-400 hover:text-pink-500 transition-colors"
                        to="/register">
                        Quên mật khẩu?
                    </Link>
                </div>
                <p className="mt-5 text-center text-sm text-gray-500">
                    Chưa có tài khoản?{' '}
                    <Link to={'/register'} className="font-semibold text-pink-500 hover:text-pink-600 hover:underline">
                        Đăng ký ngay
                    </Link>
                </p>
                <div className="relative mt-5">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-400">Hoặc</span>
                    </div>
                </div>
                <div className="mt-4 flex justify-center">
                    <GoogleLogin
                        onSuccess={handleGoogleSucess}
                        onError={handleGoogleError}
                        useProminentStyles
                        size="large"
                        text="Đăng nhập với Google"
                        theme="outline"
                        shape="rectangular"
                        logo_alignment="center"
                        className="w-full"
                        />
                </div>
            </div>
        </div>
    );
};

export default Login;