import { useState, useEffect } from "react";
import axios from "axios";

export default function GRNForms({grnid, fetchdata, setShowForm, initialData = null }) {
   
    const [formData, setFormData] = useState(
        initialData
            ? {
                  ...initialData.grnDetails,
                  document_id: 1,
              }
            : {
                  supplier_bill_number: "",
                  bill_number: "",
                  bill_date: "",
                  purchase_order_number: "",
                  purchase_order_date: "",
                  prepared_by: "",
                  approved_by: "",
                  supplier_id: "",
                  document_id: 1,
                  
              }
    );

    const [grnData, setGrnData] = useState(
        initialData ? initialData.materials.map(material => ({
            ...material,
            iir_iid: material.iir_iid || "", // Ensure iir_iid is included
        })) : [
            {
                material_name: "",
                inward_date: new Date().toISOString().slice(0, 10),
                total_quantity: "",
                approved_qty: 0,
                rejected_qty: 0,
                iir_id: "",
            },
        ]
    );

    const [error, setError] = useState("");
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        axios.post('http://localhost:8080/getSupplier', {})
            .then((response) => {
                setSuppliers(response.data.data);
            })
            .catch(error => console.error('Error fetching suppliers:', error));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleMaterialChange = (index, field, value) => {
        const updatedGrnData = [...grnData];
        updatedGrnData[index][field] = field === "approved_qty" || field === "rejected_qty" ? parseFloat(value) || 0 : value;
        setGrnData(updatedGrnData);
        setError("");
    };

    const handleSubmit = () => {
        const url = initialData
            ? `${import.meta.env.VITE_API_BASE_URL}/updategrn`
            : `${import.meta.env.VITE_API_BASE_URL}/grn`;
        const method = initialData ? axios.patch : axios.post;

        method(url, { grn_id: initialData?.grnDetails.grn_id, grnDetails: formData, materials: grnData })
            .then(() => {fetchdata(), setShowForm(false)})
            .catch((err) => console.error(err));
    };

    return (
        <div className="p-4 bg-white rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">GRN Form</h2>
            <form className="space-y-4">
                {/* Supplier Details */}
                <div>
                    <label className="block font-medium">Supplier:</label>
                    <select
                        name="supplier_id"
                        value={formData.supplier_id}
                        onChange={handleChange}
                        className="border rounded p-2 w-full"
                    >
                        <option value="">Select Supplier</option>
                        {suppliers.map((supplier) => (
                            <option key={supplier.supplier_id} value={supplier.supplier_id}>
                                {supplier.supplier_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block font-medium">Supplier Bill Number:</label>
                    <input
                        type="text"
                        name="supplier_bill_number"
                        value={formData.supplier_bill_number}
                        onChange={handleChange}
                        className="border rounded p-2 w-full"
                    />
                </div>
                <div>
                    <label className="block font-medium">Challan/Bill Number:</label>
                    <input
                        type="text"
                        name="bill_number"
                        value={formData.bill_number}
                        onChange={handleChange}
                        className="border rounded p-2 w-full"
                    />
                </div>
                <div>
                    <label className="block font-medium">Bill Date:</label>
                    <input
                        type="date"
                        name="bill_date"
                        value={formData.bill_date}
                        onChange={handleChange}
                        className="border rounded p-2 w-full"
                    />
                </div>
                <div>
                    <label className="block font-medium">Purchase Order Number:</label>
                    <input
                        type="text"
                        name="purchase_order_number"
                        value={formData.purchase_order_number}
                        onChange={handleChange}
                        className="border rounded p-2 w-full"
                    />
                </div>
                <div>
                    <label className="block font-medium">Purchase Order Date:</label>
                    <input
                        type="date"
                        name="purchase_order_date"
                        value={formData.purchase_order_date}
                        onChange={handleChange}
                        className="border rounded p-2 w-full"
                    />
                </div>
                <div>
                    <label className="block font-medium">Prepared By:</label>
                    <input
                        type="text"
                        name="prepared_by"
                        value={formData.prepared_by}
                        onChange={handleChange}
                        className="border rounded p-2 w-full"
                    />
                </div>
                <div>
                    <label className="block font-medium">Approved By:</label>
                    <input
                        type="text"
                        name="approved_by"
                        value={formData.approved_by}
                        onChange={handleChange}
                        className="border rounded p-2 w-full"
                    />
                </div>

                {/* Materials Section */}
                {grnData.map((material, index) => (
                    <div key={index} className="border p-4 rounded space-y-2 bg-white">
                        <div>
                            <label className="block font-medium">Material Name:</label>
                            <input
                                type="text"
                                value={material.material_name}
                                onChange={(e) => handleMaterialChange(index, "material_name", e.target.value)}
                                className="border rounded p-2 w-full"
                            />
                        </div>
                        <div>
                            <label className="block font-medium">Total Quantity:</label>
                            <input
                                type="text"
                                value={material.rejected_qty + material.approved_qty}
                                onChange={(e) => handleMaterialChange(index, "total_quantity", e.target.value)}
                                className="border rounded p-2 w-full"
                            />
                        </div>
                        <div>
                            <label className="block font-medium">Approved Quantity:</label>
                            <input
                                type="text"
                                value={material.approved_qty}
                                onChange={(e) => handleMaterialChange(index, "approved_qty", e.target.value)}
                                className="border rounded p-2 w-full"
                            />
                        </div>
                        <div>
                            <label className="block font-medium">Rejected Quantity:</label>
                            <input
                                type="text"
                                value={material.rejected_qty}
                                onChange={(e) => handleMaterialChange(index, "rejected_qty", e.target.value)}
                                className="border rounded p-2 w-full"
                            />
                        </div>
                        <div>
                            <label className="block font-medium">IIR Number:</label>
                            <input
                                type="text"
                                value={material.iir_iid}
                                onChange={(e) => handleMaterialChange(index, "iir_iid", e.target.value)}
                                className="border rounded p-2 w-full"
                            />
                        </div>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => {
                        const lastIirId = grnData.length > 0 ? parseInt(grnData[grnData.length - 1].iir_iid || 0, 10) : 0;
                        setGrnData([
                            ...grnData,
                            {
                                material_name: "",
                                total_quantity: "",
                                approved_qty: 0,
                                rejected_qty: 0,
                                iir_iid: lastIirId + 1, // Increment the IIR ID
                            },
                        ]);
                    }}
                    className="text-blue-500 hover:underline cursor-pointer"
                >
                    Add Material
                </button>
                <button
                    type="button"
                    onClick={() => grnData.length > 1 && setGrnData(grnData.slice(0, -1))}
                    className="text-red-500 hover:underline cursor-pointer ml-4"
                >
                    Remove Material
                </button>

                {error && <p className="text-red-500">{error}</p>}
                <div className="flex space-x-4">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer"
                    >
                        Save
                    </button>
                    <button
                        onClick={() => setShowForm(false)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            </form>
        </div>
    );
}