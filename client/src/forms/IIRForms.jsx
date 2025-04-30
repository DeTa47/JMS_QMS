import { useState, useEffect } from "react";
import axios from "axios";

export default function IIRForms({ setiirform, matid, iirId, setIirData, initialData, mode, testid, fetchdata}) {

    console.log("Mode", mode);

    const [formData, setFormData] = useState(
        initialData || {
            checked_by: "",
            approved_by: "",
            date: "",
            tests: [
                { test_name_id: "", specification_name_id: "", custom_test: "", custom_specification: "", observations: ["","","","","",""] }
            ]
        }
    );

    useEffect(() => {
        if (mode === "edit" && initialData) {
            setFormData({
                checked_by: initialData.checked_by || "",
                approved_by: initialData.approved_by || "",
                date: initialData.date || "",
                tests: initialData.tests.map(test => ({
                    test_id: test.test_id || "",
                    test_name_id: test.test_name_id || "",
                    specification_name_id: test.specification_name_id || "",
                    custom_test: test.custom_test || "",
                    custom_specification: test.custom_specification || "",
                    observations: test.observations || ["", "", "", "", "", ""],
                })),
            });
        }
    }, [mode, initialData]);

    const [testNames, setTestNames] = useState([]);
    const [specificationNames, setSpecificationNames] = useState([]);


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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTestChange = (index, field, value) => {
        const updatedTests = [...formData.tests];
        updatedTests[index][field] = value;
        setFormData(prev => ({ ...prev, tests: updatedTests }));
    };

    const handleObservationChange = (testIndex, obsIndex, value) => {
        const updatedTests = [...formData.tests];
        updatedTests[testIndex].observations[obsIndex] = value;
        setFormData(prev => ({ ...prev, tests: updatedTests }));
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
                    custom_specification: "",
                    observations: ["", "", "", "", "", ""]
                }
            ]
        })) 
    };

    const removeTest = () => {
        if (formData.tests.length > 1) {
            setFormData(prev => ({
                ...prev,
                tests: prev.tests.slice(0, -1)
            }));
        }
    };

    const handleSave = async () => {
        try {
            if (mode === "edit") {
                const response = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/updateIIR`, {
                    ...formData,
                    test_id: testid,
                    material_id: matid,
                    iir_id: iirId
                });
                console.log("IIR updated successfully:", response.data);
                setIirData(prev => prev.map(item => (item.iir_id === initialData.iir_id ? formData : item)));

            } else {
                const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/IIR`, {
                    ...formData,
                    material_id: matid,
                    iir_id: iirId,
                });
                console.log("IIR saved successfully:", response.data);
                setIirData(prev => Array.isArray(prev) ? [...prev, formData] : [formData]);
            }
            fetchdata();
            setiirform(false);
        } catch (error) {
            console.error("Error saving/updating IIR:", error);
        }
    };

    return (
        <div className="overflow-y-scroll inset-0 flex items-center justify-center">
            <div className="flex items-center justify-center">
                <div className="bg-white p-6 rounded shadow-lg w-full">
                    <h2 className="text-xl font-bold mb-4">IIR Form</h2>
                    <form className="flex flex-col h-[70vh]" onSubmit={(e) => e.preventDefault()}>
                        <div className="flex-1 overflow-y-auto space-y-4">
                            <input
                                type="text"
                                name="checked_by"
                                placeholder="Checked By"
                                value={formData.checked_by} // Bind value to formData
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded bg-white"
                            />
                            <input
                                type="text"
                                name="approved_by"
                                placeholder="Approved By"
                                value={formData.approved_by} // Bind value to formData
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded bg-white"
                            />
                            <input
                                type="date"
                                name="date"
                                value={formData.date} // Bind value to formData
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded bg-white"
                            />
                            {(formData.tests || []).map((test, testIndex) => ( // Ensure tests is an array
                                <div key={testIndex} className="border p-4 rounded bg-white space-y-2">
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
                                    {test.specification_name_id === "custom" && mode !== "edit" && (
                                        <input
                                            type="text"
                                            placeholder="Custom Specification"
                                            value={test.custom_specification}
                                            onChange={(e) => handleTestChange(testIndex, "custom_specification", e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                    )}
                                    <div className="grid grid-cols-2 gap-2">
                                        {test.observations.map((obs, obsIndex) => (
                                            <div key={obsIndex} className="flex flex-col">
                                                <label className="text-sm font-medium">
                                                    Observation {obsIndex + 1}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={obs}
                                                    onChange={(e) => handleObservationChange(testIndex, obsIndex, e.target.value)}
                                                    className="w-full p-2 border border-gray-300 rounded"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            
                                    <button
                                        type="button"
                                        onClick={addTest}
                                        className="text-blue-500 hover:underline cursor-pointer"
                                    >
                                        Add Test
                                    </button>
                                    <button
                                        type="button"
                                        onClick={removeTest}
                                        className="text-red-500 hover:underline cursor-pointer ml-4"
                                    >
                                        Remove Test
                                    </button>
                               
                        </div>
                        <div className="flex space-x-4 mt-4">
                            <button
                                type="button"
                                onClick={handleSave}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer"
                            >
                                Save
                            </button>
                            <button
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