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
const createTableUsuarios = `
    CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        senha VARCHAR(255) NOT NULL
    )
`;

connection.query(createTableUsuarios, (err, result) => {
    if (err) {
        console.error('Erro ao criar tabela:', err);
    } else {
        console.log('Tabela criada ou já existente.');
    }
});

// Cria a tabela para o carrinho (se ainda não existir)
const createTableCarrinhos = `
    CREATE TABLE IF NOT EXISTS carrinhos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL,
        codProduto INT NOT NULL,
        quantidade INT NOT NULL,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    )
`;

connection.query(createTableCarrinhos, (err, result) => {
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
            const user = results[0];
            console.log('Login bem-sucedido!');
            // Retornar o nome do usuário juntamente com o ID
            res.json({ success: true, userId: user.id, nome: user.nome });
        } else {
            console.log('Email ou senha incorretos.');
            res.json({ success: false });
        }
    });
});

// Rota para adicionar os produtos ao carrinho.
app.post('/inserirCarrinho', (req, res) => {
    const { usuario_id, codProduto } = req.body;
    const selectSql = 'SELECT * FROM carrinhos WHERE usuario_id = ? AND codProduto = ?';
    const insertSql = 'INSERT INTO carrinhos (usuario_id, codProduto, quantidade) VALUES (?, ?, ?)';
    const values = [usuario_id, codProduto, 1];

    // Verificar se o produto já está no carrinho do usuário
    connection.query(selectSql, [usuario_id, codProduto, 1], (selectErr, selectResults) => {
        if (selectErr) {
            console.error('Erro ao verificar se o produto já está no carrinho:', selectErr);
            res.status(500).json({ error: 'An error occurred' });
        } else if (selectResults.length > 0) {
            console.log('O produto já está no carrinho.');
            res.json({ success: false, message: 'O produto já está no carrinho.' });
        } else {
            // Se o produto não estiver no carrinho, inserir
            connection.query(insertSql, values, (insertErr, insertResults) => {
                if (insertErr) {
                    console.error('Erro ao inserir no carrinho:', insertErr);
                    res.status(500).json({ error: 'An error occurred' });
                } else {
                    console.log('Produto adicionado ao carrinho com sucesso!');
                    res.json({ success: true });
                }
            });
        }
    });
});

app.post('/carrinho', (req, res) => {
    const { usuario_id } = req.body;
    const selectSql = 'SELECT codProduto FROM carrinhos WHERE usuario_id = ?';
    const values = [usuario_id];

    connection.query(selectSql, values, (err, results) => {
        if (err) {
            console.error('Erro ao verificar produtos no carrinho:', err);
            res.status(500).json({ error: 'Ocorreu um erro' });
        } else {
            if (results.length > 0) {
                // Mapear os resultados para obter um vetor de códigos de produtos
                const produtosNoCarrinho = results.map(result => result.codProduto);
                console.log('Produtos no carrinho:', produtosNoCarrinho);
                res.json({ success: true, produtos: produtosNoCarrinho });
            } else {
                console.log('O carrinho está vazio.');
                res.json({ success: true, message: 'O carrinho está vazio.' });
            }
        }
    });
});

app.post('/removerCarrinho', (req, res) => {
    const { produto_id } = req.body;
    const selectSql = 'DELETE FROM carrinhos WHERE codProduto = ?';
    const values = [produto_id];

    connection.query(selectSql, values, (err, results) => {
        if (err) {
            console.error('Erro ao verificar produtos no carrinho:', err);
            res.status(500).json({ error: 'Ocorreu um erro' });
        } else {
            if (results.length > 0) {
                res.json({ success: true});
            } else {
                console.log('O carrinho está vazio.');
                res.json({ success: true, message: 'O carrinho está vazio.' });
            }
        }
    });
});

app.listen(3000, () => console.log('Server is running on port 3000'));
