import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GRNForms from '../forms/GRNForms';
import AddButton from '../components/AddButton';
import Modal from '../components/Modal';
import axios from 'axios';
import { AiOutlineEdit } from "react-icons/ai";
import { formatDate } from '../utils/stringConversions';

export default function GRN() {
    const { state } = useLocation();
    const [grnDetails, setGrnDetails] = useState({});
    const [materials, setMaterials] = useState([]);

    const navigate = useNavigate();
    
    const [documentValues, setDocumentValues] = useState({});
    const [footerValues, setFooterValues] = useState({});

    const grn = state?.stateData?.grn_id; 

    const [showEditForm, setShowEditForm] = useState(false);

    const fetchData = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/getgrn`, { grn_id: grn });
            const responseData = response.data;

            const supplier = responseData.materials[0].supplier_name || 'N/A'; // Default to 'N/A' if supplier_name is not available

            console.log('Response data:', responseData);
            const { ...grnDetails } = responseData;

            setGrnDetails({ ...grnDetails.grnDetails, supplier }); // Add supplier to grnDetails
            setMaterials(responseData.materials || []);
            setDocumentValues({
                
                "reference_standard": responseData.documents.reference_standard,
                "document_number": responseData.documents.document_number,
                "effective_date": formatDate(responseData.documents.effective_date),
                "issue_number": responseData.documents.issue_number,
                "revision_number": responseData.documents.revision_number,
            })
            setFooterValues({
                effective_date: formatDate(responseData.documents.effective_date),
                company_seal: responseData.documents.company_seal,
                prepared_by: responseData.documents.prepared_by,
                prepared_date: formatDate(responseData.documents.prepared_date),
                prepared_sign: responseData.documents.prepared_sign,
                reviewed_by: responseData.documents.reviewed_by,
                reviewed_date: formatDate(responseData.documents.reviewed_date),
                reviewed_sign: responseData.documents.reviewed_sign,
                approved_by: responseData.documents.approved_by,
                approved_date: formatDate(responseData.documents.approved_date),
                approved_sign: responseData.documents.approved_sign,
            });

            console.log('Response data:', responseData);
        } catch (error) {
            console.error('Error fetching GRN materials data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [grn]);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* GRN Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 border-b pb-2 font-sans">GOODS RECIEVE NOTE</h3>
                    <ul className="space-y-2">
                        
                        <li className="text-sm">
                            <strong>Supplier:</strong> {grnDetails.supplier}
                        </li>
                        <li className="text-sm">
                            <strong>Supplier Bill Number:</strong> {grnDetails.supplier_bill_number}
                        </li>
                        <li className="text-sm">
                            <strong>Challan/Bill Number:</strong> {grnDetails.bill_number}
                        </li>
                        <li className="text-sm">
                            <strong>Bill date:</strong> {formatDate(grnDetails.bill_date)}
                        </li>
                        <li className="text-sm">
                            <strong>Purchase Order Number:</strong> {grnDetails.purchase_order_number}
                        </li>
                        <li className="text-sm">
                            <strong>Purchase Order Date:</strong> {formatDate(grnDetails.purchase_order_date)}
                        </li>
                        <li className="text-sm">
                            <strong>Prepared by:</strong> {grnDetails.prepared_by}
                        </li>
                        <li className="text-sm">
                            <strong>Approved by:</strong> {grnDetails.approved_by}
                        </li>
                    </ul>
                </div>
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 border-b pb-2 font-sans">DOCUMENT DETAILS</h3>
                    <ul className="space-y-2">
                        <li className="text-sm">
                            <strong>Reference Standard:</strong> {documentValues.reference_standard || 'N/A'}
                        </li>
                        <li className="text-sm">
                            <strong>Document Number:</strong> {documentValues.document_number || 'N/A'}
                        </li>
                        <li className="text-sm">
                            <strong>Effective Date:</strong> {documentValues.effective_date || 'N/A'}
                        </li>
                        <li className="text-sm">
                            <strong>Issue Number:</strong> {documentValues.issue_number || 'N/A'}
                        </li>
                        <li className="text-sm">
                            <strong>Revision Number:</strong> {documentValues.revision_number || 'N/A'}
                        </li>
                    </ul>
                </div>
            </div>

            {/* Materials Table */}
            <div className="overflow-x-auto mb-6">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                                Name of Material
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                                Quantity Received
                            </th>

                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                                Rejection
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                                Released Quantity
                            </th>

                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                                IIR No.
                            </th>
                                 
                        </tr>
                    </thead>
                    <tbody>
                        {materials.map((material, index) => (
                            <tr
                                key={index}
                                className={`hover:bg-gray-100 cursor-pointer ${
                                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                }`}
                                onClick={() => {navigate('/material-iir', { state: { stateData: [material, grnDetails] }})}}
                            >
                                {/* Material Name */}
                                <td className="px-4 py-2 text-sm text-gray-700 border-b">
                                    {material.material_name}
                                </td>

                                {/* Quantity Received */}
                                <td className="px-4 py-2 text-sm text-gray-700 border-b">
                                    {material.approved_qty + material.rejected_qty}
                                </td>

                                {/* Rejected Quantity */}
                                <td className="px-4 py-2 text-sm text-gray-700 border-b">
                                    {material.rejected_qty}
                                </td>
                                
                                {/* Released Quantity */}
                                <td className="px-4 py-2 text-sm text-gray-700 border-b">
                                    {material.approved_qty}
                                </td>
                                
                                
                                {/* iir id*/}
                                <td className="px-4 py-2 text-sm text-gray-700 border-b">
                                    {`IIR - ${material.iir_iid}`}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Button */}
            <button
                className="fixed bottom-6 right-6 bg-white text-blue-500 p-4 rounded-full shadow-lg hover:cursor-pointer"
                onClick={() => setShowEditForm(true)}
            >
                <AiOutlineEdit size={20}/>
            </button>

            {/* Edit Form Modal */}
            {showEditForm && (
                <Modal onClose={() => setShowEditForm(false)}>
                    <GRNForms
                        material_id={null}
                        setShowForm={setShowEditForm}
                        initialData={{ grnDetails, materials }}
                        fetchdata = {fetchData}
                    />
                </Modal>
            )}

            {/* Footer Section */}
            {/* <div className="bg-white shadow-md rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                    <div>
                        <p className="font-semibold">Prepared by:</p>
                        <p className="text-sm">{grnDetails.prepared_by|| 'N/A'}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Approved By:</p>
                        <p className="text-sm">{grnDetails.approved_by || 'N/A'}</p>
                    </div>
                    {/* <div>
                        <p className="font-semibold">Prepared by:</p>
                        <p className="text-sm">{footerValues.prepared_sign || 'N/A'}</p>
                        <p className="text-sm">{footerValues.prepared_by || 'N/A'}</p>
                        <p className="text-sm">{footerValues.prepared_date || 'N/A'}</p>
                    </div>           
                    <div>
                        <p className="font-semibold">Reviewed By:</p>
                        <p className="text-sm">{footerValues.reviewed_sign || 'N/A'}</p>
                        <p className="text-sm">{footerValues.reviewed_by || 'N/A'}</p>
                        <p className="text-sm">{footerValues.reviewed_date || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Approved By:</p>
                        <p className="text-sm">{footerValues.approved_sign || 'N/A'}</p>
                        <p className="text-sm">{footerValues.approved_by || 'N/A'}</p>
                        <p className="text-sm">{footerValues.approved_date || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Company Seal:</p>
                        <p className="text-sm">{footerValues.company_seal || 'N/A'}</p>
                    </div> 
                </div>
            </div> */}
        </div>
    );
}