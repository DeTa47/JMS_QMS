import {Route, Routes} from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import MaterialIIR from './pages/MaterialIIR';
import Materials from './components/Materials';
import Manufacturing from './components/Manufacturing';
import GRNList from './pages/GRNList';
import GRN from './pages/GRN';

function App() {

  return (
    <Routes>
        <Route path='/' element={<Dashboard></Dashboard>}>
        </Route>
        <Route path ='/material' element = {<Materials></Materials>}></Route>
        <Route path='/material-iir' element={<MaterialIIR></MaterialIIR>}></Route>
        <Route path ='/manufacturing' element = {<Manufacturing></Manufacturing>}></Route>
        <Route path ='/grn-list' element = {<GRNList></GRNList>}></Route>
        <Route path ='/grn' element={<GRN></GRN>}></Route>
    </Routes>
  )
}

export default App
