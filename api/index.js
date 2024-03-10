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

// Retrieves a specific buy list by name
app.get('/buyLists/:name', async (req, res) => {
    const { name } = req.params;
    try {
        const result = await sql`SELECT items.* FROM buyLists JOIN items ON buyLists.name = items.buyListName WHERE buyLists.name = ${name};`;
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).send('No items in list, or list is not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

// Deletes a specific buy list by name
app.delete('/buyLists/:name', async (req, res) => {
    const { name } = req.params;
    try {
        const result = await sql`DELETE FROM buyLists WHERE name = ${name} RETURNING *;`;
        if (result.rows.length > 0) {
            res.status(200).send('Buy list deleted');
        } else {
            res.status(404).send('Buy list not found');
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

app.get('/privacy', (req, res) => {
    res.send(`Política de Privacidad de [Nombre de la Aplicación/Servicio]

    Última actualización: [Fecha]
    
    Bienvenido a [Nombre de la Aplicación/Servicio]. Nos comprometemos a proteger tu privacidad y a ser transparentes sobre cómo recopilamos, usamos y compartimos tu información. Esta Política de Privacidad se aplica a todas las interacciones que tienes con nuestra aplicación/servicio.
    
    1. Información que recopilamos
    
    Podemos recopilar datos personales y no personales que nos proporcionas directamente o que recopilamos automáticamente cuando usas nuestra aplicación/servicio. Esto puede incluir:
    
        Información de contacto como nombre, correo electrónico y número de teléfono.
        Datos de uso y preferencias para mejorar tu experiencia con nuestra aplicación/servicio.
        Información técnica sobre tu dispositivo, como la dirección IP y el tipo de navegador.
    
    2. Cómo usamos tu información
    
    Usamos tu información para:
    
        Proporcionar, mantener y mejorar nuestra aplicación/servicio.
        Comunicarnos contigo sobre actualizaciones, soporte y otros temas relevantes.
        Analizar cómo los usuarios interactúan con nuestra aplicación/servicio para mejorarla.
    
    3. Compartir tu información
    
    No compartimos tu información personal con terceros, excepto:
    
        Para cumplir con las leyes o responder a procesos legales.
        Para proteger los derechos y la seguridad de nuestra aplicación/servicio y de sus usuarios.
        Con proveedores de servicios que trabajan para nosotros bajo acuerdos de confidencialidad.
    
    4. Tus derechos y opciones
    
    Tienes derecho a acceder, corregir o eliminar tu información personal. También puedes oponerte al procesamiento de tus datos o solicitar que limitemos dicho procesamiento. Para ejercer estos derechos, por favor contáctanos a través de [correo electrónico/otro medio].
    
    5. Seguridad de la información
    
    Nos esforzamos por proteger tu información personal aplicando medidas de seguridad técnicas y organizativas adecuadas para prevenir el acceso, la pérdida o el uso indebido de tus datos.
    
    6. Cambios a nuestra Política de Privacidad
    
    Podemos actualizar nuestra Política de Privacidad ocasionalmente. Publicaremos cualquier cambio en esta página y, si los cambios son significativos, te proporcionaremos un aviso más destacado.
    
    Contacto
    
    Si tienes preguntas sobre esta Política de Privacidad, por favor contáctanos en [correo electrónico/otro medio].`);
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

module.exports = app;
