import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import IIRForms from '../forms/IIRForms';
import Modal from '../components/Modal';
import axios from 'axios';
import { formatDate } from '../utils/stringConversions';
import { FaPlus } from 'react-icons/fa';
import { AiOutlineEdit } from "react-icons/ai";

export default function MaterialIIRGRN() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const stateArray = state?.stateData;

    // Persist material and grnDetails in local state
    const [material, setMaterial] = useState(Array.isArray(stateArray)?stateArray?.[0] : state?.stateData.materialid);
    const [grnDetails, setGrnDetails] = useState(stateArray?.[1] || null);

    console.log("Material:", material);
    console.log("GRN Details:", grnDetails);

    useEffect(() => {
        if (!material || !grnDetails) {
            // If material or grnDetails is missing, navigate back or handle error
            console.error("Material or GRN details are missing.");
            navigate(-1); // Navigate back to the previous page
        }
    }, [material, grnDetails, navigate]);

    const [selectedComponent, setSelectedComponent] = useState('IIR');
    const [data, setData] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formType, setFormType] = useState(null);
    //const [selectedRow, setSelectedRow] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    const fetchData = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/getMaterialSupplier`, { material_id: material.material_id });
            console.log("Response data:", response.data);
            setData(response.data);
            console.log('Response data:', response.data);
        } catch (error) {
            console.error(`Error fetching ${selectedComponent} data:`, error);
        }
    };
    

    useEffect(() => {
        fetchData();
        
    }, [material?.material_id]);

    const columns = selectedComponent === 'IIR'
        ? [
            {label: 'IIR Number', key: 'iir_id'},
            { label: 'Test', key: 'test_name' },
            { label: 'Specification', key: 'specification_name' },
            { label: 'Checked By', key: 'checked_by' },
            { label: 'Approved By', key: 'approved_by' },
            { label: 'Observation 1', key: 'observation_1', type: 'checkbox' },
            { label: 'Observation 2', key: 'observation_2', type: 'checkbox' },
            { label: 'Observation 3', key: 'observation_3', type: 'checkbox' },
            { label: 'Observation 4', key: 'observation_4', type: 'checkbox' },
            { label: 'Observation 5', key: 'observation_5', type: 'checkbox' },
            { label: 'Observation 6', key: 'observation_6', type: 'checkbox' },
            
        ]
        : [
            // { label: 'Inward Date', key: 'inward_date' },
            // { label: 'Approved Quantity', key: 'approved_qty' },
            // { label: 'Rejected Quantity', key: 'rejected_qty' },
            // { label: 'Inwarded By', key: 'inwarded_by' },
        ];

    const addDataForm = () => {
        const relevantData = {
            checked_by: data[0]?.checked_by,
            approved_by: data[0]?.approved_by,
            date: data[0]?.date,
            tests: data.map(item => ({
                test_id: item.test_id || "",
                test_name_id: item.test_name_id || "",
                specification_name_id: item.specification_name_id || "",
                custom_test: item.custom_test || "",
                custom_specification: item.custom_specification || "",
                observations: [
                    item.observation_1 || "",
                    item.observation_2 || "",
                    item.observation_3 || "",
                    item.observation_4 || "",
                    item.observation_5 || "",
                    item.observation_6 || "",
                ],
            })),
        };

        setFormType(
            <Modal>
                <IIRForms 
                    setiirform={setShowForm} 
                    matid={material?.material_id} 
                    iirId={data[0]?.iir_id || null} 
                    setIirData={setData} 
                    mode={isEditMode ? "edit" : "add"}
                    initialData={relevantData}
                    test_id={data[0]?.test_id || ""}
                    fetchdata={fetchData}
                /> 
            </Modal>
        );
        setShowForm(true);
    };

    const handleRowClick = (row) => {
        setSelectedRow(row);
        setShowForm(false);
    };

    const handleEditClick = () => {
        setIsEditMode(true);
        addDataForm(); // Directly call addDataForm for editing
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* GRN Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 border-b pb-2 font-sans">Incoming Inspection report</h3>
                    <ul className="space-y-2">
                        <li className="text-sm">
                            <strong>Supplier Name:</strong> {data[0]?.supplier_name || 'N/A'}
                        </li>
                        <li className="text-sm">
                            <strong>Supplier Bill Number:</strong> {data[0]?.supplier_bill_number || 'N/A'}
                        </li>
                        <li className="text-sm">
                            <strong>Challan/Bill Number:</strong> {data[0]?.bill_number || 'N/A'}
                        </li>
                        <li className="text-sm">
                            <strong>Bill date:</strong> {formatDate(data[0]?.bill_date) || 'N/A'}
                        </li>
                        <li className="text-sm">
                            <strong>Purchase Order Number:</strong> {data[0]?.purchase_order_number || 'N/A'}
                        </li>
                        <li className="text-sm">
                            <strong>Purchase Order Date:</strong> {formatDate(data[0]?.purchase_order_date) || 'N/A'}
                        </li>
                        <li className="text-sm">
                            <strong>Checked by:</strong> {data[0]?.checked_by || 'N/A'}
                        </li>
                        <li className="text-sm">
                            <strong>Approved by:</strong> {data[0]?.approved_by || 'N/A'}
                        </li>
                    </ul>
                </div>
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 border-b pb-2 font-sans">DOCUMENT DETAILS</h3>
                    <ul className="space-y-2">
                        <li className="text-sm">
                            <strong>Reference Standard:</strong> {data[0]?.reference_standard || 'N/A'}
                        </li>
                        <li className="text-sm">
                            <strong>Document Number:</strong> {data[0]?.document_number || 'N/A'}
                        </li>
                        <li className="text-sm">
                            <strong>Effective Date:</strong> {formatDate(data[0]?.effective_date) || 'N/A'}
                        </li>
                        <li className="text-sm">
                            <strong>Issue Number:</strong> {data[0]?.issue_number || 'N/A'}
                        </li>
                        <li className="text-sm">
                            <strong>Revision Number:</strong> {data[0]?.revision_number || 'N/A'}
                        </li>
                    </ul>
                </div>
            </div> 

            {/* Materials Table */}
            <div className="mt-12 max-h-full overflow-auto">
                <DataTable
                    columns={columns}
                    data={data}
                    // actions={(row) => (
                    //     <button
                    //         onClick={() => {
                    //             setSelectedRow(row);
                    //             setIsEditMode(true);
                    //             addDataForm(); 
                    //         }}
                    //         className="text-blue-500 hover:underline cursor-pointer"
                    //     >
                    //         Edit
                    //     </button>
                    // )}
                />
            </div>

            {/* Add Button */}
            <div className="fixed bottom-6 right-6">
                {data.some(item => item.iir_id && item.test_name && item.specification_name) ? (
                    <button
                        onClick={() => {
                            setIsEditMode(true);
                            addDataForm();
                        }}
                        className="bg-white text-blue-500 p-4 rounded-full shadow-lg hover:cursor-pointer flex items-center justify-center"
                    >
                        <AiOutlineEdit size={20} />
                    </button>
                ) : (
                    <button
                        onClick={() => {
                            setIsEditMode(false);
                            addDataForm();
                        }}
                        className="bg-white text-blue-500 p-4 rounded-full shadow-lg hover:cursor-pointer flex items-center justify-center"
                    >
                        <FaPlus size={20} />
                    </button>
                )}
            </div>

            {/* Form Modal */}
            {showForm && formType}
        </div>
    );
}
