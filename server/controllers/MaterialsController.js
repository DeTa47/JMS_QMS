const db = require('../config/config');

module.exports = {
    async getAllMaterials(req, res) {
        try {
            
            const [rows] = await db.execute('SELECT * FROM material m where m.stock_quantity > 0');
            res.status(200).json(rows);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch materials' });
        }
    }
};
