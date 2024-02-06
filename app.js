const express = require('express');
const bodyParser = require('body-parser');
const ejs = require ('ejs');
const app = express();
const mysql = require('mysql2');
const session = require('express-session');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'phpmyadmin',
  password: 'aluno',
  database: 'mydb',
  });
  //

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    throw err;
  }
  console.log('Conexão com o banco de dados MySQL estabelecida.');
});

//
app.use(
  session({
  secret: 'aluno',
  resave: true,
  saveUninitialized: true,
  })
  );
  //


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('home'); // Renderiza a tela de inicio
 
});


app.get('/postagem', (req, res) => {
  res.render('postagem'); // Renderiza a tela de inicio
 
});

app.get('/login', (req, res) => {
  res.render('login'); // Renderiza a tela de inicio
 
});

app.get('/cadastro', (req, res) => {
  res.render('cadastro'); // Renderiza a tela de inicio
 
});

app.get('/dash', (req, res) => {
  res.render('dash'); // Renderiza a tela de inicio
 
});

//
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  
  db.query(query, [username, password], (err, results) => {
  if (err) throw err;
  if (results.length > 0) {
    req.session.loggedin = true;
    req.session.username = username;
    res.redirect('/teste');
 
}});
  });
  
  // Rota para a página do painel
  app.get('/dash', (req, res) => {
    res.render('teste'); // Renderiza a tela de inicio
  
  //
  //
  //
  //modificação aqui
  if (req.session.loggedin) {
  //res.send(`Bem-vindo, ${req.session.username}!<br><a href="/logout">Sair</a>`);
  res.render('teste');
  } else {
  res.send('Faça login para acessar esta página. <a href="/">Login</a>');
  }
  });
  
  // Rota para fazer logout
  app.get('/logout', (req, res) => {
  req.session.destroy(() => {
  res.redirect('/');
  });
  });

  
    // CREATE
app.post('/submit_post', (req, res) => {
  const { mensagens } = req.body;
  const sql = 'INSERT INTO Postagens (mensagens) VALUES (?)';
  db.query(sql, [mensagens], (err, result) => {
    if (err) throw err;
    res.redirect('/teste');
  });
});

app.post('/cadastro', (req, res) => {
  const { username, email, password } = req.body;
  const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  db.query(sql, [username, email, password, number], (err, result) => {
    if (err) {
      console.error('Erro ao inserir usuário:', err);
      res.redirect('/cadastro'); // Redireciona de volta ao formulário de cadastro em caso de erro
    } else {
      // Cadastro bem-sucedido; você pode redirecionar para a página de login ou outra página.
      res.redirect('/');
    }
  });
});

// DELETE
app.get('/delete/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM users WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.redirect('/postagem');
  });
});

app.get('/delete2/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM Postagens WHERE id = ?';
  console.log('Delete post')
  
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.redirect('/teste');
  });
});



// READ
app.get('/teste', (req, res) => {
  db.query('SELECT * FROM Postagens', (err, result) => {
    if (err) throw err;
    res.render('postagem', { Postagens: result });
  });
});
      


const port = 3000;
app.listen(port, () => {
  console.log(`Servidor em execução na porta ${port}`);
});
