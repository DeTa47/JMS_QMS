import React, { useState } from 'react';
import close from '../assets/exit.png';
import menu from '../assets/settings.png';

export default function UserDrawer({ setcomponent, onToggle }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDrawer = () => {
        const newState = !isOpen;
        setIsOpen(newState);
        onToggle(newState); // Notify parent about the state change
    };

    return (
        <div
            aria-label='Sidebar'
            className={`fixed top-0 left-0 h-full bg-gray-100 border-r border-gray-300 shadow transform transition-transform duration-300`}
            style={{ width: isOpen ? '250px' : '67px' }}
        >
            <button 
                onClick={toggleDrawer} 
                className="absolute top-4 left-1 px-2 py-2 z-10 hover:cursor-pointer"
            >
                <img 
                    src={isOpen ? close : menu} 
                    alt={isOpen ? 'Close' : 'Menu'} 
                    className="w-6 h-6"
                />
            </button>
            
            {isOpen && (
                <div className="my-18 gap-y-4 flex flex-col items-center">
                    <button onClick={() => setcomponent('GRN')} className="text-gray-700 hover:cursor-pointer">GRN</button>
                    <button onClick={() => setcomponent('Materials')} className="text-gray-700 hover:cursor-pointer">Materials</button>
                    <button onClick={() => setcomponent('Manufacturing')} className="text-gray-700 hover:cursor-pointer">Manufacturing</button>
                </div>
            )}
        </div>
    );
}