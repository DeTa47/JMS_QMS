import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import back from '../assets/left-arrow.png';
import DataTable from '../components/DataTable';
import IIRForms from '../forms/IIRForms';
import GRNForms from '../forms/GRNForms';
import AddButton from '../components/AddButton';
import Modal from '../components/Modal';
import axios from 'axios';
import DocumentDetails from '../components/DocumentDetails';

export default function MaterialIIRGRN() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const material = state?.stateData;
    console.log(material);

    const [selectedComponent, setSelectedComponent] = useState('IIR');
    const [data, setData] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formType, setFormType] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    console.log(data);

    useEffect(() => {
        const fetchData = async () => {
            try {
                //const endpoint = selectedComponent === 'IIR' ? 'getIIR' : 'getgrn';
                
                const endpoint = 'getIIR'
                const response = await axios.post(`http://localhost:8080/${endpoint}`, { material_id: material.material_id });
                setData(response.data);
                console.log('Response data:', response.data);
            } catch (error) {
                console.error(`Error fetching ${selectedComponent} data:`, error);
            }
        };
        fetchData();
    }, [selectedComponent, material.material_id]);

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
        setFormType(selectedComponent === 'IIR' ? <IIRForms setiirform={setShowForm}/> : <GRNForms />);
        setShowForm(true);
    };

    const handleRowClick = (row) => {
        setSelectedRow(row);
        setShowForm(false);
    };

    const handleEditClick = () => {
        setFormType(
            selectedComponent === 'IIR' 
                ? <IIRForms 
                    setiirform={setShowForm} 
                    matid={material.material_id} 
                    setIirData={setData} 
                    mode="edit"
                    initialData={selectedRow || {}} // Fallback to an empty object
                  /> 
                : <GRNForms 
                    mode="edit"
                    material_id={material.material_id} 
                    setShowForm={setShowForm} 
                    initialData={selectedRow || {}} // Fallback to an empty object
                  />
        );
        setShowForm(true);
        setIsEditMode(true);
    };

    return (
        <div className="flex h-screen items-center justify-center">
            <div className="w-95/100 h-95/100 bg-blue-50 rounded-lg shadow-2xl p-4 relative overflow-hidden">
                <button 
                    onClick={() => navigate(-1)} 
                    className="absolute top-4 left-4 p-2 hover:cursor-pointer"
                >
                    <img src={back} alt="Back" className="h-6 w-6" />
                </button>
                <select 
                    value={selectedComponent} 
                    onChange={(e) => setSelectedComponent(e.target.value)} 
                    className="absolute top-4 right-4 p-2 border rounded bg-white"
                >
                    <option value="IIR">IIR</option>
                    {/* <option value="GRN">GRN</option> */}
                </select>
                <div className="mt-12 max-h-full overflow-auto">
                
                    <DataTable
                        columns={columns}
                        data={data}
                        actions={(row) => (
                            <>
                                <button
                                    onClick={() => handleRowClick(row)}
                                    className="text-blue-500 hover:underline cursor-pointer"
                                >
                                    View
                                </button>
                            </>
                        )}
                    />
                </div>
                {selectedRow && !showForm && (
                    <Modal>
                        <DocumentDetails
                        type={selectedComponent}
                        material_id={material.material_id}
                        iir_id={selectedRow.iir_id}
                     
                        />
                        <div className="p-4">
                            <div className="mt-4 space-y-2">
                                {Object.entries(selectedRow).map(([key, value]) => (
                                    <div key={key} className="flex items-center">
                                        <span className="font-bold mr-2">{key.replace(/_/g, ' ')}:</span>
                                        {key.startsWith('observation') ? (
                                            <input type="checkbox" checked={value === 1} readOnly />
                                        ) : (
                                            <span>{value}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={handleEditClick}
                                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => setSelectedRow(null)}
                                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </Modal>
                )}
                <AddButton
                    onclick={addDataForm}
                    classes="absolute bottom-4 right-4 hover:cursor-pointer"
                />
                {showForm && (
                    <Modal>
                        {formType}
                    </Modal>
                )}
            </div>
        </div>
    );
}
