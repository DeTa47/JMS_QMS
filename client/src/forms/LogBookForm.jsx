import { useState, useEffect } from 'react';
import { Input, Button, Row, Col } from 'antd';
import axios from 'axios';

const LogBookForm = () => {
    const [formData, setFormData] = useState({
        equipment_id: '',
        equipment_name: '',
        make: '',
        title: '',
        logbook_date: '',
        fields: [''],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) =>  ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        console.log(formData);

        axios.post(`${import.meta.env.VITE_API_BASE_URL}/createlogbook`, formData).then((response) => {
            console.log('Logbook created successfully:', response.data);
        }).catch((error) => {
            console.error('Error creating logbook:', error);
        });
    };

    const addLogbookField = () => {
        setFormData((prevData)=>{
            const newFields = [...(prevData.fields)];
            newFields.push('');
            return {
                ...prevData,
                fields: newFields,
            };
        })
    }

    const removeLogbookField = (index) => {
        setFormData((prevData) => {
            if (prevData.fields.length > 1) {
                    
                const updatedFields = prevData.fields.filter((_, i) => i !== index);
                return {
                    ...prevData,
                    fields: updatedFields,
                };
            }
            return prevData;
        });
    }



    return (
        <div>
            <h1 className='text-2xl font-bold mb-8 cursor-default'>Create Equipment Log book</h1>
            <form onSubmit={handleSubmit}>
                <Row className='mb-4'>
                    <Col span={3}>
                        <label htmlFor='equipment_id'>Equipment ID:</label>
                    </Col>
                    <Col span={10}>
                        <Input
                            type='text'
                            name='equipment_id'
                            value={formData.equipment_id || ''}
                            onChange={handleChange}
                        />
                    </Col>
                </Row>
                <Row className='mb-4'>
                    <Col span={3}>
                        <label htmlFor='equipment_name'>Equipment Name:</label>
                    </Col>
                    <Col span={10}>
                        <Input
                            type='text'
                            name='equipment_name'
                            value={formData.equipment_name || ''}
                            onChange={handleChange}
                        />
                    </Col>
                </Row>
                <Row className='mb-4'>
                    <Col span={3}>
                        <label htmlFor='make'>Make:</label>
                    </Col>
                    <Col span={10}>
                        <Input
                            type='text'
                            name='make'
                            value={formData.make || ''}
                            onChange={handleChange}
                        />
                    </Col>
                </Row>
                <Row className='mb-4'>
                    <Col span={3}>
                        <label htmlFor='title'>Title:</label>
                    </Col>
                    <Col span={10}>
                        <Input
                            type='text'
                            name='title'
                            value={formData.title || ''}
                            onChange={handleChange}
                        />
                    </Col>
                </Row>
                
                <Row className='mb-4'>
                    <Col span={3}>
                        <label htmlFor='logbook_date'>Logbook Date:</label>
                    </Col>
                    <Col span={4}>
                        <Input
                            type='date'
                            name='logbook_date'
                            value={formData.logbook_date || ''}
                            onChange={handleChange}
                        />
                    </Col>
                </Row>
                {
                    formData.fields?.map((field, index) => (
                        <>
                            <Row key={index} className='mt-4 mb-4'>
                                <Col span={3}>
                                    <label htmlFor={`field_${index}`}>Logbook Field {index + 1}:</label>
                                </Col>
                                <Col span={10}>
                                    <Input
                                        type='text'
                                        name={`field_${index}`}
                                        value={formData.fields[index]}
                                        onChange={(e) => {
                                            const newFields = [...formData.fields];
                                            newFields[index] = e.target.value;
                                            setFormData((prevData) => ({
                                                ...prevData,
                                                fields: newFields,
                                            }));
                                        }}
                                    />
                                </Col>
                            </Row>
                            <button type='button' className='text-blue-500 hover:underline cursor-pointer m-2' onClick={addLogbookField}>Add field</button>
                            {index>0?<button type='button' className='text-red-500 hover:underline cursor-pointer m-2' onClick={() => {removeLogbookField(index)}}>Remove field</button>:null}
                        </>
                    ))
                }
                <Row>
                    <Button variant = "solid" color="primary" onClick={handleSubmit} type="submit">Submit</Button>
                </Row>
            </form>
        </div>
    );
};

export default LogBookForm;