import axios from 'axios';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { IoArchive } from "react-icons/io5";
import DataTable from '../components/DataTable';

export default function EquipmentLogBooks() {
    const [activeTab, setActiveTab] = useState('Tab1');
    const [logBooks, setLogBooks] = useState([{
        log_book_name:'JMS 001 DRUM POLISH MACHINE'}
    ]);
    const [archivedLogBooks, setArchivedLogBooks] = useState([
        {
            log_book_name:'JMS 001 frozen mighty 4k' 
        },
        {
            log_book_name:'JMS 002 frozen mighty 4k' 
        }
    ]);

    let logbookcolumns = [
        {
            label: 'Log books',
            key: 'log_book_name'
        }
    ];

    let archivedLogBookscolumns = [
        {
            label: 'Archived Log books',
            key: 'log_book_name'
        }
    ];

    const archiveLogBook = (value) => {
        setLogBooks(logBooks.filter((logBook) => logBook.log_book_name !== value));
        setArchivedLogBooks([...archivedLogBooks, { log_book_name: value }]);
    }

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div aria-label="EquipmentLogBooks parent container" className="flex h-screen items-center justify-center m-0.5">
            <div aria-label="EquipmentLogBooks Details container" className="h-95/100 w-95/100 bg-blue-50 rounded-md shadow-2xl">
                <div className="flex">
                    <button
                        className={`px-4 py-2 -mb-px rounded-tl-lg ${
                            activeTab === 'Tab1' ? 'bg-neutral-50 font-bold' : 'bg-gray-200'
                        } hover:cursor-pointer`}
                        onClick={() => handleTabClick('Tab1')}
                    >
                        Active log books
                    </button>
                    <button
                        className={`px-4 py-2  -mb-px rounded-tr-lg ${
                            activeTab === 'Tab2' ? 'bg-neutral-50 font-bold' : 'bg-gray-200'
                        } hover:cursor-pointer`}
                        onClick={() => handleTabClick('Tab2')}
                    >
                       Archived log books
                    </button>
                </div>
                <div className="p-4 bg-neutral-50 h-full">
                    {activeTab === 'Tab1' && (
                        <div>
                            <DataTable
                                route={'/equipment-log-books'}
                                columns={logbookcolumns}
                                data={logBooks}
                                actions={archiveLogBook}
                                buttonName={<IoArchive className="hover:cursor-pointer hover: text-green-400 h-7 w-8" />}
                            />
                        </div>
                    )}
                    {activeTab === 'Tab2' && (
                        <div>
                            
                            <DataTable
                                route={'/equipment-log-books'}
                                columns={archivedLogBookscolumns}
                                data={archivedLogBooks}
                                  
                            />
                        
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}