import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import IIRForms from '../forms/IIRForms';
import IIRSemiFinishForm from '../forms/IIRSemiFinishForm';
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

    const [selectedComponent, setSelectedComponent] = useState('IIR');
    const [data, setData] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formType, setFormType] = useState(null);
    //const [selectedRow, setSelectedRow] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [additionalData, setAdditionalData] = useState([]);
    const [selectOption, setSelectOption] = useState("Normal");

    useEffect(() => {
        if (!material || !grnDetails) {
            // If material or grnDetails is missing, navigate back or handle error
            console.error("Material or GRN details are missing.");
            navigate(-1); // Navigate back to the previous page
        }
    }, [material, grnDetails, navigate]);

    const fetchData = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/getIIR`, { material_id: material.material_id });
            console.log("Response data:", response.data);
            setData(response.data);

            // Extract additionalData if present
            if (response.data[1]?.additionalData) {
                setAdditionalData(response.data[1].additionalData);
            } else {
                setAdditionalData([]);
            }
        } catch (error) {
            console.error(`Error fetching ${selectedComponent} data:`, error);
        }
    };

    useEffect(() => {
        fetchData();
        
    }, [material?.material_id]);

    
    const additionalColumns = data[0]?.iir_type === "semi-finish" ? [
        {   label: 'Test Name', key: 'test_name'},
        {   label: 'Specification Name', key: 'specification_name' }
    ] : []

    const columns = data[0]?.iir_type === "semi-finish" ? [
        { label: 'IIR Number', key: 'iir_id' },
        { label: 'Specifications', key: 'specifications' },
        { label: 'Characteristics', key: 'characteristics' },
        { label: 'LSL', key: 'LSL' },
        { label: 'USL', key: 'USL' },
        { label: 'Instrument ID', key: 'instrument_id' },
        { label: 'Observation 1', key: 'observation_1', type: 'checkbox' },
        { label: 'Observation 2', key: 'observation_2', type: 'checkbox' },
        { label: 'Observation 3', key: 'observation_3', type: 'checkbox' },
        { label: 'Observation 4', key: 'observation_4', type: 'checkbox' },
        { label: 'Observation 5', key: 'observation_5', type: 'checkbox' },
        { label: 'Remarks', key: 'remarks' },
    ] 
    
    : [
        { label: 'IIR Number', key: 'iir_id' },
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
    ];

    const filteredData = data.filter((item) => !item.additionalData);

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
                {selectOption === "semi-finish" ? (
                    <IIRSemiFinishForm
                        setiirform={setShowForm}
                        matid={material?.material_id}
                        iirId={data[0]?.iir_id || null}
                        setIirData={setData}
                        mode={isEditMode ? "edit" : "add"}
                        initialData={relevantData}
                        fetchdata={fetchData}
                    />
                ) : (
                    <IIRForms
                        setiirform={setShowForm}
                        matid={material?.material_id}
                        iirId={data[0]?.iir_id || null}
                        setIirData={setData}
                        mode={isEditMode ? "edit" : "add"}
                        initialData={relevantData}
                        fetchdata={fetchData}
                    />
                )}
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
                            <strong>Supplier Batch Number:</strong> {data[0]?.supplier_batch_number || 'N/A'}
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

            {data.length === 0?
                <div className="mb-4 bg-white rounded-md shadow-lg max-w-xs p-2">
                    <label htmlFor="selectOption" className="block text-sm font-medium text-gray-700 ">
                        Select IIR Type:
                    </label>
                    <select
                        id="selectOption"
                        value={selectOption}
                        onChange={(e) => setSelectOption(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base  p-2 border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                        <option value="Normal">Normal</option>
                        <option value="semi-finish">Semi-Finish</option>
                    </select>
                </div>: null}

            {
                data.length>0 && (data[0]?.iir_type === "semi-finish" && additionalData.length > 0) ? (
                    <div className="mt-12 max-h-full max-w-full">
                        <DataTable 
                            columns={additionalColumns}
                            data={additionalData}
                        />
                    </div>
                ) : null
            }

            {data.length>0 &&
                <div className="mt-12 max-h-full max-w-full">
                    <DataTable
                        columns={columns}
                        data={data[0]?.iir_type === "semi-finish" ? filteredData : data}
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
            }



            {/* Add Button */}
            <div className="fixed bottom-6 right-6">
                {data.some(item => item.iir_id) ? (
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
