const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const issRoutes = require('./routes/issRoutes');

const app = express();

app.use(express.json());
app.use(cors());



connectDB();
app.get('/', (req,res)=>{
    res.json({mensagem:'ISS API rodando!'});
});

app.use('/iss', issRoutes);

//rodar localmente
if(process.env.NODE_ENV !== 'production'){
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, ()=> console.log(`Servidor rodando na porta ${PORT}`));
}

module.exports = app;