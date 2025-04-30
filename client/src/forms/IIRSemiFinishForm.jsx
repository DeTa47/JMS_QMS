import { useState, useEffect } from 'react';
import axios from 'axios';

export default function IIRSemiFinishForm({ setiirform, matid, iirId, setIirData, mode, initialData, fetchdata }) {
    const [testNames, setTestNames] = useState([]);
    const [specificationNames, setSpecificationNames] = useState([]);

    console.log(initialData, 'initialData');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const testResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/getAllTestNames`,{headers: {response: 'application/json' }});
                const specResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/getAllSpecificationNames`, {headers: {response: 'application/json' }});

                console.log(testResponse, specResponse);

                setTestNames(testResponse.data || []); // Ensure testNames is an array
                setSpecificationNames(specResponse.data || []); // Ensure specificationNames is an array
            } catch (error) {
                console.error("Error fetching test/specification names:", error);
                setTestNames([]); // Fallback to empty array
                setSpecificationNames([]); // Fallback to empty array
            }
        };
        fetchData();
    }, []);

    const [formData, setFormData] = useState(
        initialData?.semi_iir?.length
            ? initialData.semi_iir
            :{ 
                checked_by: '',
                approved_by: '',
                date: '',
                tests: [
                    {
                        test_name_id: "",
                        specification_name_id: "",
                        custom_test: "",
                        custom_specification: ""
                    }
                ],

                semi_iir: [{
                    balloon_id: '',
                    specifications: '',
                    characteristics: '',
                    LSL: '',
                    USL: '',
                    instrument_id: '',
                    observation_1: '',
                    observation_2: '',
                    observation_3: '',
                    observation_4: '',
                    observation_5: '',
                    remarks: '',
                    document_id: 2,
                }]
            }
    );

    console.log(formData, 'formData');

    const handleTestChange = (index, field, value) => {
        const updatedTests = [...formData.tests];
        updatedTests[index][field] = value;
        setFormData(prev => ({ ...prev, tests: updatedTests }));
    };

    const handleChange = (index, e) => {
        const { name, value } = e.target;
        const updatedFormData = [...formData];
        updatedFormData[index][name] = value;
        setFormData(updatedFormData);
    };

    const handleAddFields = () => {
        setFormData(prev =>({...prev,
            semi_iir: [
                ...prev.semi_iir,
                {
                    balloon_id: '',
                    specifications: '',
                    characteristics: '',
                    LSL: '',
                    USL: '',
                    instrument_id: '',
                    observation_1: '',
                    observation_2: '',
                    observation_3: '',
                    observation_4: '',
                    observation_5: '',
                    remarks: '',
                    document_id: 2
                }
            ]
        }));
    };

    const addTest = () => {
        setFormData(prev => ({
            ...prev,
            tests: [
                ...prev.tests,
                {
                    test_name_id: "",
                    specification_name_id: "",
                    custom_test: "",
                    custom_specification: ""
                }
            ]
        })) 
    };

    const handleRemoveFields = (index) => {
        if (formData.semi_iir.length > 1) {
            const updatedFormData = formData.semi_iir.filter((_, idx) => idx !== index);
            console.log( 'updatedFormData fields', updatedFormData)
            setFormData(prev => ({ ...prev, semi_iir: updatedFormData }));
        }
    };

    const handleRemoveTests = (index) => {
        console.log(index, 'index')
        if (formData.tests.length > 1) {
            const updatedFormData = formData.tests.filter((_, idx) => idx !== index);
            setFormData(prev => ({ ...prev, tests: updatedFormData }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = mode === 'edit' ? '/updateIIR' : '/IIR';
            const payload = {
                material_id: matid,
                iir_id: iirId,
                semi_iir: formData,
            };
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, payload);
            fetchdata();
            setiirform(false);
        } catch (error) {
            console.error('Error saving semi-finish IIR data:', error);
        }
    };

    return (
        <div className="overflow-y-scroll inset-0 flex items-center justify-center">
            <div className="flex items-center justify-center">
                <div className="bg-white p-6 rounded shadow-lg w-full">
                    <h2 className="text-xl font-bold mb-4">{mode === 'edit' ? 'Edit Semi-Finish IIR' : 'Add Semi-Finish IIR'}</h2>
                    <form className="flex flex-col h-[70vh]" onSubmit={handleSubmit}>
                        <div className="flex-1 overflow-y-auto space-y-4">
                            {formData.tests?.map((test, testIndex) => (
                                
                                <div key={testIndex} className="border p-4 rounded bg-white space-y-2">
                                    <div className="grid grid-cols-2 gap-4">
                                    <select
                                            value={test.test_name_id} // Bind value to test data
                                            onChange={(e) => handleTestChange(testIndex, "test_name_id", e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded"
                                        > 
                                            <option value="">Select Test</option>
                                            {testNames.map(testName => (
                                                <option key={testName.test_name_id} value={Number(testName.test_name_id)}>
                                                    {testName.test_name}
                                                </option>
                                            ))}
                                            <option value="custom">Other</option>
                                        </select>
                                        {test.test_name_id === "custom" && (
                                            <input
                                                type="text"
                                                placeholder="Custom Test"
                                                value={test.custom_test}
                                                onChange={(e) => handleTestChange(testIndex, "custom_test", e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded"
                                            />
                                        )}
                                        <select
                                            value={test.specification_name_id} // Bind value to test data
                                            onChange={(e) => handleTestChange(testIndex, "specification_name_id", e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded"
                                        >
                                            <option value="">Select Specification</option>
                                            {specificationNames.map(spec => (
                                                <option key={spec.specification_name_id} value={Number(spec.specification_name_id)}>
                                                    {spec.specification_name}
                                                </option>
                                            ))}
                                            <option value="custom">Other</option>
                                        </select>
                                    </div>
                                    
                                </div>
                               
                            ))}
                             <div className="flex space-x-4">
                                    <button type="button" onClick={addTest} className="text-blue-500 hover:underline cursor-pointer">Add Test</button>
                                    <button type="button" onClick={() => handleRemoveTests(formData.tests.length - 1)} className="text-red-500 hover:underline cursor-pointer">Remove Test</button>
                                </div> 
                            {formData.semi_iir?.map((data, index) => (
                                <div key={index} className="border p-4 rounded bg-white space-y-2">
                                    <div>
                                        
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <label>
                                            Balloon ID
                                            <input name="balloon_id" value={data.balloon_id} onChange={(e) => handleChange(index, e)} className="w-full p-2 border border-gray-300 rounded" />
                                        </label>
                                        <label>
                                            Specifications
                                            <input name="specifications" value={data.specifications} onChange={(e) => handleChange(index, e)} className="w-full p-2 border border-gray-300 rounded" />
                                        </label>
                                        <label>
                                            Characteristics
                                            <input name="characteristics" value={data.characteristics} onChange={(e) => handleChange(index, e)} className="w-full p-2 border border-gray-300 rounded" />
                                        </label>
                                        <label>
                                            LSL
                                            <input name="LSL" value={data.LSL} onChange={(e) => handleChange(index, e)} className="w-full p-2 border border-gray-300 rounded" />
                                        </label>
                                        <label>
                                            USL
                                            <input name="USL" value={data.USL} onChange={(e) => handleChange(index, e)} className="w-full p-2 border border-gray-300 rounded" />
                                        </label>
                                        <label>
                                            Instrument ID
                                            <input name="instrument_id" value={data.instrument_id} onChange={(e) => handleChange(index, e)} className="w-full p-2 border border-gray-300 rounded" />
                                        </label>
                                        <label>
                                            Observation 1
                                            <input name="observation_1" value={data.observation_1} onChange={(e) => handleChange(index, e)} className="w-full p-2 border border-gray-300 rounded" />
                                        </label>
                                        <label>
                                            Observation 2
                                            <input name="observation_2" value={data.observation_2} onChange={(e) => handleChange(index, e)} className="w-full p-2 border border-gray-300 rounded" />
                                        </label>
                                        <label>
                                            Observation 3
                                            <input name="observation_3" value={data.observation_3} onChange={(e) => handleChange(index, e)} className="w-full p-2 border border-gray-300 rounded" />
                                        </label>
                                        <label>
                                            Observation 4
                                            <input name="observation_4" value={data.observation_4} onChange={(e) => handleChange(index, e)} className="w-full p-2 border border-gray-300 rounded" />
                                        </label>
                                        <label>
                                            Observation 5
                                            <input name="observation_5" value={data.observation_5} onChange={(e) => handleChange(index, e)} className="w-full p-2 border border-gray-300 rounded" />
                                        </label>
                                        <label>
                                            Remarks
                                            <input name="remarks" value={data.remarks} onChange={(e) => handleChange(index, e)} className="w-full p-2 border border-gray-300 rounded" />
                                        </label>
                                    </div>
                                </div>
                            ))}
                            <div className="flex space-x-4">
                                <button type="button" onClick={handleAddFields} className="text-blue-500 hover:underline cursor-pointer">Add Field</button>
                                <button type="button" onClick={() => handleRemoveFields(formData.semi_iir.length - 1)} className="text-red-500 hover:underline cursor-pointer">Remove Field</button>
                            </div>
                        </div>
                        <div className="flex space-x-4 mt-4">
                            <button 
                                type="submit" 
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer"
                            >
                                {mode === 'edit' ? 'Save Changes' : 'Save'}
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setiirform(false)} 
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
