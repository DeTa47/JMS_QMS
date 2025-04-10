import {Route, Routes} from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import MaterialIIRGRN from './pages/MaterialIIRGRN';
import Materials from './components/Materials';
import Manufacturing from './components/Manufacturing';
import GRNMaterials from './pages/GRNMaterials';

function App() {

  return (
    <Routes>
        <Route path='/' element={<Dashboard></Dashboard>}>
        </Route>
        <Route path ='/material' element = {<Materials></Materials>}></Route>
        <Route path='/material-iir' element={<MaterialIIRGRN></MaterialIIRGRN>}></Route>
        <Route path ='/manufacturing' element = {<Manufacturing></Manufacturing>}></Route>
        <Route path ='/grn-materials' element = {<GRNMaterials></GRNMaterials>}></Route>
    </Routes>
  )
}

export default App
