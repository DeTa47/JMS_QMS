const db = require('../config/config');

const getALLGrn = async (req, res) => {

    const connection = await db.getConnection();
    try {

        const query = 
           `SELECT g.*, 
                   GROUP_CONCAT(DISTINCT mi.iir_iid) AS iir_ids, 
                   s.supplier_name, sb.*
            FROM grn g
            INNER JOIN material_grn mg ON mg.grn_id = g.grn_id
            INNER JOIN material m ON m.material_id = mg.material_id
            INNER JOIN material_iir mi ON mi.material_id = m.material_id
            INNER JOIN material_supplier ms ON ms.material_id = m.material_id
            INNER JOIN supplier s ON s.supplier_id = ms.supplier_id
            INNER JOIN supplier_bills sb ON g.supplier_bill_id = sb.supplier_bill_id
            GROUP BY g.grn_id, s.supplier_name
            `;

        const [grnDetails] = await connection.execute(query);


        return res.status(200).json(grnDetails);
    
    } catch (error) {  

        await connection.rollback(); 
        console.error(error);
        res.status(500).json({ message: 'Error creating inward records', error });   
    }

};

const createGRN = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const { grnData } = req.body; 
        const { supplier_bill_number, bill_number, bill_date, purchase_order_number, purchase_order_date, document_id, prepared_by, approved_by, supplier_id } = req.body;

        // Validation check
        if (
            !bill_number || !bill_date || !purchase_order_number || !purchase_order_date || 
            !document_id || !prepared_by || !approved_by || !supplier_id || !Array.isArray(grnData) || grnData.length === 0
        ) {
            throw new Error('Invalid input: One or more required fields are missing or empty');
        }

        await connection.beginTransaction(); 

        let query = `insert into supplier_bills (supplier_bill_number, bill_number, bill_date, purchase_order_number, purchase_order_date) values (?, ?, ?, ?, ?)`;

        const [insertResult] = await connection.execute(query, [supplier_bill_number, bill_number, bill_date, purchase_order_number, purchase_order_date]);
        const supplier_bill_id = insertResult.insertId;

        query = `insert into grn (supplier_bill_id, prepared_by, approved_by) values (?, ?, ?)`;
        const [grnResult] = await connection.execute(query, [supplier_bill_id, prepared_by, approved_by]);
        const grn_id = grnResult.insertId;

        query = `insert into grn_document (grn_id, document_id) values (?,?)`;
        const [grnDocumentResult] = await connection.execute(query, [grn_id, document_id]);


        for (let { material_name, inward_date, approved_qty, rejected_qty, iir_id } of grnData) {
            const approvedQty = parseFloat(approved_qty) || 0.0; // Ensure double data type
            const rejectedQty = parseFloat(rejected_qty) || 0.0; // Ensure double data type

            query = 'INSERT INTO material (material_name, stock_quantity) VALUES (?, ?)';
            const [materialResult] = await connection.execute(query, [material_name, approvedQty]);

            const matId = materialResult.insertId;

            console.log(matId, 'material id');

            query = 'INSERT INTO material_grn (material_id, grn_id) VALUES (?, ?)';
            const [materialGrnResult] = await connection.execute(query, [matId, grn_id]);

            console.log(materialGrnResult, 'material grn result');
            
            if (inward_date === undefined) inward_date = new Date().toISOString().slice(0,10);

            query = `
                INSERT INTO material_inwarded (material_id, inward_date, approved_qty, rejected_qty, inwarded_by)
                VALUES (?, ?, ?, ?, ?)
            `;



            console.log('Bind Parameters:', [matId, inward_date, approvedQty, rejectedQty, prepared_by]);

            const [result] = await connection.execute(query, [matId, inward_date, approvedQty, rejectedQty, prepared_by]);

            query = `insert into material_supplier (supplier_id, material_id, supplier_bill_id) values (?, ?, ?)`;
            const [materialSupplierResult] = await connection.execute(query, [supplier_id, matId, supplier_bill_id]);

            query = `insert into iir (iir_id) values(?)`;
            const [iirResult] = await connection.execute(query, [iir_id]);
        
            query = `insert into iir_document (iir_id, document_id) values (?, ?)`;
            const [iirDocumentResult] = await connection.execute(query, [iir_id, document_id]);

            query = 'insert into material_iir (material_id, iir_iid) values (?, ?)';
            const [materialIIRResult] = await connection.execute(query, [matId, iir_id]);

        }

        await connection.commit(); 

        res.status(201).json({ message: 'Inward records created successfully' });
    } catch (error) {
        await connection.rollback(); 
        console.error(error);
        res.status(500).json({ message: 'Error creating inward records', error });
    } finally {
        connection.release(); 
    }
};

