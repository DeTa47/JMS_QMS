import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Table, FloatButton, Modal, message } from 'antd';
import axios from 'axios';
import { AiOutlineEdit} from 'react-icons/ai';
import { FaPlus } from 'react-icons/fa';
import LogBookDataForm from '../forms/LogBookDataForm';

export default function LogBookData() {
    const { state } = useLocation();
    const { logbookdata, logbookmid } = state;

    console.log('Logbook data:', logbookdata);
    console.log('Logbook mid:', logbookmid);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [columns, setColumns] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [fields, setFields] = useState([]);

    const handleModalClose = () => {
        message.success('Modal closed successfully');
        setIsModalOpen(false);
    };

    useEffect(() => {
        if (logbookdata) {
            const { fields, logbookfields } = logbookdata;

            setFields(logbookfields);
            // Create columns dynamically
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

            // Create rows dynamically
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
    }, [logbookdata]);

    return (
        <div className="mt-3 ml-3">
            <h1 className="text-2xl font-bold">Log Book Data</h1>
            <Table
                columns={columns}
                dataSource={dataSource}
                rowKey="case_id"
                bordered
            />
            <FloatButton onClick={() => setIsModalOpen(true)} icon={<FaPlus />} type="primary" shape='circle' tooltip={<p>Add values</p>} />
            <Modal 
                open={isModalOpen} 
                onCancel={() => setIsModalOpen(false)} // Fixed infinite re-render issue
                footer={null} 
                width={1000}
            >
                <LogBookDataForm handlemodalclose={handleModalClose} fields={logbookdata.logbookfields} logbookmid={logbookmid}></LogBookDataForm>
            </Modal>
        </div>
    );
}