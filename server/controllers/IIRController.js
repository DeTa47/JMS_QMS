const mysqlPool = require('../config/config');

// POST method to insert data
const postIIRData = async (req, res) => {
    const { material_id, iir_id, tests, checked_by, approved_by, date } = req.body;

    console.log(material_id);

    const connection = await mysqlPool.getConnection();
    await connection.beginTransaction();

    try {
        const [iirResult] = await connection.query(
            'UPDATE iir SET checked_by = ?, approved_by = ?, date = ? WHERE iir_id = ?',
            [checked_by, approved_by, date, iir_id]
        );

        
        for (const test of tests) {
            let test_name_id = test.test_name_id;
            let specification_name_id = test.specification_name_id;

            if (test_name_id === "custom") {
                const [testNameResult] = await connection.query(
                    'INSERT INTO test_name (test_name) VALUES (?)',
                    [test.custom_test]
                );
                test_name_id = testNameResult.insertId;
            }

            if (specification_name_id === "custom") {
                const [specResult] = await connection.query(
                    'INSERT INTO specification_name (specification_name) VALUES (?)',
                    [test.custom_specification]
                );
                specification_name_id = specResult.insertId;
            }

            const [testResult] = await connection.query(
                'INSERT INTO tests (test_name_id, specification_name_id, observation_1, observation_2, observation_3, observation_4, observation_5, observation_6) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [test_name_id, specification_name_id, ...test.observations]
            );
            const test_id = testResult.insertId;

            await connection.query(
                'INSERT INTO material_test (test_id, material_id) VALUES (?, ?)',
                [test_id, material_id]
            );
        }

        await connection.commit();
        res.status(201).json({ message: 'Data inserted successfully', iir_id });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: 'Failed to insert data', details: error.message });
    } finally {
        connection.release();
    }
};

// GET method to retrieve data
const getIIRData = async (req, res) => {
    const { material_id } = req.body;

    console.log(material_id);

    try {
        const [IIR] = await mysqlPool.query(
            `SELECT i.iir_id, i.checked_by, i.approved_by, i.date,
                    m.material_id,
                    t.test_id, t.observation_1, t.observation_2, t.observation_3, t.observation_4, t.observation_5, t.observation_6,
                    tn.test_name_id, tn.test_name,
                    sn.specification_name_id, sn.specification_name,
                    s.supplier_name,
                    d.document_number, d.issue_number, d.revision_number, d.reference_standard, d.effective_date,
                    sb.supplier_bill_number, sb.bill_number, sb.bill_date, sb.purchase_order_number, sb.purchase_order_date
             FROM iir i
             INNER JOIN material_iir mi ON i.iir_id = mi.iir_iid
             INNER JOIN material m ON m.material_id = mi.material_id
             INNER JOIN material_test mt ON mt.material_id = m.material_id
             INNER JOIN tests t ON t.test_id = mt.test_id
             INNER JOIN test_name tn ON tn.test_name_id = t.test_name_id
             INNER JOIN specification_name sn ON sn.specification_name_id = t.specification_name_id
             INNER JOIN material_supplier ms ON ms.material_id = m.material_id
             INNER JOIN supplier_bills sb ON sb.supplier_bill_id = ms.supplier_bill_id
             INNER JOIN supplier s ON s.supplier_id = ms.supplier_id
             INNER JOIN iir_document iird ON iird.iir_id = i.iir_id
             INNER JOIN documents d ON d.document_id = iird.document_id
             WHERE m.material_id = ?`,
            [material_id]
        );

        res.status(200).json(IIR);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve data', details: error.message });
    }
};

const updateIIRData = async (req, res) => {
    const { iir_id, tests, checked_by, approved_by, date } = req.body;

    const connection = await mysqlPool.getConnection();
    await connection.beginTransaction();

    console.log(req.body);

    try {
        // Update IIR table
        await connection.query(
            'UPDATE iir SET checked_by = ?, approved_by = ?, date = ? WHERE iir_id = ?',
            [checked_by, approved_by, date.slice(0,10), iir_id]
        );

        // Update Tests and Material_test tables
        for (const test of tests) {
            let test_name_id = test.test_name_id;
            let specification_name_id = test.specification_name_id;

            if (test_name_id === "custom") {
                const [testNameResult] = await connection.query(
                    'INSERT INTO test_name (test_name) VALUES (?)',
                    [test.custom_test]
                );
                test_name_id = testNameResult.insertId;
            }

            if (specification_name_id === "custom") {
                const [specResult] = await connection.query(
                    'INSERT INTO specification_name (specification_name) VALUES (?)',
                    [test.custom_specification]
                );
                specification_name_id = specResult.insertId;
            }

            if ('test_id' in test) {
                console.log('Entered if')
                await connection.query(
                    'UPDATE tests SET test_name_id = ?, specification_name_id = ?, observation_1 = ?, observation_2 = ?, observation_3 = ?, observation_4 = ?, observation_5 = ?, observation_6 = ? WHERE test_id = ?',
                    [test_name_id, specification_name_id, ...test.observations, test.test_id]
                );
            } else {
                console.log('Entered else');
                const [testResult] = await connection.query(
                    'INSERT INTO tests (test_name_id, specification_name_id, observation_1, observation_2, observation_3, observation_4, observation_5, observation_6) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [test_name_id, specification_name_id, ...test.observations]
                );
                
            }

        }

        await connection.commit();
        res.status(200).json({ message: 'Data updated successfully' });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: 'Failed to update data', details: error.message });
    } finally {
        connection.release();
    }
};

module.exports = { postIIRData, getIIRData, updateIIRData };
