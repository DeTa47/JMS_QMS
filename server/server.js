require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors'); 
const app = express();
const mysqlPool = require('./config/config');
const supplierRoutes = require('./routes/supplierRoutes');
const materialSupplierRoutes = require('./routes/MaterialsSupplierRoutes');
const IIRRoutes = require('./routes/IIRRoutes'); 
const GRNRoutes = require('./routes/GRNRoutes'); 
const MaterialsRoute = require('./routes/MaterialsRoute');
const ManufacturingRoutes = require('./routes/ManufacturingRoutes');
const TestSpecificationNameRoute = require('./routes/TestSpecificationNameRoute');
const DocumentRoutes = require('./routes/DocumentRoutes');

app.use(morgan('dev'));
app.use(cors({ origin: 'http://localhost:3002' })); 
app.use(express.json()); 

app.use('/', supplierRoutes);
app.use('/', materialSupplierRoutes);
app.use('/', IIRRoutes);
app.use('/', GRNRoutes);
app.use('/', MaterialsRoute);
app.use('/', ManufacturingRoutes);
app.use('/', TestSpecificationNameRoute);
app.use('/', DocumentRoutes);

mysqlPool.query('SELECT 1').then(()=>{
    
        console.log("Mysql DB Connected");
        app.listen(process.env.PORT, ()=>{console.log(`Server started at port: ${process.env.PORT}`);})
    
}).catch((error)=>{
    console.log("Error",error);
})