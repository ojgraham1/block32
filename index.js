const express = require("express");
const pg = require('pg');
const app = express();

const client = new pg.Client('postgres://localhost/acme_icecream');
client.connect();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

//GET /api/flavors
app.get('/api/flavors', async(req, res, next)=>{
    try {
        const result = await client.query('SELECT * FROM flavors');
        res.send(result.rows)
    }catch(err){
        next(err)
    }
})

//GET /api/flavors/:id
app.get('/api/flavors/:id', async(req, res, next)=>{
    try {
        const result = await client.query('SELECT * FROM flavors WHERE id=$1',[req.params.id]);
        res.send(result.rows[0])
    }catch(err){
        next(err)
    }
})

app.post('/api/flavors', async (req, res, next) => {
    try {
        const { name, is_favorite } = req.body;
        const result = await client.query('INSERT INTO flavors (name, is_favorite, created_at, updated_at) VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *', [name, is_favorite]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        next(err);
    }
});

//DELETE /api/flavors/:id 
app.delete('/api/flavors/:id', async(req, res, next)=>{
    try {
        await client.query('DELETE FROM flavors WHERE id=$1',[req.params.id]);
        res.send(`Deleted flavor with id ${req.params.id}`)
        }catch(err){
            next(err)
            }
            })

//PUT /api/flavors/:id
app.put('/api/flavors/:id', async (req, res, next) => {
    try {
        const { name, is_favorite } = req.body;
        const result = await client.query('UPDATE flavors SET name=$1, is_favorite=$2, updated_at=CURRENT_TIMESTAMP WHERE id=$3 RETURNING *', [name, is_favorite, req.params.id]);
        res.json(result.rows[0]);
    } catch (err) {
        next(err);
    }
});

app.listen(3000, () => {
    console.log("app runs");
});