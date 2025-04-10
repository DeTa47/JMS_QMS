import { useState, useEffect } from "react";
import axios from "axios";

export default function IIRForms({ setiirform, matid, setIirData, initialData, mode }) {


    const [formData, setFormData] = useState(
        initialData
            ? [initialData] : {
                checked_by: "",
                approved_by: "",
                date: "",
                tests: [
                    { test_name_id: "", specification_name_id: "", custom_test: "", custom_specification: "", observations: [0, 0, 0, 0, 0, 0] }
                ]
            }
    );

    const [testNames, setTestNames] = useState([]);
    const [specificationNames, setSpecificationNames] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const testResponse = await axios.get('http://localhost:8080/getAllTestNames',{headers: {response: 'application/json' }});
                const specResponse = await axios.get('http://localhost:8080/getAllSpecificationNames', {headers: {response: 'application/json' }});
                console.log(testResponse);
                console.log(specResponse);
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

    const handleCheckboxChange = (testIndex, checkboxIndex) => {
        const updatedTests = [...formData.tests];
        updatedTests[testIndex].observations[checkboxIndex] = updatedTests[testIndex].observations[checkboxIndex] === 1 ? 0 : 1;
        setFormData(prev => ({ ...prev, tests: updatedTests }));
    };

    const addTest = () => {
        setFormData(prev => ({
            ...prev,
            tests: [...prev.tests, { test_name_id: "", specification_name_id: "", custom_test: "", custom_specification: "", observations: [0, 0, 0, 0, 0, 0] }]
        }));
    };

    const handleSave = async () => {
        try {
            const response = await axios.post('http://localhost:8080/IIR', {
                ...formData,
                material_id: matid
            });
            console.log("IIR saved successfully:", response.data);
            setIirData(prev => Array.isArray(prev) ? [...prev, formData] : [formData]);
            setiirform(false);
        } catch (error) {
            console.error("Error saving IIR:", error);
        }
    };

    return (
        <div className="overflow-y-scroll inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="flex items-center justify-center">
                <div className="bg-white p-6 rounded shadow-lg w-full">
                    <h2 className="text-xl font-bold mb-4">IIR Form</h2>
                    <form className="flex flex-col h-[70vh]" onSubmit={(e) => e.preventDefault()}>
                        <div className="flex-1 overflow-y-auto space-y-4">
                            <input
                                type="text"
                                name="checked_by"
                                placeholder="Checked By"
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded bg-white"
                            />
                            <input
                                type="text"
                                name="approved_by"
                                placeholder="Approved By"
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded bg-white"
                            />
                            <input
                                type="date"
                                name="date"
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded bg-white"
                            />
                            {formData.tests.map((test, testIndex) => (
                                <div key={testIndex} className="border p-4 rounded bg-white space-y-2">
                                    <select
                                        value={test.test_name_id}
                                        onChange={(e) => handleTestChange(testIndex, "test_name_id", e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded"
                                    >
                                        <option value="">Select Test</option>
                                        {testNames.map(testName => (
                                            <option key={testName.test_name_id} value={testName.test_name_id}>
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
                                        value={test.specification_name_id}
                                        onChange={(e) => handleTestChange(testIndex, "specification_name_id", e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded"
                                    >
                                        <option value="">Select Specification</option>
                                        {specificationNames.map(spec => (
                                            <option key={spec.specification_name_id} value={spec.specification_name_id}>
                                                {spec.specification_name}
                                            </option>
                                        ))}
                                        <option value="custom">Other</option>
                                    </select>
                                    {test.specification_name_id === "custom" && mode!=="edit" (
                                        <input
                                            type="text"
                                            placeholder="Custom Specification"
                                            value={test.custom_specification}
                                            onChange={(e) => handleTestChange(testIndex, "custom_specification", e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                    )}
                                    <div className="flex space-x-2">
                                        {test.observations.map((obs, obsIndex) => (
                                            <label key={obsIndex} className="flex items-center space-x-1">
                                                <input
                                                    type="checkbox"
                                                    checked={obs === 1}
                                                    onChange={() => handleCheckboxChange(testIndex, obsIndex)}
                                                />
                                                <span>Obs {obsIndex + 1}</span>
                                            </label>
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