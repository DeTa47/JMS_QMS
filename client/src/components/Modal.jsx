import React from 'react';

export default function Modal({ children, onClose }) {
    return (
        <div className="fixed inset-0  bg-opacity-25 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-1/2 max-h-screen overflow-auto">
                {children}
                
            </div>
        </div>
    );
}
