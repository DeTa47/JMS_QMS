import axios from 'axios';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import AddButton from "./AddButton";
import ManufacturingForms from "../forms/ManufacturingForms";
import DataTable from './DataTable'; // Import DataTable component

export default function Manufacturing() {
    const [manufacturingForm, setManufacturingForm] = useState(false);
    const [manufacturingData, setManufacturingData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.post(`${import.meta.env.VITE_API_BASE_URL}/manufacturing`)
            .then(response => {
                console.log('Response Data', response.data);
                setManufacturingData(response.data);
            })
            .catch(error => {
                console.error('Error fetching manufacturing data:', error);
            });
    }, []);

    const columns = [
        { label: 'Product Name', key: 'product_name' },
        { label: 'Material Name', key: 'material_name' },
        { label: 'Quantity', key: 'quantity' },
    ];

    return (
        <div aria-label="Manufacturing parent container" className="flex h-screen items-center justify-center m-0.5">
            <div aria-label="Manufacturing Details container" className="h-95/100 w-95/100 bg-blue-50 rounded-md shadow-2xl">
                {manufacturingForm ? (
                    <ManufacturingForms setmanufacturingform={setManufacturingForm} setmanufacturingdata={setManufacturingData}></ManufacturingForms>
                ) : (
                    <>
                        <div className="p-4">
                            <DataTable
                                columns={columns}
                                data={manufacturingData}
                                actions={(row) => (
                                    <button
                                        onClick={() => navigate('/manufacturing-details', { state: { item: row } })}
                                        className="text-blue-500 hover:underline"
                                    >
                                        View
                                    </button>
                                )}
                            />
                        </div>
                        <AddButton onclick={setManufacturingForm} classes={'relative top-57/100 left-87/100'}></AddButton>
                    </>
                )}
            </div>
        </div>
    );
}