const mysqlpool = require('../config/config');

const getAllSpecificationNames = async (req, res) => {
    try {
        const [rows] = await mysqlpool.query('SELECT specification_name_id, specification_name FROM specification_name');
        return res.status(200).json(rows); // Ensure response is JSON
    } catch (error) {
        console.error('Error fetching Specification names:', error);
        return res.status(500).json({ error: 'Failed to fetch Specification names', details: error.message });
    }
};

module.exports = { getAllSpecificationNames };