import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/NotificationContext';
import { authApi } from '../api/authApi';
import DashboardHeader from '../components/DashboardHeader';
import {
    User,
    Mail,
    Lock,
    Camera,
    Check,
    AlertCircle,
    Shield,
    Sparkles,
    Eye,
    EyeOff,
    CheckCircle2,
    Calendar,
    Clock,
    Layers,
    ListTodo,
    CheckSquare2,
    TrendingUp,
    RefreshCw,
    Upload,
    Link as LinkIcon,
    Trash2,
    ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AVATAR_PRESETS = [
    'https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=ffd5dc',
    'https://api.dicebear.com/7.x/notionists/svg?seed=Bella&backgroundColor=ffdfba',
    'https://api.dicebear.com/7.x/notionists/svg?seed=Oliver&backgroundColor=baffc9',
    'https://api.dicebear.com/7.x/notionists/svg?seed=Luna&backgroundColor=bae1ff',
    'https://api.dicebear.com/7.x/notionists/svg?seed=Leo&backgroundColor=e8dff5',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Milo&backgroundColor=fce7f3',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Willow&backgroundColor=fbcfe8',
    'https://api.dicebear.com/7.x/micah/svg?seed=Cleo&backgroundColor=fdf2f8',
];

export const ProfilePage = () => {
    const { user, logout, updateUser } = useAuth();
    const toast = useToast();
    const fileInputRef = useRef(null);

    // Profile state
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        avatarUrl: user?.avatarUrl || '',
        hasPassword: true,
        createdAt: null,
        stats: {
            totalTasks: 0,
            categoriesCount: 0,
            todoTasks: 0,
            inProgressTasks: 0,
            doneTasks: 0,
        },
    });

    const [activeTab, setActiveTab] = useState('info'); // 'info' | 'security' | 'stats'
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isSavingAvatar, setIsSavingAvatar] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // Avatar modal / picker state
    const [showAvatarPicker, setShowAvatarPicker] = useState(false);
    const [customAvatarUrl, setCustomAvatarUrl] = useState('');

    // Password form state
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Fetch full profile info on load
    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setIsLoadingProfile(true);
        try {
            const res = await authApi.getProfile();
            if (res?.user) {
                setProfileData({
                    name: res.user.name || '',
                    email: res.user.email || '',
                    avatarUrl: res.user.avatarUrl || '',
                    hasPassword: res.user.hasPassword ?? true,
                    createdAt: res.user.createdAt,
                    stats: res.user.stats || {
                        totalTasks: 0,
                        categoriesCount: 0,
                        todoTasks: 0,
                        inProgressTasks: 0,
                        doneTasks: 0,
                    },
                });

                // Sync with auth context
                updateUser({
                    name: res.user.name,
                    email: res.user.email,
                    avatarUrl: res.user.avatarUrl,
                });
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            toast.error(error.message || 'Failed to load profile details');
        } finally {
            setIsLoadingProfile(false);
        }
    };

    // Auto save avatar directly without needing to click Save Changes
    const saveAvatarDirectly = async (newAvatarUrl) => {
        setIsSavingAvatar(true);
        try {
            const nameToSave = profileData.name?.trim() || user?.name || 'User';
            const res = await authApi.updateProfile({
                name: nameToSave,
                avatarUrl: newAvatarUrl,
            });

            if (res?.user) {
                setProfileData((prev) => ({
                    ...prev,
                    avatarUrl: res.user.avatarUrl,
                }));
                updateUser({
                    name: res.user.name,
                    avatarUrl: res.user.avatarUrl,
                });
                setShowAvatarPicker(false);
                setCustomAvatarUrl('');
                toast.success('Avatar updated successfully! ✨');
            }
        } catch (error) {
            console.error('Update avatar error:', error);
            toast.error(error.message || 'Failed to update avatar. Please try again.');
        } finally {
            setIsSavingAvatar(false);
        }
    };

    // Handle Local File Upload & Auto-compression to Base64
    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file (PNG, JPG, WebP)');
            e.target.value = '';
            return;
        }

        // Limit size to max 5MB before downscaling
        if (file.size > 5 * 1024 * 1024) {
            toast.warning('Image is too large! Please choose an image under 5MB');
            e.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = async () => {
                // Resize image to max 400x400 for crisp & lightweight avatar
                const canvas = document.createElement('canvas');
                const maxSize = 400;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxSize) {
                        height = Math.round((height * maxSize) / width);
                        width = maxSize;
                    }
                } else {
                    if (height > maxSize) {
                        width = Math.round((width * maxSize) / height);
                        height = maxSize;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
                await saveAvatarDirectly(dataUrl);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const handleSelectPresetAvatar = (url) => {
        saveAvatarDirectly(url);
    };

    const handleApplyCustomUrl = () => {
        if (!customAvatarUrl.trim()) {
            toast.warning('Please enter a valid image URL');
            return;
        }
        saveAvatarDirectly(customAvatarUrl.trim());
    };

    const handleRemoveAvatar = () => {
        saveAvatarDirectly('');
    };

    // Save Profile Information
    const handleSaveProfile = async (e) => {
        e.preventDefault();
        if (!profileData.name || profileData.name.trim().length < 2) {
            toast.error('Full name must be at least 2 characters');
            return;
        }

        setIsSavingProfile(true);
        try {
            const res = await authApi.updateProfile({
                name: profileData.name.trim(),
                avatarUrl: profileData.avatarUrl,
            });

            if (res?.user) {
                updateUser({
                    name: res.user.name,
                    avatarUrl: res.user.avatarUrl,
                });
                toast.success('Profile updated successfully! 🎉');
            }
        } catch (error) {
            console.error('Update profile error:', error);
            toast.error(error.message || 'Failed to update profile. Please try again.');
        } finally {
            setIsSavingProfile(false);
        }
    };

    // Change Password
    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (profileData.hasPassword && !passwordData.oldPassword) {
            toast.error('Please enter your current password');
            return;
        }

        if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
            toast.error('New password must be at least 6 characters');
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setIsChangingPassword(true);
        try {
            await authApi.changePassword({
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword,
            });

            toast.success('Password updated successfully! 🔒');
            setPasswordData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
            setProfileData((prev) => ({ ...prev, hasPassword: true }));
        } catch (error) {
            console.error('Change password error:', error);
            toast.error(error.message || 'Failed to update password');
        } finally {
            setIsChangingPassword(false);
        }
    };

    // Password strength computation
    const calculateStrength = (pwd) => {
        if (!pwd) return 0;
        let score = 0;
        if (pwd.length >= 6) score += 25;
        if (pwd.length >= 10) score += 25;
        if (/[0-9]/.test(pwd)) score += 25;
        if (/[^A-Za-z0-9]/.test(pwd) || /[A-Z]/.test(pwd)) score += 25;
        return score;
    };

    const pwdStrength = calculateStrength(passwordData.newPassword);
    const getStrengthLabel = () => {
        if (!passwordData.newPassword) return { text: '', color: '', bg: '' };
        if (pwdStrength <= 25) return { text: 'Weak', color: 'text-rose-500', bg: 'bg-rose-500' };
        if (pwdStrength <= 75) return { text: 'Medium', color: 'text-amber-500', bg: 'bg-amber-500' };
        return { text: 'Strong & Secure', color: 'text-emerald-500', bg: 'bg-emerald-500' };
    };
    const strengthInfo = getStrengthLabel();

    // Stats calculations
    const completionRate =
        profileData.stats.totalTasks > 0
            ? Math.round((profileData.stats.doneTasks / profileData.stats.totalTasks) * 100)
            : 0;

    const formattedJoinDate = profileData.createdAt
        ? new Date(profileData.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
          })
        : 'Recently';

    return (
        <div className="min-h-screen bg-linear-to-b from-pink-50/50 via-white to-pink-50/30 flex flex-col font-sans">
            {/* Hidden global file input for avatar uploading */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
            />

            <DashboardHeader user={user} logout={logout} activePage="profile" />

            <main className="flex-1 max-w-6xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8">
                {/* Top Navigation Bar */}
                <div className="flex items-center justify-between mb-5 sm:mb-6">
                    <Link
                        to="/dashboard"
                        className="px-3 py-2 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-colors flex items-center gap-1.5 text-xs sm:text-sm font-bold group cursor-pointer min-h-[40px]"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        <span>Back to Dashboard</span>
                    </Link>

                    <button
                        onClick={fetchProfile}
                        disabled={isLoadingProfile}
                        className="p-2.5 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
                        title="Refresh Profile"
                        aria-label="Refresh Profile"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoadingProfile ? 'animate-spin text-pink-500' : ''}`} />
                    </button>
                </div>

                {/* Hero Banner & User Summary Card */}
                <div className="relative bg-white rounded-3xl p-5 sm:p-7 md:p-8 shadow-xs border border-pink-100/80 mb-6 sm:mb-8 overflow-hidden">
                    {/* Background Glow Accents */}
                    <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-1/3 -mb-8 w-48 h-48 bg-rose-200/20 rounded-full blur-2xl pointer-events-none" />

                    <div className="relative flex flex-col md:flex-row items-center md:items-start gap-5 sm:gap-6">
                        {/* Avatar with Camera Overlay */}
                        <div className="relative group shrink-0">
                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden ring-4 ring-pink-100 shadow-md bg-linear-to-tr from-pink-400 to-rose-400 flex items-center justify-center text-white text-3xl font-black select-none relative">
                                {isSavingAvatar && (
                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center text-white z-10">
                                        <RefreshCw className="w-6 h-6 animate-spin text-white" />
                                    </div>
                                )}
                                {profileData.avatarUrl ? (
                                    <img
                                        src={profileData.avatarUrl}
                                        alt={profileData.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span>{profileData.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                                )}
                            </div>

                            {/* Camera upload button */}
                            <button
                                type="button"
                                onClick={() => setShowAvatarPicker(true)}
                                disabled={isSavingAvatar}
                                className="absolute -bottom-1.5 -right-1.5 p-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-2xl shadow-lg hover:shadow-pink-200 hover:scale-105 active:scale-95 transition-all cursor-pointer ring-4 ring-white min-w-[38px] min-h-[38px] flex items-center justify-center group-hover:bg-pink-600 disabled:opacity-50"
                                title="Change avatar"
                                aria-label="Change avatar"
                            >
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>

                        {/* User Details */}
                        <div className="flex-1 text-center md:text-left space-y-2 min-w-0">
                            <div className="flex flex-col sm:flex-row items-center sm:items-baseline justify-center md:justify-start gap-2 sm:gap-3">
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-800 tracking-tight truncate max-w-full">
                                    {profileData.name || 'User'}
                                </h1>
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-pink-100 text-pink-700 shrink-0">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>Active Member</span>
                                </span>
                            </div>

                            <p className="text-xs sm:text-sm font-medium text-gray-500 flex items-center justify-center md:justify-start gap-1.5 truncate">
                                <Mail className="w-4 h-4 text-pink-400 shrink-0" />
                                <span className="truncate">{profileData.email}</span>
                            </p>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4 pt-1.5 text-xs font-semibold text-gray-400">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                                    <span>Joined: {formattedJoinDate}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Shield className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                                    <span>{profileData.hasPassword ? 'Password Protected' : 'Google Account'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full md:w-auto bg-pink-50/50 p-3 rounded-2xl border border-pink-100 shrink-0">
                            <div className="text-center px-2 sm:px-3 py-1">
                                <p className="text-[11px] sm:text-xs font-bold text-gray-400 uppercase tracking-wide">Tasks</p>
                                <p className="text-lg sm:text-xl font-black text-gray-800">{profileData.stats.totalTasks}</p>
                            </div>
                            <div className="text-center px-2 sm:px-3 py-1 border-x border-pink-100">
                                <p className="text-[11px] sm:text-xs font-bold text-gray-400 uppercase tracking-wide">Done</p>
                                <p className="text-lg sm:text-xl font-black text-pink-600">{profileData.stats.doneTasks}</p>
                            </div>
                            <div className="text-center px-2 sm:px-3 py-1">
                                <p className="text-[11px] sm:text-xs font-bold text-gray-400 uppercase tracking-wide">Rate</p>
                                <p className="text-lg sm:text-xl font-black text-emerald-600">{completionRate}%</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex items-center gap-1.5 sm:gap-2 mb-6 border-b border-pink-100 pb-2.5 overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => setActiveTab('info')}
                        className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer min-h-[42px] ${
                            activeTab === 'info'
                                ? 'bg-pink-500 text-white shadow-xs shadow-pink-200'
                                : 'text-gray-600 hover:text-pink-600 hover:bg-pink-50'
                        }`}
                    >
                        <User className="w-4 h-4" />
                        <span>Profile Info</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('security')}
                        className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer min-h-[42px] ${
                            activeTab === 'security'
                                ? 'bg-pink-500 text-white shadow-xs shadow-pink-200'
                                : 'text-gray-600 hover:text-pink-600 hover:bg-pink-50'
                        }`}
                    >
                        <Lock className="w-4 h-4" />
                        <span>Security & Password</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('stats')}
                        className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer min-h-[42px] ${
                            activeTab === 'stats'
                                ? 'bg-pink-500 text-white shadow-xs shadow-pink-200'
                                : 'text-gray-600 hover:text-pink-600 hover:bg-pink-50'
                        }`}
                    >
                        <TrendingUp className="w-4 h-4" />
                        <span>Activity & Stats</span>
                    </button>
                </div>

                {/* TAB 1: Profile Information */}
                {activeTab === 'info' && (
                    <div className="max-w-2xl mx-auto bg-white rounded-3xl p-5 sm:p-7 md:p-8 shadow-xs border border-pink-100">
                        <div className="flex items-center gap-3.5 mb-6">
                            <div className="p-3 bg-pink-50 rounded-2xl text-pink-600 shrink-0">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-base sm:text-lg font-black text-gray-800">Account Information</h2>
                                <p className="text-xs text-gray-400">Update your personal account display name</p>
                            </div>
                        </div>

                        <form onSubmit={handleSaveProfile} className="space-y-5">
                            {/* Name Input */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                        <User className="w-4 h-4 text-pink-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={profileData.name}
                                        onChange={(e) =>
                                            setProfileData({ ...profileData, name: e.target.value })
                                        }
                                        placeholder="Enter your full name"
                                        className="w-full pl-10 pr-4 py-3 bg-pink-50/30 border border-pink-100 rounded-2xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all min-h-[44px]"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email Input (Read-only) */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Email Address
                                    </label>
                                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        Verified
                                    </span>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        value={profileData.email}
                                        disabled
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-gray-500 cursor-not-allowed select-none min-h-[44px]"
                                    />
                                </div>
                                <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                                    Email is used for account identification and sign in, it cannot be changed.
                                </p>
                            </div>

                            {/* Save Button */}
                            <div className="pt-4 flex items-center justify-end gap-3 border-t border-pink-50">
                                <button
                                    type="submit"
                                    disabled={isSavingProfile}
                                    className="w-full sm:w-auto px-6 py-3 bg-pink-500 hover:bg-pink-600 active:scale-95 text-white font-bold text-sm rounded-2xl shadow-md shadow-pink-200 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed min-h-[44px]"
                                >
                                    {isSavingProfile ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-4 h-4" />
                                            <span>Save Changes</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* TAB 2: Security & Password */}
                {activeTab === 'security' && (
                    <div className="max-w-2xl mx-auto bg-white rounded-3xl p-5 sm:p-7 md:p-8 shadow-xs border border-pink-100">
                        <div className="flex items-center gap-3.5 mb-6">
                            <div className="p-3 bg-pink-50 rounded-2xl text-pink-600 shrink-0">
                                <Lock className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-base sm:text-lg font-black text-gray-800">
                                    {profileData.hasPassword ? 'Change Password' : 'Set Up Password'}
                                </h2>
                                <p className="text-xs text-gray-400">
                                    {profileData.hasPassword
                                        ? 'Keep your account safe by updating your password regularly'
                                        : 'Create a password to sign in directly with your email'}
                                </p>
                            </div>
                        </div>

                        {!profileData.hasPassword && (
                            <div className="mb-6 p-4 bg-amber-50 border border-amber-200/70 rounded-2xl flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                <div className="text-xs text-amber-800 leading-relaxed">
                                    <p className="font-bold mb-0.5">Google Sign-In Account</p>
                                    You currently sign in via Google. You can set a password below to also enable direct
                                    email and password sign in anytime.
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleChangePassword} className="space-y-5">
                            {/* Current Password - Only required if user has one */}
                            {profileData.hasPassword && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                            <Lock className="w-4 h-4 text-pink-400" />
                                        </div>
                                        <input
                                            type={showOldPassword ? 'text' : 'password'}
                                            value={passwordData.oldPassword}
                                            onChange={(e) =>
                                                setPasswordData({ ...passwordData, oldPassword: e.target.value })
                                            }
                                            placeholder="Enter your current password"
                                            className="w-full pl-10 pr-10 py-3 bg-pink-50/30 border border-pink-100 rounded-2xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all min-h-[44px]"
                                            required={profileData.hasPassword}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowOldPassword(!showOldPassword)}
                                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer min-w-[36px] justify-center"
                                        >
                                            {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* New Password */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                        <Lock className="w-4 h-4 text-pink-400" />
                                    </div>
                                    <input
                                        type={showNewPassword ? 'text' : 'password'}
                                        value={passwordData.newPassword}
                                        onChange={(e) =>
                                            setPasswordData({ ...passwordData, newPassword: e.target.value })
                                        }
                                        placeholder="At least 6 characters"
                                        className="w-full pl-10 pr-10 py-3 bg-pink-50/30 border border-pink-100 rounded-2xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all min-h-[44px]"
                                        required
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer min-w-[36px] justify-center"
                                    >
                                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>

                                {/* Password Strength Meter */}
                                {passwordData.newPassword && (
                                    <div className="mt-2.5 space-y-1.5">
                                        <div className="flex items-center justify-between text-[11px] font-bold">
                                            <span className="text-gray-500">Password strength:</span>
                                            <span className={strengthInfo.color}>{strengthInfo.text}</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-300 ${strengthInfo.bg}`}
                                                style={{ width: `${pwdStrength}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Confirm New Password */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                        <Lock className="w-4 h-4 text-pink-400" />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={passwordData.confirmPassword}
                                        onChange={(e) =>
                                            setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                                        }
                                        placeholder="Re-enter new password"
                                        className={`w-full pl-10 pr-10 py-3 bg-pink-50/30 border rounded-2xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 transition-all min-h-[44px] ${
                                            passwordData.confirmPassword &&
                                            passwordData.newPassword !== passwordData.confirmPassword
                                                ? 'border-rose-300 focus:ring-rose-300 focus:border-rose-300'
                                                : 'border-pink-100 focus:ring-pink-300 focus:border-pink-300'
                                        }`}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer min-w-[36px] justify-center"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>

                                {passwordData.confirmPassword && (
                                    <p
                                        className={`text-[11px] font-bold mt-1.5 flex items-center gap-1 ${
                                            passwordData.newPassword === passwordData.confirmPassword
                                                ? 'text-emerald-600'
                                                : 'text-rose-500'
                                        }`}
                                    >
                                        {passwordData.newPassword === passwordData.confirmPassword ? (
                                            <>
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                Passwords match
                                            </>
                                        ) : (
                                            <>
                                                <AlertCircle className="w-3.5 h-3.5" />
                                                Passwords do not match
                                            </>
                                        )}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4 border-t border-pink-50 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={
                                        isChangingPassword ||
                                        (passwordData.confirmPassword &&
                                            passwordData.newPassword !== passwordData.confirmPassword)
                                    }
                                    className="w-full sm:w-auto px-6 py-3 bg-pink-500 hover:bg-pink-600 active:scale-95 text-white font-bold text-sm rounded-2xl shadow-md shadow-pink-200 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed min-h-[44px]"
                                >
                                    {isChangingPassword ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                            <span>Updating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Shield className="w-4 h-4" />
                                            <span>
                                                {profileData.hasPassword ? 'Update Password' : 'Set Password'}
                                            </span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* TAB 3: Activity & Stats */}
                {activeTab === 'stats' && (
                    <div className="space-y-6">
                        {/* Metrics Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
                            <div className="bg-white p-5 rounded-3xl border border-pink-100 shadow-xs flex items-center gap-4">
                                <div className="p-3.5 bg-pink-50 rounded-2xl text-pink-500 shrink-0">
                                    <ListTodo className="w-6 h-6" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Total Tasks</p>
                                    <p className="text-2xl font-black text-gray-800">{profileData.stats.totalTasks}</p>
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-3xl border border-pink-100 shadow-xs flex items-center gap-4">
                                <div className="p-3.5 bg-emerald-50 rounded-2xl text-emerald-500 shrink-0">
                                    <CheckSquare2 className="w-6 h-6" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Completed Tasks</p>
                                    <p className="text-2xl font-black text-emerald-600">{profileData.stats.doneTasks}</p>
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-3xl border border-pink-100 shadow-xs flex items-center gap-4">
                                <div className="p-3.5 bg-amber-50 rounded-2xl text-amber-500 shrink-0">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">In Progress</p>
                                    <p className="text-2xl font-black text-amber-600">
                                        {profileData.stats.inProgressTasks}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-3xl border border-pink-100 shadow-xs flex items-center gap-4">
                                <div className="p-3.5 bg-purple-50 rounded-2xl text-purple-500 shrink-0">
                                    <Layers className="w-6 h-6" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Categories</p>
                                    <p className="text-2xl font-black text-purple-600">
                                        {profileData.stats.categoriesCount}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar & Motivation Card */}
                        <div className="bg-white p-5 sm:p-7 md:p-8 rounded-3xl border border-pink-100 shadow-xs space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-black text-gray-800">Completion Efficiency</h3>
                                    <p className="text-xs text-gray-400">Percentage of overall tasks marked as completed</p>
                                </div>
                                <span className="text-2xl font-black text-pink-600">{completionRate}%</span>
                            </div>

                            <div className="w-full h-3 bg-pink-50 rounded-full overflow-hidden p-0.5">
                                <div
                                    className="h-full bg-linear-to-r from-pink-400 to-rose-500 rounded-full transition-all duration-500"
                                    style={{ width: `${completionRate}%` }}
                                />
                            </div>

                            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-gray-500">
                                <p className="text-center sm:text-left">
                                    You have completed <span className="text-pink-600 font-bold">{profileData.stats.doneTasks}</span>{' '}
                                    out of {profileData.stats.totalTasks} total tasks.
                                </p>
                                <Link
                                    to="/dashboard"
                                    className="px-4 py-2.5 bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-xl transition-colors font-bold flex items-center gap-1.5 cursor-pointer"
                                >
                                    <span>Go to Tasks Board</span>
                                    <span>&rarr;</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* AVATAR PICKER MODAL */}
            {showAvatarPicker && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4">
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-xs animate-in fade-in"
                        onClick={() => !isSavingAvatar && setShowAvatarPicker(false)}
                    />

                    <div className="relative w-full max-w-lg bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-pink-100 z-10 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-3.5 border-b border-pink-100 mb-4 sm:mb-5">
                            <h3 className="text-base sm:text-lg font-black text-gray-800 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-pink-500" />
                                <span>Change Profile Photo</span>
                            </h3>
                            <button
                                onClick={() => setShowAvatarPicker(false)}
                                disabled={isSavingAvatar}
                                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center disabled:opacity-50"
                                aria-label="Close"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Current Avatar Quick Actions */}
                        {profileData.avatarUrl && (
                            <div className="flex items-center justify-between p-3 bg-pink-50/50 rounded-2xl border border-pink-100 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-pink-200 shrink-0">
                                        <img
                                            src={profileData.avatarUrl}
                                            alt="Current Avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <span className="text-xs font-bold text-gray-700">Current Photo</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleRemoveAvatar}
                                    disabled={isSavingAvatar}
                                    className="px-3 py-1.5 text-rose-500 hover:bg-rose-50 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Remove Photo</span>
                                </button>
                            </div>
                        )}

                        <div className="space-y-4">
                            {/* Upload local file button */}
                            <div>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isSavingAvatar}
                                    className="w-full py-3 px-4 bg-pink-50 hover:bg-pink-100 active:scale-[0.99] text-pink-700 font-bold text-xs sm:text-sm rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-pink-200/60 disabled:opacity-50 min-h-[44px]"
                                >
                                    {isSavingAvatar ? (
                                        <RefreshCw className="w-4 h-4 animate-spin text-pink-600" />
                                    ) : (
                                        <Upload className="w-4 h-4" />
                                    )}
                                    <span>Upload from Device (PNG, JPG, WebP)</span>
                                </button>
                            </div>

                            {/* Presets Grid */}
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                                    Or pick a Cute Illustrated Avatar
                                </p>
                                <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
                                    {AVATAR_PRESETS.map((preset, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => handleSelectPresetAvatar(preset)}
                                            disabled={isSavingAvatar}
                                            className={`group relative p-1.5 rounded-2xl border-2 transition-all cursor-pointer bg-pink-50/50 hover:bg-pink-100/50 hover:scale-105 active:scale-95 disabled:opacity-50 ${
                                                profileData.avatarUrl === preset
                                                    ? 'border-pink-500 ring-2 ring-pink-300 shadow-md'
                                                    : 'border-pink-100 hover:border-pink-300'
                                            }`}
                                        >
                                            <img
                                                src={preset}
                                                alt={`Preset ${idx + 1}`}
                                                className="w-full aspect-square rounded-xl object-cover"
                                            />
                                            {profileData.avatarUrl === preset && (
                                                <div className="absolute top-1 right-1 p-0.5 bg-pink-500 text-white rounded-full">
                                                    <Check className="w-3 h-3" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Direct Custom Image URL */}
                            <div className="pt-2 border-t border-pink-100">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                    Or paste an Image URL
                                </p>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <div className="relative flex-1">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <LinkIcon className="w-3.5 h-3.5 text-pink-400" />
                                        </div>
                                        <input
                                            type="url"
                                            value={customAvatarUrl}
                                            onChange={(e) => setCustomAvatarUrl(e.target.value)}
                                            placeholder="https://example.com/avatar.png"
                                            className="w-full pl-9 pr-3.5 py-2.5 bg-pink-50/30 border border-pink-100 rounded-2xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-300 min-h-[40px]"
                                            disabled={isSavingAvatar}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleApplyCustomUrl}
                                        disabled={isSavingAvatar || !customAvatarUrl.trim()}
                                        className="px-4 py-2.5 bg-pink-500 hover:bg-pink-600 active:scale-95 text-white rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50 min-h-[40px] flex items-center justify-center gap-1.5"
                                    >
                                        {isSavingAvatar ? (
                                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                        ) : (
                                            <Check className="w-3.5 h-3.5" />
                                        )}
                                        <span>Save URL</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="mt-5 pt-3 border-t border-pink-100 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setShowAvatarPicker(false)}
                                disabled={isSavingAvatar}
                                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-2xl transition-colors cursor-pointer min-h-[40px]"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
