import React from 'react';

export const LeftSidebar = () => {
    return (
        <div className="w-64 h-screen sticky top-0 bg-white shadow-sm p-4">
            <div className="space-y-4">
                {/* Profile section */}
                <div className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                    <span className="font-medium">Trang cá nhân</span>
                </div>

                {/* Navigation items */}
                <div className="space-y-2">
                    <div className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                        <div className="w-8 h-8 flex items-center justify-center">
                            🏠
                        </div>
                        <span>Trang chủ</span>
                    </div>

                    <div className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                        <div className="w-8 h-8 flex items-center justify-center">
                            👥
                        </div>
                        <span>Bạn bè</span>
                    </div>

                    <div className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                        <div className="w-8 h-8 flex items-center justify-center">
                            📸
                        </div>
                        <span>Ảnh/Video</span>
                    </div>

                    <div className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                        <div className="w-8 h-8 flex items-center justify-center">
                            🎮
                        </div>
                        <span>Trò chơi</span>
                    </div>
                </div>
            </div>
        </div>
    );
}; 