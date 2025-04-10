const db = require('../config/config');

const getALLGrn = async (req, res) => {

    const connection = await db.getConnection();
    try {

        const query = 
           `SELECT g.*, 
                   GROUP_CONCAT(DISTINCT mi.iir_iid) AS iir_ids, 
                   s.supplier_name, sb.*
            FROM grn g
            LEFT JOIN material_grn mg ON mg.grn_id = g.grn_id
            LEFT JOIN material m ON m.material_id = mg.material_id
            LEFT JOIN material_iir mi ON mi.material_id = m.material_id
            LEFT JOIN material_supplier ms ON ms.material_id = m.material_id
            LEFT JOIN supplier s ON s.supplier_id = ms.supplier_id
            LEFT JOIN supplier_bills sb ON g.supplier_bill_id = sb.supplier_bill_id
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
        const {grnData} = req.body; 
        const {bill_number, bill_date, purchase_order_number, purchase_order_date, document_id, prepared_by, approved_by} = req.body;

        await connection.beginTransaction(); 

        const query = `insert into supplier_bills (bill_number, bill_date, purchase_order_number, purchase_order_date) values (?, ?, ?, ?)`;

        const [insertResult] = await connection.execute(query, [bill_number, bill_date, purchase_order_number, purchase_order_date]);
        const supplier_bill_id = insertResult.insertId;

        query = `insert into grn (supplier_bill_id, prepared_by, approved_by) values (?)`;
        const [grnResult] = await connection.execute(query, [supplier_bill_id, prepared_by, approved_by]);
        const grn_id = grnResult.insertId;

        query = `insert into grn_document (grn_id, document_id) values (?)`;
        const [grnDocumentResult] = await connection.execute(query, [grn_id, document_id]);


        for (const { material_name, inward_date, approved_qty, rejected_qty, inwarded_by, iir_id } of grnData) {

            query = 'INSERT INTO material (material_name, stock_quantity) VALUES (?, ?)';
            const [materialResult] = await connection.execute(query, [material_name, approved_qty]);

            const matId = materialResult.insertId;

            query = `
                INSERT INTO material_inwarded (material_id, inward_date, approved_qty, rejected_qty, inwarded_by)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            const [result] = await connection.execute(query, [matId, inward_date, approved_qty, rejected_qty, inwarded_by]);

            query = `insert into material_supplier (supplier_bill_id, material_id) values (?, ?, ?)`;
            const [materialSupplierResult] = await connection.execute(query, [supplier_bill_id, matId]);

            query = `insert into iir (iir_id) values(?)`;
            const [iirResult] = await connection.execute(query, [iir_id]);
        
            query = `insert into iir_document (iir_id, document_id) values (?)`;
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
            SELECT g.*, sb.bill_number, sb.bill_date, sb.purchase_order_number, sb.purchase_order_date
            FROM grn g
            LEFT JOIN supplier_bills sb ON g.supplier_bill_id = sb.supplier_bill_id
            WHERE g.grn_id = ?
        `;
        const [grnDetails] = await connection.execute(queryGRN, [grn_id]);

        const queryMaterials = `
            SELECT m.material_id, m.material_name, mi.inward_date, mi.approved_qty, mi.rejected_qty, mi.inwarded_by, s.supplier_name, mir.iir_iid
            FROM material_supplier ms
            LEFT JOIN material m ON  m.material_id = ms.material_id
            LEFT JOIN material_iir mir ON mir.material_id = m.material_id
            LEFT JOIN material_inwarded mi on mi.material_id = m.material_id
            LEFT JOIN supplier s ON s.supplier_id = ms.supplier_id

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

module.exports = {
    createGRN,
    getGRN,
    getALLGrn
};