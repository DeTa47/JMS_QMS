const mysqlpool = require('../config/config');

const getAllTestNames = async (req, res) => {
    try {
        const [rows] = await mysqlpool.query('SELECT test_name_id, test_name FROM test_name');
        return res.status(200).json(rows); // Ensure response is JSON
    } catch (error) {
        console.error('Error fetching test names:', error);
        return res.status(500).json({ error: 'Failed to fetch test names', details: error.message });
    }
};

module.exports = { getAllTestNames };