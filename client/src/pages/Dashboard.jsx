import { useState } from "react";
import UserDrawer from "../components/UserDrawer";
import Materials from '../pages/Materials';
import EquipmentLogBooks from './EquipmentLogBooks';
import GRNList from "./GRNList";
import menuButton from "../assets/menuButton.svg";

export default function Dashboard() {
    const [component, setComponent] = useState('GRN');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="relative h-screen flex overflow-hidden">
            {/* Drawer */}
            <UserDrawer 
                setcomponent={setComponent} 
                onToggle={setIsSidebarOpen} 
                isOpen={isSidebarOpen} 
            />

            {/* Main Content */}
            <div className="flex-1 overflow-hidden">
                {/* Menu Button */}
                {!isSidebarOpen && (
                    <button 
                        onClick={() => setIsSidebarOpen(true)} 
                        className="absolute top-4 left-4 p-2 rounded-full shadow-md z-50"
                        aria-label="Toggle Drawer"
                    >
                        <img src={menuButton} alt="Menu Button" className="w-6 h-6 hover:cursor-pointer" />
                    </button>
                )}


                {/* Displayed Component */}
                <div className="p-4 mt-8 h-full overflow-auto">
                    {component === 'GRN' ? <GRNList /> :
                     component === 'Materials' ? <Materials /> : 
                     component === 'EquipmentLogBooks' ? <EquipmentLogBooks /> : null}
                </div>
            </div>
        </div>
    );
}