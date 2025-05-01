import { useState, useEffect } from 'react';
import { Input } from 'antd';
import axios from 'axios';

export default function MaterialIOForm({ formdata, mode, seteditmode, successmsg, updateparent, matid }) {

    console.log('Form Data:', formdata);
    
    const [formData, setFormData] = useState([{
        purpose: '',
        outward_date: new Date().toISOString().split('T')[0],
        in_stock: 0,
        outward_qty: 0,
        stock_qty: 0,
        outwarded_by: '',
    }]);

    useEffect(() => {
        if (formdata) {
            setFormData(formdata);
        }
    }, [formdata]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);

        const submissionData = {};

        mode?axios.patch(`${import.meta.env.VITE_API_BASE_URL}/updateMaterialIO`, { materialIO: formData })
            .then((response) => {
                console.log('API response:', response); // Debug log
                seteditmode(false);
                successmsg(); // Ensure this is called
                updateparent();
            })
            .catch((error) => {
                console.error('Error updating material IO:', error);
            }) : 
            
            axios.post(`${import.meta.env.VITE_API_BASE_URL}/createMaterialIO`, { materialIO: formData, material_id: matid})
            .then((response) => {
                seteditmode(false);
                successmsg();
                updateparent();
            }).catch((error) => {
                console.error('Error creating material IO:', error);
            });
    };

    const addFields = () => {
        setFormData((prevFormData) => {
            const lastStockQty = prevFormData[prevFormData.length - 1]?.stock_qty || 0;
            return [
                ...prevFormData,
                {
                    purpose: '',
                    outward_date: new Date().toISOString().split('T')[0],
                    in_stock: lastStockQty, // Set to stock_qty of the last field
                    outward_qty: 0,
                    stock_qty: lastStockQty,
                    recieved_by: '',
                    given_by: '',
                    remarks: ''
                }
            ];
        });
    };

    const removeFields = (index) => {
        console.log('Remove field at index:', index);
        if (formData.length > 1) {
            const updatedFormData = formData.filter((_, idx) => idx !== index);
            setFormData(updatedFormData);
        }
    };

    return (
        <div>
            <h1 className=''>Material IO Form</h1>
            <form>
                <div className='flex flex-col gap-2'>
                    {
                        formData.map((Data, index) => (
                            <div key={index}>
                                
                                <div className='flex flex-col gap-2'>
                                    <label htmlFor="outward_date">Outward Date:</label>
                                    <input
                                        className='rounded-lg p-1 max-w-15/100'
                                        type="date"
                                        id="outward_date"
                                        value={Data.outward_date}
                                        onChange={(e) => {
                                            const updatedData = [...formData];
                                            updatedData[index].outward_date = e.target.value;
                                            setFormData(updatedData);
                                        }}
                                    />
                                </div>

                                {/* <label htmlFor="outwarded_by">Outwarded By:</label>
                                <Input 
                                    type="text" 
                                    id="outwarded_by" 
                                    value={Data.outwarded_by} 
                                    onChange={(e) => {
                                        const updatedData = [...formData];
                                        updatedData[index].outwarded_by = e.target.value;
                                        setFormData(updatedData);
                                    }} 
                                /> */}

                                <label htmlFor="purpose">Purpose:</label>
                                <Input 
                                    type="text" 
                                    id="purpose" 
                                    value={Data.purpose} 
                                    onChange={(e) => {
                                        const updatedData = [...formData];
                                        updatedData[index].purpose = e.target.value;
                                        setFormData(updatedData);
                                    }} 
                                />

                                <label htmlFor="in_stock">In Stock:</label>
                                <Input 
                                    type="number" 
                                    id="in_stock" 
                                    value={Data.in_stock} 
                                    onChange={(e) => {
                                        const updatedData = [...formData];
                                        updatedData[index].in_stock = parseInt(e.target.value, 10) || 0;
                                        updatedData[index].stock_qty = updatedData[index].in_stock - updatedData[index].outward_qty;
                                        if (index < updatedData.length - 1) {
                                            updatedData[index + 1].in_stock = updatedData[index].stock_qty;
                                        }
                                        setFormData(updatedData);
                                    }} 
                                />

                                <label htmlFor="outward_qty">Outward Quantity:</label>
                                <Input 
                                    type="number" 
                                    id="outward_qty" 
                                    value={Data.outward_qty} 
                                    onChange={(e) => {
                                        const updatedData = [...formData];
                                        updatedData[index].outward_qty = parseInt(e.target.value, 10) || 0;
                                        updatedData[index].stock_qty = updatedData[index].in_stock - updatedData[index].outward_qty;
                                        if (index < updatedData.length - 1) {
                                            updatedData[index + 1].in_stock = updatedData[index].stock_qty;
                                        }
                                        setFormData(updatedData);
                                    }} 
                                />

                                <label htmlFor="stock_qty">Stock Quantity:</label>
                                <Input 
                                    type="number" 
                                    id="stock_qty" 
                                    value={ (Data.in_stock-Data.outward_qty) || Data.stock_qty} 
                                    onChange={(e) => {
                                        const updatedData = [...formData];
                                        updatedData[index].stock_qty = e.target.value;
                                        setFormData(updatedData);
                                    }} 
                                />

                                <label htmlFor="recieved_by">Received By:</label>
                                <Input 
                                    type="text" 
                                    id="recieved_by" 
                                    value={Data.recieved_by || ''} 
                                    onChange={(e) => {
                                        const updatedData = [...formData];
                                        updatedData[index].recieved_by = e.target.value;
                                        setFormData(updatedData);
                                    }} 
                                />

                                <label htmlFor="given_by">Given By:</label>
                                <Input 
                                    type="text" 
                                    id="given_by" 
                                    value={Data.given_by || ''} 
                                    onChange={(e) => {
                                        const updatedData = [...formData];
                                        updatedData[index].given_by = e.target.value;
                                        setFormData(updatedData);
                                    }} 
                                />

                                <label htmlFor="remarks">Remarks:</label>
                                <Input 
                                    type="text" 
                                    id="remarks" 
                                    value={Data.remarks || ''} 
                                    onChange={(e) => {
                                        const updatedData = [...formData];
                                        updatedData[index].remarks = e.target.value;
                                        setFormData(updatedData);
                                    }} 
                                />
                                
                                <button type='button' className='text-blue-500 hover:underline cursor-pointer m-2' onClick={addFields}>Add field</button>
                                <button type='button' className='text-red-500 hover:underline cursor-pointer' onClick={() => removeFields(index)}>Remove field</button>
                            </div>
                        ))
                    }
                </div>
                <button className='text-white bg-blue-600 rounded-lg p-2 hover:bg-blue-700 cursor-pointer' type="submit" onClick={handleSubmit}>Submit</button>
            </form>
        </div>
    );
}