import { FaPlus } from "react-icons/fa"

export default function AddButton({onclick, classes}){

    return(
        <button onClick={()=>onclick(true)} className={`${classes} p-4 bg-white rounded-full shadow-lg items-center justify-center text-blue-500 hover:cursor-pointer`} aria-label="Add Material">
            <FaPlus size={20}/>
        </button>
    )

}