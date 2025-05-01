import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {Table, Collapse, Row, Col, Modal, FloatButton, message} from 'antd';
import MaterialIOForm from '../forms/MaterialIOForm';
import {FaPlus} from 'react-icons/fa';
import axios from 'axios';
import { AiOutlineEdit } from 'react-icons/ai';


export default function MaterialIOList() {

    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [panelData, setPanelData] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const materialDetails = useLocation().state.stateData;

    console.log('Material Details:', materialDetails);

    const checkEditMode = (value) => {
        if(value.length === 1){
            let values = Object.values(value[0]);
            console.log('Values:', values);
            let mode = values.every((elem) => {
                if(elem === null || elem === undefined || elem === ''){
                    
                    return false;
                }
                else{
                    return true;

                }
            });

            mode ?setEditMode(true) : setEditMode(false);
            return;
        }

        else if (value.length > 1) {setEditMode(true); return;}

        else {setEditMode(false); return;}
    }

    const success = () => {
        console.log('Success message triggered'); // Debug log
        messageApi.open({
          type: 'success',
          content: 'Data saved Successfully',
          duration: 4
        });
      };

    const fetchData = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/getMaterialIO`, { material_id: materialDetails.material_id }, { timeout: 5000 });
            const data = response.data.rows;
            setData(data);
            checkEditMode(data);
            setPanelData(response.data.mi_details);
            setPanelData(prev=> ({  ...prev, iir_number: response.data.iir_number}));
            let keys = Object.keys(response.data.rows[0]);
            const columns = keys.map((elem) => {
                
                        return {
                            
                            title: elem.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
                            dataIndex: elem,
                            key: elem,
                            
                        };    
            });

            setColumns(columns);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        

        fetchData();
    }, [materialDetails.material_id]);

    const mioitems = [
        {
            key: '1',
            label: 'Material Inward outward register',
            children: <div className='flex flex-col gap-2'>
                <p>
                    <span className='font-bold'>Material Name:</span> {materialDetails.material_name}
                </p>
                <p>
                    <span className='font-bold'>Supplier Name:</span> {materialDetails.suplier_name}
                </p>
                <p>
                    <span className='font-bold'>IIR Number:</span> {panelData.iir_number}
                </p>
                <p>
                    <span className='font-bold'>Inward Date:</span> {new Date(panelData.inward_date).toLocaleDateString('en-GB')}
                </p>
                <p>
                    <span className='font-bold'>Inwarded By:</span> {panelData.inwarded_by}
                </p>
                <p>
                    <span className='font-bold'>Approved Quantity:</span> {panelData.approved_qty}
                </p>
                <p>
                    <span className='font-bold'>Rejected Quantity:</span> {panelData.rejected_qty}
                </p>
            </div>
        }
    ]
    
    const documentItems = [{
            key: '2',
            label: 'Document Details',
            children:
            <div className='flex flex-col gap-2'>
                <p>
                    <span className='font-bold'>Reference Number:</span> ISO 13485:2016 & India MDR 2017 
                </p>
                <p>
                    <span className='font-bold'>Document Number:</span>  JM-F-STR-004
                </p>
                <p>
                    <span className='font-bold'>Issue No:</span> 02
                </p>
                <p>
                    <span className='font-bold'>Effective Date:</span> 10-01-2022
                </p>
                <p>
                    <span className='font-bold'>Rev. No.:</span> 02
                </p>
                <p>
                    <span className='font-bold'>Page No.:</span> 1 of 1
                </p>
            </div>
        }
    ]

    const handleFormOpen = () => {
        setIsModalOpen(true);
    }

    return (
        <>
            <Row>
                <h1 className='text-2xl font-bold text-start ml-3 my-4'>Material Inward Outward Register</h1>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <Collapse items={mioitems} defaultActiveKey={['1']}/>
                </Col>
                <Col span={12}>
                    <Collapse items={documentItems} defaultActiveKey={['1']}/>
                </Col>

            </Row>
            <Row justify={'center'} className='mt-10'>
                <Table columns={columns} dataSource={data} />
            </Row>
            <Modal open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} width={1000}>
                <MaterialIOForm 
                    matid={materialDetails.material_id} 
                    seteditmode={setIsModalOpen} 
                    updateparent={fetchData} 
                    successmsg={success} // Ensure this is passed correctly
                    formdata={data} 
                    mode={editMode}
                />
            </Modal>
            <FloatButton type='primary' icon={editMode? <AiOutlineEdit/> :<FaPlus />} className='bottom-10 right-10' onClick={handleFormOpen} tooltip={<div className='text-white'>{`${(editMode)?'Edit':'Add'}`} Material Inward Outward Register</div>} />
        </>
    );
};

