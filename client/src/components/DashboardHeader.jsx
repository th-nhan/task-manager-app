import React from 'react';
import { Bell, LogOut } from 'lucide-react';

export const DashboardHeader = ({ user, logout }) => {
    return (
        <div className="sticky top-0 bg-white p-2 flex justify-between shadow-sm z-20">
            <div className="flex items-center ml-8">
                <h1 className="text-xl font-semibold">Task</h1>
                <h1 className="text-pink-500 text-xl font-bold">Note</h1>
            </div>
            <div className="space-x-1 flex items-center mr-2">
                <div>
                    <button 
                        className="hover:bg-pink-100 rounded-full p-2 text-gray-500 transition-colors cursor-pointer"
                        title="Thông báo"
                    >
                        <Bell className="text-pink-400" />
                    </button>
                </div>
                <div className="flex items-center space-x-2 text-gray-500 hover:bg-pink-100 rounded-full p-2 cursor-pointer transition-colors">
                    {user?.avatarUrl ? (
                        <img src={user.avatarUrl} alt="Avatar" className="w-7 h-7 rounded-full object-cover" />
                    ) : (
                        <div className="w-7 h-7 rounded-full bg-pink-300 flex items-center justify-center font-bold text-xs text-white">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                    )}
                    <span className="text-sm font-medium text-pink-400">{user?.name}</span>
                </div>
                <button
                    onClick={logout}
                    title="Đăng xuất"
                    className="hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full p-2 transition-colors cursor-pointer"
                >
                    <LogOut className="w-5 h-5 text-pink-400" />
                </button>
            </div>
        </div>
    );
};

export default DashboardHeader;
