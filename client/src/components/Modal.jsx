import React from 'react';

export default function Modal({ children }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-1/2 max-h-screen overflow-auto">
                {children}
            </div>
        </div>
    );
}
