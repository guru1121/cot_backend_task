import db from '../db.js';

export const addCategory = (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Category name is required' });

    const sql = "INSERT INTO categories (name) VALUES (?)";
    db.query(sql, [name], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error adding category', err });
        res.status(201).json({ message: 'Category added', categoryId: result.insertId });
    });
};

export const getCategories = (req, res) => {
    const sql = "SELECT * FROM categories";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching categories', err });
        res.status(200).json(results);
    });
};

export const updateCategory = (req, res) => {
    const { categoryId } = req.params;
    const { name } = req.body;

    const sql = "UPDATE categories SET name = ? WHERE id = ?";
    db.query(sql, [name, categoryId], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error updating category', err });
        res.status(200).json({ message: 'Category updated' });
    });
};

export const deleteCategory = (req, res) => {
    const { categoryId } = req.params;

    // Check if category has services
    db.query("SELECT * FROM services WHERE category_id = ?", [categoryId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error checking services', err });

        if (results.length > 0) return res.status(400).json({ message: 'Category contains services and cannot be deleted' });

        db.query("DELETE FROM categories WHERE id = ?", [categoryId], (err, result) => {
            if (err) return res.status(500).json({ message: 'Error deleting category', err });
            res.status(200).json({ message: 'Category deleted' });
        });
    });
};