const getGRN = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const { grn_id } = req.body;

        await connection.beginTransaction();

        const queryGRN = `
            SELECT g.*, sb.supplier_bill_number, sb.bill_number, sb.bill_date, sb.purchase_order_number, sb.purchase_order_date
            FROM grn g
            LEFT JOIN supplier_bills sb ON g.supplier_bill_id = sb.supplier_bill_id
            WHERE g.grn_id = ?
        `;
        const [grnDetails] = await connection.execute(queryGRN, [grn_id]);

        const queryMaterials = `
            SELECT m.material_id, m.material_name, mi.inward_date, mi.approved_qty, mi.rejected_qty, mi.inwarded_by, s.supplier_name, mir.iir_iid
            FROM material_supplier ms
            INNER JOIN material m ON  m.material_id = ms.material_id
            INNER JOIN material_iir mir ON mir.material_id = m.material_id
            INNER JOIN material_inwarded mi on mi.material_id = m.material_id
            INNER JOIN supplier s ON s.supplier_id = ms.supplier_id

            WHERE ms.supplier_bill_id = ?
        `;
        const [materials] = await connection.execute(queryMaterials, [grnDetails[0].supplier_bill_id]);

        // const IIR = [];
        // for (const material of materials) {
        //     const queryIIR = `
        //         SELECT mir.iir_iid
        //         FROM material_iir mir
        //         LEFT JOIN material m ON m.material_id = mir.material_id
        //         WHERE m.material_id = ?
        //     `;
        //     const [iirResult] = await connection.execute(queryIIR, [material.material_id]);
        //     IIR.push({...iirResult[0], material_id: material.material_id});
        // }

        const queryDocuments = `
            SELECT d.*
            FROM grn_document gd
            LEFT JOIN documents d ON gd.document_id = d.document_id
            WHERE gd.grn_id = ?
        `;
        const [documents] = await connection.execute(queryDocuments, [grn_id]);

        await connection.commit();



        res.status(200).json({
            grnDetails: grnDetails[0],
            materials: materials,
            documents: documents[0],
            // IIRs: IIR,
        });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Error fetching GRN data', error });
    } finally {
        connection.release();
    }
};

const updateGRN = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const { grn_id, grnDetails, materials } = req.body;

        await connection.beginTransaction();

        // Update GRN details
        const updateGRNQuery = `
            UPDATE grn
            SET prepared_by = ?, approved_by = ?
            WHERE grn_id = ?
        `;
        await connection.execute(updateGRNQuery, [
            grnDetails.prepared_by,
            grnDetails.approved_by,
            grn_id,
        ]);

        // Update supplier bill details
        const updateSupplierBillQuery = `
            UPDATE supplier_bills
            SET supplier_bill_number = ?, bill_number = ?, bill_date = ?, 
                purchase_order_number = ?, purchase_order_date = ?
            WHERE supplier_bill_id = ?
        `;
        await connection.execute(updateSupplierBillQuery, [
            grnDetails.supplier_bill_number,
            grnDetails.bill_number,
            grnDetails.bill_date.slice(0,10),
            grnDetails.purchase_order_number,
            grnDetails.purchase_order_date.slice(0,10),
            grnDetails.supplier_bill_id,
        ]);

        // Update materials
        for (const material of materials) {
            const updateMaterialQuery = `
                UPDATE material
                SET material_name = ?, stock_quantity = ?
                WHERE material_id = ?
            `;
            await connection.execute(updateMaterialQuery, [
                material.material_name,
                material.approved_qty,
                material.material_id,
            ]);

            const updateMaterialInwardedQuery = `
                UPDATE material_inwarded
                SET inward_date = ?, approved_qty = ?, rejected_qty = ?
                WHERE material_id = ?
            `;
            await connection.execute(updateMaterialInwardedQuery, [
                material.inward_date.slice(0,10),
                material.approved_qty,
                material.rejected_qty,
                material.material_id,
            ]);
        }

        await connection.commit();
        res.status(200).json({ message: 'GRN updated successfully' });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Error updating GRN', error });
    } finally {
        connection.release();
    }
};

module.exports = {
    createGRN,
    getGRN,
    getALLGrn,
    updateGRN,
};