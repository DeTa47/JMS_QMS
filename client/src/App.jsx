import AdminDashboard from './pages/AdminDashboard';
import SeeUser from './pages/SeeUser';
import menuButton from './assets/menuButton.svg';
import { useState } from 'react';

function App() {
  const [drawerOn, setDrawerOn] = useState(false);
  const [component, setComponent] = useState('qms');

  const toggleDrawer = () => setDrawerOn(!drawerOn);

  const toggleComponent = (val) => setComponent(val);

  return (
    <>
      <header className='flex z-20 flex-row py-5 w-full justify-between bg-blue-400 sm:justify-start'>
        <button onClick={toggleDrawer} className='pl-4'>
            <img src={menuButton} alt='menu button'/>
        </button>
        <p className='text-amber-50 pl-4 sm:pl-36 lg:pl-0 text-center w-full lg:w-auto lg:mx-auto'>
          QMS
        </p>
      </header>
      <div 
        aria-label='Drawer/Menu' 
        className={`absolute ${drawerOn ? 'block' : 'hidden'} z-10 h-full w-3/4 sm:min-h-full sm:min-w-1/2 lg:w-1/10 align-center pt-4 space-y-4 flex flex-col bg-white`}
      >
        <button onClick={(e)=>toggleComponent('qms')}>
          Case Tracking
        </button>
        <button onClick={(e)=>toggleComponent('ums')}>
          User Tracking
        </button>
      </div>

      {component === 'qms'?
        <AdminDashboard classes={'-z-0'}>
        </AdminDashboard>:
        <SeeUser>
        </SeeUser>
      }
    </>
  )
}

export default App
