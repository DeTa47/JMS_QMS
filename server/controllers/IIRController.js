const mysqlPool = require('../config/config');

// POST method to insert data
const postIIRData = async (req, res) => {
    const { material_id, tests, checked_by, approved_by, date } = req.body;

    console.log(material_id);

    const connection = await mysqlPool.getConnection();
    await connection.beginTransaction();

    try {
        const [iirResult] = await connection.query(
            'INSERT INTO iir (checked_by, approved_by, date) VALUES (?, ?, ?)',
            [checked_by, approved_by, date]
        );
        const iir_id = iirResult.insertId;

        // Insert into material_iir table
        await connection.query(
            'INSERT INTO material_iir (iir_iid, material_id) VALUES (?, ?)',
            [iir_id, material_id]
        );

        // Insert into Tests and Material_test tables
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

    console.log(req.body);

    try {
        const [IIR] = await mysqlPool.query(
            `SELECT i.iir_id, i.checked_by, i.approved_by, i.date,
                    m.material_id,
                    t.test_id, t.observation_1, t.observation_2, t.observation_3, t.observation_4, t.observation_5, t.observation_6,
                    tn.test_name_id, tn.test_name,
                    sn.specification_name_id, sn.specification_name
             FROM IIR i
             LEFT JOIN material_iir mi ON i.iir_id = mi.iir_iid
             LEFT JOIN material m ON m.material_id = mi.material_id
             LEFT JOIN material_test mt ON m.material_id = mt.material_id
             LEFT JOIN tests t ON mt.test_id = t.test_id
             LEFT JOIN test_name tn ON tn.test_name_id = t.test_name_id
             LEFT JOIN specification_name sn ON sn.specification_name_id = t.specification_name_id 
             WHERE m.material_id = ?`,
            [material_id]
        );

        res.status(200).json(IIR);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve data', details: error.message });
    }
};

module.exports = { postIIRData, getIIRData };
