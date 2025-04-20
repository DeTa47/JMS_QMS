import React, { useState, useEffect } from 'react';
import close from '../assets/exit.png';
import menu from '../assets/settings.png';
import { IoIosArrowForward } from "react-icons/io";

export default function UserDrawer({ setcomponent, onToggle, isOpen }) {

    const [ManufacturingList, setShowManufacturingList] = useState(false);

    useEffect(() => {
        // Close the drawer when the screen size changes to desktop
        const handleResize = () => {
            if (window.innerWidth > 768) {
                onToggle(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [onToggle]);

    return (
        <div
            aria-label="Sidebar"
            className={`fixed top-0 left-0 h-full bg-gray-100 border-r border-gray-300 shadow-lg transform transition-transform duration-300 z-40 ${
                isOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            style={{ width: "250px" }}
        >
            {/* Close Button */}
            {isOpen && (
                <button 
                    onClick={() => onToggle(false)} 
                    className="absolute top-4 left-4 px-2 py-2 z-50 hover:cursor-pointer"
                >
                    <img 
                        src={close} 
                        alt="Close" 
                        className="w-6 h-6"
                    />
                </button>
            )}

            {!isOpen && (
                <button 
                    onClick={() => onToggle(!isOpen)} 
                    className="absolute top-4 left-1 px-2 py-2 z-10 hover:cursor-pointer"
                >
                    <img 
                        src={isOpen ? close : menu} 
                        alt={isOpen ? 'Close' : 'Menu'} 
                        className="w-6 h-6"
                    />
                </button>
            )}
            
            {isOpen && (
                <>
                    <h1 className="text-center text-xl font-bold mt-6">Menu</h1>
                    <div className="flex flex-col items-center mt-10 space-y-4">
                        <button onClick={() => setcomponent('GRN')} className="text-gray-700 hover:cursor-pointer">GRN</button>
                        <button onClick={() => setcomponent('Materials')} className="text-gray-700 hover:cursor-pointer">Materials</button>
                        <button onClick={()=> setShowManufacturingList(!ManufacturingList)}  className='text-gray-700 flex flex-col items-center hover:cursor-pointer transform-flat'>
                            <div flex className='flex flex-row items-center gap-1'>
                                <IoIosArrowForward className={`text-gray-700 ${ManufacturingList ? 'rotate-90' : ''}`} />
                                Manufacturing 
                            </div>
                            { ManufacturingList ? (
                            
                                <button onClick={() => setcomponent('EquipmentLogBooks')} className="text-gray-700 text-sm ml-15 translate-y-1/2 hover:cursor-pointer">Equipment Log Books</button>) 
                                : null
                                
                            }
                            
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}