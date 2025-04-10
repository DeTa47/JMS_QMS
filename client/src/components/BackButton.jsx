import back from '../assets/left-arrow.png';

export default function BackButton({classes, onclick}){
    
    return (<button onClick={()=>onclick(false)} aria-label="Back button" className={`${classes}`}>
                <img src={back} alt="Back button icon" />
            </button>); 
}