import axios from 'axios';
import { useEffect, useState } from "react";
import AddButton from "./AddButton";
import DataTable from "./DataTable";
import MaterialForms from "../forms/MaterialForms";

export default function Materials() {
    const [materialForm, setMaterialForm] = useState(false);
    const [materials, setMaterials] = useState([]);


    useEffect(() => {
        axios.post('http://localhost:8080/getMaterialSupplier', {}, { timeout: 5000 }) // 5-second timeout
            .then((response) => {
                setMaterials(response.data);
            })
            .catch(error => {
                if (error.code === 'ECONNABORTED') {
                    console.error('Request timed out:', error);
                } else {
                    console.error('Error fetching materials:', error);
                }
            });
    }, []); 

    const columns = [
        {
            label: 'Material Name',
            key: 'material_name'
        },
        {
            label: 'Material Type',
            key: 'material_type'
        },
        {
            label: 'Material Grade',
            key: 'material_grade'
        },
        {
            label: 'Stock quantity',
            key: 'stock_quantity'
        },
        {
            label: 'Supplier Name',
            key: 'supplier_name'
        },
    ];

    return (
        <div className="flex h-screen items-center justify-center m-0.5">
            <div className="h-95/100 w-95/100 bg-blue-50 rounded-md shadow-2xl relative">
            <h1 className="text-2xl font-bold text-start ml-1 my-4">Materials List</h1>
                {!materialForm ? (
                    <>
                        <DataTable
                            route = {'/material-iir'}
                            columns={columns}
                            data={materials}
                        />
                        <AddButton onclick={() => setMaterialForm(true)} classes={'absolute bottom-5 right-5'} />
                    </>
                ) : (
                    <div className="absolute inset-0 bg-white p-4 rounded-md shadow-lg">
                        <MaterialForms setmaterialform={setMaterialForm} setmaterials={setMaterials} />
                    </div>
                )}
            </div>
        </div>
    );
}