import { useEffect, useState } from "react";
import axios from "axios";
import BackButton from "../components/BackButton";

export default function ManufacturingForms({ setmanufacturingform, setmanufacturingdata }) {
    const [materials, setMaterials] = useState([]);
    const [formData, setFormData] = useState({
        material_id: "",
        product_name: "",
        quantity: 0,
    });

    const handleSave = async () => {
        const selectedMaterial = materials.find(m =>{ console.log(m); m.material_id === formData.material_id});
        console.log(formData.quantity, selectedMaterial?.stock_quantity, typeof formData.quantity, typeof selectedMaterial?.stock_quantity);
        if (formData.quantity > selectedMaterial?.stock_quantity) {
            console.log("Entered if statement");
            alert("Insufficient material in stock.");
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/manufacturing', formData);
            const newManufacturing = {
                material_name: selectedMaterial.material_name,
                product_name: formData.product_name,
                quantity: formData.quantity,
            };
            setmanufacturingdata(prev => [...prev, newManufacturing]);
            setmanufacturingform(false);
        } catch (error) {
            console.error("Error saving manufacturing data:", error);
        }
    };

    useEffect(() => {
        axios.post('http://localhost:8080/getmaterials', {})
            .then((response) => {
                console.log(response);
                setMaterials(response.data);
            })
            .catch((error) => console.error(error));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "quantity" ? parseInt(value, 10) || 0 : value
        }));
    };

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <BackButton onclick={setmanufacturingform} classes="relative hover:cursor-pointer mb-4"></BackButton>
            <form aria-label="Manufacturing data input form" className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <select
                    name="material_id"
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded bg-white"
                >
                    <option value="">Select Material</option>
                    {materials.map(material => (
                        <option key={material.material_id} value={material.material_id}>
                            {material.material_name}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    name="product_name"
                    placeholder="Product Name"
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded bg-white"
                />

                <input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded bg-white"
                />

                <button
                    type="button"
                    onClick={handleSave}
                    className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
                >
                    Save
                </button>
            </form>
        </div>
    );
}