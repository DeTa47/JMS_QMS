import { useState, useEffect } from 'react';
import axios from 'axios';

export default function DocumentDetails({ type, material_id, iir_id, grn_id }) {
    const [documentDetails, setDocumentDetails] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post('http://localhost:8080/getDocumentDetails', {
                    document_type: type,
                    material_id: material_id,
                    iir_id: iir_id,
                    grn_id: 1
                });
                setDocumentDetails(response.data);
                console.log('Response data:', response.data);
            } catch (error) {
                console.error(`Error fetching ${type} data:`, error);
            }
        };
        fetchData();
    }, [type, material_id, iir_id, grn_id]);

    return (
        <>
            <h1>Document type: {type}</h1>
            {documentDetails.map((doc, index) => (
                <div key={index}>
                    <p>Reference Standards: {doc.reference_standard}</p>
                    <p>Document number: {doc.document_number}</p>
                    <p>Issue number: {doc.issue_number}</p>
                    <p>Effective date: {doc.effective_date}</p>
                </div>
            ))}
        </>
    );
}