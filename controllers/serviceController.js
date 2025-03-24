import db from '../db.js';

export const addService = (req, res) => {
    const { categoryId } = req.params;
    const { name, type, priceOptions } = req.body;

    if (!name || !type || !priceOptions || !Array.isArray(priceOptions)) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const sql = "INSERT INTO services (category_id, name, type) VALUES (?, ?, ?)";
    db.query(sql, [categoryId, name, type], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error adding service', err });

        const serviceId = result.insertId;
        const priceQueries = priceOptions.map(option => {
            return db.promise().query("INSERT INTO service_prices (service_id, duration, price, type) VALUES (?, ?, ?, ?)",
                [serviceId, option.duration, option.price, option.type]);
        });

        Promise.all(priceQueries)
            .then(() => res.status(201).json({ message: 'Service added', serviceId }))
            .catch(err => res.status(500).json({ message: 'Error adding price options', err }));
    });
};

export const getServices = (req, res) => {
    const { categoryId } = req.params;

    const sql = "SELECT * FROM services WHERE category_id = ?";
    db.query(sql, [categoryId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching services', err });
        res.status(200).json(results);
    });
};

export const updateService = (req, res) => {
    const { serviceId } = req.params;
    const { name, type, priceOptions } = req.body;

    const sql = "UPDATE services SET name = ?, type = ? WHERE id = ?";
    db.query(sql, [name, type, serviceId], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error updating service', err });

        // Update price options
        db.query("DELETE FROM service_prices WHERE service_id = ?", [serviceId], (err) => {
            if (err) return res.status(500).json({ message: 'Error clearing old price options', err });

            const priceQueries = priceOptions.map(option => {
                return db.promise().query("INSERT INTO service_prices (service_id, duration, price, type) VALUES (?, ?, ?, ?)",
                    [serviceId, option.duration, option.price, option.type]);
            });

            Promise.all(priceQueries)
                .then(() => res.status(200).json({ message: 'Service updated' }))
                .catch(err => res.status(500).json({ message: 'Error updating price options', err }));
        });
    });
};

export const deleteService = (req, res) => {
    const { serviceId } = req.params;

    db.query("DELETE FROM services WHERE id = ?", [serviceId], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error deleting service', err });
        res.status(200).json({ message: 'Service deleted' });
    });
};
