import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../components/Modal";

export default function MaterialForms({ setmaterialform, setmaterials }) {
    const [suppliers, setSuppliers] = useState([]);
    const [formData, setFormData] = useState({
        material_name: "",
        material_type: "",
        material_grade: "",
        stock_quantity: 0,
        supplier_id: "",
        supplier_name: "",
        supplier_type: "",
        active: false,
        po_number: "",
        location: "",
        bill_number: ""
    });
    const [showOtherFields, setShowOtherFields] = useState(false);

    const handleSave = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/createMaterialSupplier`, formData);
            setmaterials((prev) => [...prev, formData]);
            setmaterialform(false);
        } catch (error) {
            console.error("Error saving material:", error);
        }
    };

    useEffect(() => {
        axios.post(`${import.meta.env.VITE_API_BASE_URL}/getsupplier`, {})
            .then((response) => setSuppliers(response.data.data))
            .catch((error) => console.error(error));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSupplierChange = (e) => {
        const value = e.target.value;
        if (value === "other") {
            setShowOtherFields(true);
            setFormData((prev) => ({ ...prev, supplier_id: "", supplier_name: "" }));
        } else {
            setShowOtherFields(false);
            const selectedSupplier = suppliers.find((s) => s.supplier_id === value);
            setFormData((prev) => ({ ...prev, supplier_id: value, supplier_name: selectedSupplier?.supplier_name }));
        }
    };

    return (
        <Modal onClose={() => setmaterialform(false)}>
            <form aria-label="Material data input form" className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <input
                    type="text"
                    name="material_name"
                    placeholder="Material Name"
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded bg-white"
                />
                <input
                    type="text"
                    name="material_type"
                    placeholder="Material Type"
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded bg-white"
                />
                <input
                    type="text"
                    name="material_grade"
                    placeholder="Material Grade"
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded bg-white"
                />
                <select
                    name="supplier_id"
                    onChange={handleSupplierChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded bg-white"
                >
                    <option value="">Select Supplier</option>
                    {suppliers.map((supplier) => (
                        <option key={supplier.supplier_id} value={supplier.supplier_id}>
                            {supplier.supplier_name}
                        </option>
                    ))}
                    <option value="other">Other</option>
                </select>
                {showOtherFields && (
                    <>
                        <input
                            type="text"
                            name="supplier_name"
                            placeholder="Supplier Name"
                            onChange={handleInputChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded bg-white"
                        />
                        <input
                            type="text"
                            name="supplier_type"
                            placeholder="Supplier Type"
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded bg-white"
                        />
                        <input
                            type="text"
                            name="po_number"
                            placeholder="PO Number"
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded bg-white"
                        />
                        <input
                            type="text"
                            name="location"
                            placeholder="Location"
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded bg-white"
                        />
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="active"
                                onChange={(e) => setFormData((prev) => ({ ...prev, active: e.target.checked }))}
                                className="w-4 h-4 hover:cursor-pointer"
                            />
                            <label className="text-gray-700">Active</label>
                        </div>
                    </>
                )}
                <input
                    type="text"
                    name="bill_number"
                    placeholder="Bill Number"
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded bg-white"
                />
                <button
                    type="button"
                    onClick={handleSave}
                    className="w-1/4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
                >
                    Save
                </button>
                <button
                    type="button"
                    onClick={() => setmaterialform(false)}
                    className="w-1/4 ml-70 p-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
                >
                    Close
                </button>
            </form>
        </Modal>
    );
}