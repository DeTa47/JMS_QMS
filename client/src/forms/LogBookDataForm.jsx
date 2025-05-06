import React, { useState } from 'react';
import { Input } from 'antd';
import axios from 'axios';

export default function LogBookDataForm({ handlemodalclose, setIsEdit, fields, logbookmid, editMode, initialData }) 
{
    const [formData, setFormData] = useState(editMode && initialData ? initialData : [{
        case_id: '',
        fields: (fields || []).map(field => ({
            field_id: field.log_book_field_id,
            value: '',
            logbookmid: logbookmid,
        }))
    }]);

    const handleAddGroup = () => {
        setFormData([
            ...formData,
            {
                case_id: '',
                fields: (fields || []).map(field => ({
                    field_id: field.log_book_field_id,
                    value: '',
                    logbookmid: logbookmid,
                }))
            }
        ]);
    };

    const handleRemoveGroup = (index) => {
        const updatedFormData = [...formData];
        updatedFormData.splice(index, 1);
        setFormData(updatedFormData);
    };

    const handleFieldChange = (groupIndex, fieldId, value) => {
        const updatedFormData = [...formData];
        const field = updatedFormData[groupIndex].fields.find(f => f.field_id === fieldId);
        if (field) {
            field.value = value;
        }
        setFormData(updatedFormData);
    };

    const handleCaseIdChange = (groupIndex, value) => {
        const updatedFormData = [...formData];
        updatedFormData[groupIndex].case_id = value;
        setFormData(updatedFormData);
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            console.log('Submission Data', formData);
            if (editMode) {
                const response = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/updatevalues`, { fields: formData });
                console.log('Logbook data updated successfully:', response.data);
            } else {
                const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/insertvalues`, { fields: formData });
                console.log('Logbook data submitted successfully:', response.data);
            }
            handlemodalclose();
        } catch (error) {
            console.error('Error submitting logbook data:', error);
            alert('Error submitting logbook data');
        }
    };

    return (
        <div>
            <h1 className='mb-2 text-xl'>Log Book Data Form</h1>
            <form>
                {formData.map((group, groupIndex) => (
                    <div key={groupIndex} className="mb-4 p-4 rounded">
                        <div>
                            <label htmlFor={`case_id_${groupIndex}`}>Case ID:</label>
                            <Input
                                type="text"
                                name={`case_id_${groupIndex}`}
                                value={group.case_id}
                                onChange={(e) => handleCaseIdChange(groupIndex, e.target.value)}
                            />
                        </div>
                        {group.fields.map((field, index) => (
                            <div key={index}>
                                <label htmlFor={`field_${groupIndex}_${field.field_id}`}>
                                    {fields.find(f => f.log_book_field_id === field.field_id)?.log_book_field}
                                </label>
                                <Input
                                    type="text"
                                    name={`field_${groupIndex}_${field.field_id}`}
                                    value={field.value}
                                    onChange={(e) =>
                                        handleFieldChange(groupIndex, field.field_id, e.target.value)
                                    }
                                />
                            </div>
                        ))}
                        {!editMode &&(
                            <button
                                type="button"
                                className="m-2 text-blue-600 hover:underline cursor-pointer"
                                onClick={handleAddGroup}
                            >
                                Add Field
                            </button>)}
                        {(groupIndex !== 0 && !editMode) && (
                            <button
                                type="button"
                                className="m-2 text-red-600 hover:underline cursor-pointer"
                                onClick={() => handleRemoveGroup(groupIndex)}
                            >
                                Remove Field
                            </button>
                        )}
                    </div>
                ))}
                
                <button
                    onClick={handleSubmit}
                    className="p-2 bg-blue-700 rounded-lg text-white mt-5 cursor-pointer hover:bg-blue-500"
                    type="submit"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}