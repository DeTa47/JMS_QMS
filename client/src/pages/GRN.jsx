import DataTable from "../components/DataTable"
import AddButton from "../components/AddButton"
import GRNForms from "../forms/GRNForms"
import Modal from "../components/Modal"
import axios from "axios";
import { useState, useEffect } from "react";

export default function GRN(){

    const [grns, setGrns] = useState([]);
    const [showForm, setShowForm] = useState(false); // State to toggle form visibility

    console.log(import.meta.env.VITE_API_BASE_URL);

    useEffect(() => {  
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/getallgrn`, {})
            .then((response) => {
                setGrns(response.data); 
                console.log(grns);
             }
            )
            .catch(error => console.error('Error fetching GRNs:', error));
     }, []);

    return(<div className="flex h-screen items-center justify-center m-0.5">
            <div className="h-95/100 w-95/100 bg-blue-50 rounded-md shadow-2xl relative">
            <h1 className="text-2xl font-bold text-start ml-1 my-4">GRN List</h1>
                
                {!showForm ? (
                    <>
                        <DataTable 
                            data={grns} 
                            route={'/grn-materials'}
                            columns={[
                                { label: "IIR Numbers", key: "iir_ids" },
                                { label: "Prepared By", key: "prepared_by" },
                                { label: "Approved By", key: "approved_by" },
                                { label: "Supplier Bill Number", key: "bill_number" },
                                { label: "Supplier Name", key: "supplier_name" }
                            ]}
                        />
                        <AddButton onclick={() => setShowForm(true)} classes="absolute bottom-5 right-5" />
                    </>
                ) : (
                    <div className="absolute inset-0 bg-white p-4 rounded-md shadow-lg">
                        <GRNForms setShowForm={setShowForm} setGrns={setGrns} />
                    </div>
                )}
            </div>
        </div>)
}