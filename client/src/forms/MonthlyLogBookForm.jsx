import {useState} from "react"
import { DatePicker} from "antd"
import axios from "axios"

export default function MonthlyLogBookForm({logbookid, handleModalClose}) {

    console.log('Logbook ID:', logbookid);

    const [logbookmid, setLogBookMid] = useState({});

    const handleSubmit = async (e) => { 

        try{
        e.preventDefault();

        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/createlogbookbyid`, {logbookid: logbookmid.logbookid, date: logbookmid.date})
        console.log('Logbook created:', res.data);
        handleModalClose();} 
        catch(error){
                console.error('Error creating logbook:', error);
                alert('Error creating logbook:', error.response.data.error);
            }
    }
    
    
            
        
    

    return(
        <>
            <form>
                
                <DatePicker
                    picker="month" 
                    className="w-full" 
                    format="YYYY-MM-DD"
                    placeholder="Select Month" 
                    onChange={(date, dateString) => setLogBookMid({
                        logbookid: logbookid,
                        date: dateString,
                    })} />
                
                <button onClick={(e)=>handleSubmit(e)} className="bg-blue-600 text-white px-4 py-2 mt-3 rounded hover:bg-blue-500 cursor-pointer" type="submit">Submit</button>
            </form>
        </>

    )
}