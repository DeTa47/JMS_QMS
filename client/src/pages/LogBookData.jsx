import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Table, FloatButton, Modal, message } from 'antd';
import axios from 'axios';
import { AiOutlineEdit} from 'react-icons/ai';
import { FaPlus } from 'react-icons/fa';
import LogBookDataForm from '../forms/LogBookDataForm';

export default function LogBookData() {
    const { state } = useLocation();
    const { logbookid, logbookmid, status } = state;

    
    console.log('Logbook mid:', logbookmid);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [columns, setColumns] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [fields, setFields] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState(null);

    const openModalInEditMode = () => {
        setEditMode(true);
        const initialData = dataSource.map(row => ({
            case_id: row.case_id,
            fields: fields.map(field => ({
                field_id: field.log_book_field_id,
                value: row[field.log_book_field] || '',
                logbookmid: logbookmid,
            }))
        }));
        setEditData(initialData);
        setIsModalOpen(true);
    };

    const fetchData = async () => {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/getlogbookdata`, {logbookmid:logbookmid, logbookid: logbookid})
            
            const { fields, logbookfields } = response.data;

            setFields(logbookfields);
            const dynamicColumns = [
                {
                    title: 'Case ID',
                    dataIndex: 'case_id',
                    key: 'case_id',
                },
                ...logbookfields.map((field) => ({
                    title: field.log_book_field,
                    dataIndex: field.log_book_field,
                })),
            ];
            setColumns(dynamicColumns);

            
            const groupedData = fields.reduce((acc, item) => {
                const existingRow = acc.find(row => row.case_id === item.case_id);
                if (existingRow) {
                    existingRow[item.log_book_field] = item.logbook_values;
                } else {
                    acc.push({
                        case_id: item.case_id,
                        [item.log_book_field]: item.logbook_values,
                    });
                }
                return acc;
            }, []);

            setDataSource(groupedData);
            console.log('Data source: ', groupedData); // Corrected logging
        }
    

    const handleModalClose = () => {
        message.success('Data saved successfully');
        setIsModalOpen(false);
        fetchData();
    };


    useEffect(() => {
        fetchData();
    }
    , [logbookid]);

    return (
        <div className="mt-3 ml-3">
            <h1 className="text-2xl font-bold">Log Book Data</h1>
            <Table
                columns={columns}
                dataSource={dataSource}
                rowKey="case_id"
                bordered
            />
            {status !== "obsolete" && 
                (<FloatButton.Group>
                    <FloatButton onClick={() => setIsModalOpen(true)} icon={<FaPlus />} type="primary" shape='circle' tooltip={<p>Add values</p>} />
                    <FloatButton onClick={() => openModalInEditMode()} icon={<AiOutlineEdit />} type="primary" shape='circle' tooltip={<p>Edit values</p>} />
                </FloatButton.Group>)
            }
            <Modal 
                open={isModalOpen} 
                onCancel={() => setIsModalOpen(false)} // Fixed infinite re-render issue
                footer={null} 
                width={1000}
            >
                <LogBookDataForm 
                    handlemodalclose={handleModalClose} 
                    fields={fields} 
                    logbookmid={logbookmid} 
                    editMode={editMode} 
                    initialData={editData}
                />
            </Modal>
        </div>
    );
}