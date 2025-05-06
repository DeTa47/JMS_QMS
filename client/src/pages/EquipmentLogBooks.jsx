import axios from 'axios';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { IoArchive } from "react-icons/io5";
import DataTable from '../components/DataTable';
import { Button, Table, Input, FloatButton, Modal } from 'antd';
import {FaPlus} from 'react-icons/fa';
import LogBookForm from '../forms/LogBookForm';

export default function EquipmentLogBooks() {
    const [activeTab, setActiveTab] = useState('Tab1');
    const [logBooks, setLogBooks] = useState([]);
    const [archivedLogBooks, setArchivedLogBooks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchLogBooks = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/getlogbooks`);
                console.log('Log books response:', response.data);
                setLogBooks(response.data);
                console.log('Log books:', logBooks);
            } catch (error) {
                console.error('Error fetching log books:', error);
            }
        };
        fetchLogBooks();
    }, []);
  

    let logbookcolumns = [
        {
            key: 'title',
            title: 'Title',
            dataIndex: 'title',
        }
        
    ];

    let archivedLogBookscolumns = [
        
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
                            <Table
                                columns={logbookcolumns}
                                dataSource={logBooks}  
                                rowClassName={() => 'hover-row cursor-pointer'}
                                onRow={(record) => ({
                                    onClick: () => {
                                        console.log('Row clicked:', record);
                                        navigate('/monthlylogbooks', {state: record});
                                    },
                                })}
                                width={1000}
                            />
                        </div>
                    )}
                    {activeTab === 'Tab2' && (
                        <div>
                            
                            <Table>

                            </Table>
                        
                        </div>
                    )}  
                </div>
                <FloatButton onClick={()=>setIsModalOpen(true)} icon={<FaPlus/>} shape='circle' type='primary' tooltip={<p className='text-white'>Add Logbook</p>}/>
                <Modal open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} width={1000}>
                    <LogBookForm />
                </Modal>

            </div>
            <style>
            {`
                .hover-row:hover {
                    background-color: #f5f5f5; /* Light gray background on hover */
                    cursor: pointer;
                }
            `}
            </style>
        </div>
    );
}