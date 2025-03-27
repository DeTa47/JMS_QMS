import stockdp from '../assets/stock_dp.jpg';

export default function SeeUser(){
        return(
            <div className='flex flex-col items-center justify-center'>
                <div className='bg-blue-100 mx-2 my-4 w-full sm:ml-5 sm:w-93 min-w-40 min-h-17 rounded-md shadow-xl px-4 py-2'>
                    <header aria-label='Case information header' className='flex flex-row items-center space-x-3'>
                        <img src={stockdp} alt="user profile photo" className='rounded-full h-10' />
                        <h2 aria-label='userDetails' className='text-lg font-semibold'>
                            User 1
                        </h2>               
                    </header>
                </div>
                <div className='bg-blue-100 mx-2 my-4 w-full sm:ml-5 sm:w-93 min-w-40 min-h-17 rounded-md shadow-xl px-4 py-2'>
                    <header aria-label='Case information header' className='flex flex-row items-center space-x-3'>
                        <img src={stockdp} alt="user profile photo" className='rounded-full h-10' />
                        <h2 aria-label='userDetails' className='text-lg font-semibold'>
                            User 2
                        </h2>               
                    </header>
                </div>
            </div>
        )
}