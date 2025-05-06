import {Route, Routes} from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import MaterialIIR from './pages/MaterialIIR';
import Materials from './pages/Materials';
import MaterialIOList from './pages/MaterialIOList';
import EquipmentLogBooks from './pages/EquipmentLogBooks';
import MonthlyLogBook from './pages/MonthlyLogBook';
import LogBookData from './pages/LogBookData';
import GRNList from './pages/GRNList';
import GRN from './pages/GRN';

function App() {

  return (
    <Routes>
        <Route path='/' element={<Dashboard></Dashboard>}>
        </Route>
        <Route path ='/material' element = {<Materials></Materials>}></Route>
        <Route path='/material-iir' element={<MaterialIIR></MaterialIIR>}></Route>
        <Route path='/materialIo' element={<MaterialIOList></MaterialIOList>}></Route>
        <Route path ='/EquipmentLogBooks' element = {<EquipmentLogBooks></EquipmentLogBooks>}></Route>
        <Route path ='/grn-list' element = {<GRNList></GRNList>}></Route>
        <Route path ='/grn' element={<GRN></GRN>}></Route>
        <Route path ='/monthlylogbooks' element={<MonthlyLogBook></MonthlyLogBook>}></Route>
        <Route path ='/logbookdata' element={<LogBookData></LogBookData>}></Route>
    </Routes>
  )
}

export default App
