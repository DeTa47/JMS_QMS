import axios from "axios";
import { Table, FloatButton, Modal } from "antd";
import { AiOutlineEdit } from "react-icons/ai";
import { FaPlus } from "react-icons/fa"
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MonthlyLogBookForm from "../forms/MonthlyLogBookForm";


export default function MonthlyLogBook() {

    const logbookid = useLocation().state.logbookid;
    const status = useLocation().state.status;
    const navigate = useNavigate();

    console.log('Logbook ID:', logbookid);

    const [monthlylogbooks, setMonthlyLogBooks] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleModalClose = () => {
        message.success('Modal closed successfully');
        setIsModalOpen(false);
    };

    const fetchLogBooks = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/getmonthlylogbooks`, {logbookid: logbookid});
            console.log('Log books response:', response.data);
            setOriginalData(response.data);
            const transformedData = response.data.map((item) => ({
                logbookmid: item.log_book_monthly_id,
                logbook_date: new Date(item.logbook_date).toLocaleString('default', { month: 'long', year: 'numeric' }),
            }));
            setMonthlyLogBooks(transformedData);
        } catch (error) {
            console.error('Error fetching log books:', error);
        }
    };

    useEffect(() => {
        if (logbookid) {
            fetchLogBooks();
        }
    }, [logbookid]);

    const columns = [
        {
            key: 'logbook_date',
            title: 'Logbook Month',
            dataIndex: 'logbook_date',
        }
    ]

    return (
        <div className="mt-3 ml-3">
            <h1 className="text-2xl font-bold">Monthly Log Books</h1>
            <Table 
                columns={columns} 
                dataSource={monthlylogbooks} 
                rowClassName={() => 'hover-row cursor-pointer'}  
                onRow={(record) => ({
                    onClick: () => {
                        navigate('/logbookdata', {state: {logbookid: logbookid, logbookmid: record.logbookmid, status: status}});
                        console.log('Row clicked:', record);
                    }})}>
            </Table>
            {status !== "obsolete" && (
                <FloatButton onClick={()=>{setIsModalOpen(true)}} type="primary" shape="circle" icon={ <FaPlus/> }></FloatButton>)
            }
            <Modal 
                title="Add Monthly Log Book" 
                open={isModalOpen} 
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <MonthlyLogBookForm logbookid={logbookid} handleModalClose={handleModalClose}/>
            </Modal>
        </div>
    )

}