import React, { useState } from 'react';

interface User {
    id: string;
    name: string;
    title: string;
    avatar?: string;
}

export const NewChatPage = () => {
    const [searchText, setSearchText] = useState('');

    return (
        <div className="bg-white">
            <h1 className="text-xl font-semibold p-4 border-b border-gray-100">New message</h1>
        </div>
    );
};

export default NewChatPage; 