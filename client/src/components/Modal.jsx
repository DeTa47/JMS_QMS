import React from 'react';

export default function Modal({ children }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded shadow-lg w-full max-w-3xl max-h-screen overflow-auto">
                {children}
            </div>
        </div>
    );
}
