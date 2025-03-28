
export default function Drawer(){
  const [drawerOn, setDrawerOn] = useState(false);
  const [component, setComponent] = useState('qms');

  const toggleDrawer = () => setDrawerOn(!drawerOn);

  const toggleComponent = (val) => setComponent(val);

  return(
    <>
        <div aria-label='Drawer/Menu' 
            className={`absolute ${drawerOn ? 'block' : 'hidden'} z-10 h-full w-3/4 sm:min-h-full sm:min-w-1/2 lg:w-1/10 align-center pt-4 space-y-4 flex flex-col bg-white`}
        >
            <button onClick={(e)=>toggleComponent('qms')}>
            Case Tracking
            </button>
            <button onClick={(e)=>toggleComponent('ums')}>
            Manage Users
            </button>
        </div>
    </>
  
    );
}