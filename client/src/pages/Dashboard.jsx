import { useState } from "react";
import UserDrawer from "../components/UserDrawer";
import Materials from '../components/Materials';
import Manufacturing from '../components/Manufacturing';
import GRNList from "./GRNList";

export default function Dashboard() {
    const [component, setComponent] = useState('GRN');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex">
            <UserDrawer 
                setcomponent={setComponent} 
                onToggle={setIsSidebarOpen} 
            />
            <div 
                className="flex-1 transition-all duration-300" 
                style={{ marginLeft: isSidebarOpen ? '250px' : '67px' }}
            >
                {
                    component === 'GRN' ?
                    <GRNList /> :
                    component === 'Materials' ?
                    <Materials /> : 
                    component === 'Manufacturing' ? 
                    <Manufacturing /> : 
                    null
                }
            </div>
        </div>
    );
}