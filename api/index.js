const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header(`Access-Control-Allow-Origin`, `*`);
    res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
    res.header(`Access-Control-Allow-Headers`, `Content-Type`);
    next();
})

// Import your custom sql function
const { sql } = require('../db'); // Adjust the path to where your sql function is defined

// Retrieves a list of buy lists
app.get('/buyLists', async (req, res) => {
    try {
        const buyLists = await sql`SELECT * FROM buyLists;`;
        res.status(200).json(buyLists.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

// Creates a new buy list
app.post('/buyLists/:name', async (req, res) => {
    const { name } = req.params;
    try {
        const result = await sql`INSERT INTO buyLists (name) VALUES (${name}) ON CONFLICT (name) DO NOTHING RETURNING *;`;
        if (result.rows.length > 0) {
            res.status(201).json(result.rows[0]);
        } else {
            res.status(409).send('Buy list already exists');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

// Adds an item to a buy list
app.post('/buyLists/:name/items/:itemName', async (req, res) => {
    const { name, itemName } = req.params; // Extracts name and itemName from the path
    const { quantity } = req.body;
    try {
        const item = await sql`INSERT INTO items (itemName, quantity, bought, buyListName) VALUES (${itemName}, ${quantity}, false, ${name}) ON CONFLICT (itemName, buyListName) DO UPDATE SET quantity = items.quantity + EXCLUDED.quantity RETURNING *;`;
        res.status(200).json(item.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

// Removes an item from a buy list
app.delete('/buyLists/:name/items/:itemName', async (req, res) => {
    const { name, itemName } = req.params; // Extracts name and itemName from the path
    try {
        await sql`DELETE FROM items WHERE buyListName = ${name} AND itemName = ${itemName};`;
        res.status(200).send('Item removed');
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});


// Marks an item as bought in a buy list
app.patch('/buyLists/:name/items/:itemName', async (req, res) => {
    const { name, itemName } = req.params; // Extracts name and itemName from the path
    try {
        await sql`UPDATE items SET bought = true WHERE buyListName = ${name} AND itemName = ${itemName};`;
        res.status(200).send('Item marked as bought');
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

module.exports = app;
