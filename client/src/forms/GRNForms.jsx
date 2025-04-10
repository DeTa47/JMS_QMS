import { useState, useEffect } from "react";
import axios from "axios";

export default function GRNForms({ material_id, setShowForm }) {
    const [formData, setFormData] = useState({
        inward_date: "",
        approved_qty: "",
        rejected_qty: "",
        inwarded_by: "",
        grn_id: "",
        bill_number: "",
        bill_date: "",
        purchase_order_number: "",
        purchase_order_date: "",
        prepared_by: "",
        approved_by: "",
        iir_id: "",
    });
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
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        if (!formData.iir_id) {
            setError("IIR is mandatory");
            return;
        }
        setError("");
        axios.post('http://localhost:8080/createGRN', { grnData: [formData], ...formData })
            .then(() => setShowForm(false))
            .catch((err) => console.error(err));
    };

    return (
        <div className="p-4 bg-gray-100 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">GRN Form</h2>
            <form className="space-y-4">
                {/* Supplier Bill Details */}
                <div>
                    <label className="block font-medium">Bill Number:</label>
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

                {/* Material Details */}
                <div>
                    <label className="block font-medium">Inward Date:</label>
                    <input
                        type="date"
                        name="inward_date"
                        value={formData.inward_date}
                        onChange={handleChange}
                        className="border rounded p-2 w-full"
                    />
                </div>
                <div>
                    <label className="block font-medium">Approved Quantity:</label>
                    <input
                        type="number"
                        name="approved_qty"
                        value={formData.approved_qty}
                        onChange={handleChange}
                        className="border rounded p-2 w-full"
                    />
                </div>
                <div>
                    <label className="block font-medium">Rejected Quantity:</label>
                    <input
                        type="number"
                        name="rejected_qty"
                        value={formData.rejected_qty}
                        onChange={handleChange}
                        className="border rounded p-2 w-full"
                    />
                </div>
                <div>
                    <label className="block font-medium">Inwarded By:</label>
                    <input
                        type="text"
                        name="inwarded_by"
                        value={formData.inwarded_by}
                        onChange={handleChange}
                        className="border rounded p-2 w-full"
                    />
                </div>

                {/* IIR Details */}
                <div>
                    <label className="block font-medium">IIR ID:</label>
                    <input
                        type="text"
                        name="iir_id"
                        value={formData.iir_id}
                        onChange={handleChange}
                        className="border rounded p-2 w-full"
                    />
                </div>

                {/* Prepared and Approved By */}
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