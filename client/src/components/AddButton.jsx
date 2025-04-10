import add from '../assets/plus.png';

export default function AddButton({onclick, classes}){

    return(
        <button onClick={()=>onclick(true)} className={`${classes} hover:cursor-pointer`} aria-label="Add Material">
            <img src={add} alt="add symbol" />
        </button>
    )

}