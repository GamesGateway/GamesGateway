const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const app = express();
const path = require('path');

// middleware cors com opções adicionais
app.use(cors({
    origin: '*', // Permitir todas as origens
    methods: ['GET', 'POST'], // Permitir métodos GET e POST
    allowedHeaders: ['Content-Type'], // Permitir o cabeçalho Content-Type
    preflightContinue: true, // Permitir que a requisição continue mesmo se a requisição preflight não passar nos controles de acesso
    optionsSuccessStatus: 204 // status para enviar se a requisição preflight for bem-sucedida
}));

app.use(express.static(path.join('C:', 'Users', 'João Vieira', 'OneDrive', 'Área de Trabalho', 'aplicacao interativa', 'Cadastrojs')));


app.use(bodyParser.json());

// Conexão com o banco de dados
const connection = mysql.createConnection({
    host: 'db-cadastro.mysql.database.azure.com',
    user: 'jvsn',
    password: '86637366Mae*',
    database: 'cadastros',
    port: 3306
});

// Crie a tabela (se ainda não existir)
const createTableSQL = `
    CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        senha VARCHAR(255) NOT NULL
    )
`;

connection.query(createTableSQL, (err, result) => {
    if (err) {
        console.error('Erro ao criar tabela:', err);
    } else {
        console.log('Tabela criada ou já existente.');
    }
});

// Rota para inserir dados no banco
app.post('/inserirDados', (req, res) => {
    const { nome, email, senha } = req.body;
    const sql = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
    const values = [nome, email, senha];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Erro ao inserir dados:', err);
            res.status(500).json({ error: 'An error occurred' });
        } else {
            console.log('Cadastro Realizado com sucesso!');
            res.json({ success: true });
        }
    });
});

// Rota para verificar login
app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    const sql = 'SELECT * FROM usuarios WHERE email = ? AND senha = ?';
    const values = [email, senha];

    connection.query(sql, values, (err, results) => {
        if (err) {
            console.error('Erro ao verificar login:', err);
            res.status(500).json({ error: 'An error occurred' });
        } else if (results.length > 0) {
            console.log('Login bem-sucedido!');
            res.json({ success: true });
        } else {
            console.log('Email ou senha incorretos.');
            res.json({ success: false });
        }
    });
});

app.listen(3000, () => console.log('Server is running on port 3000'));
