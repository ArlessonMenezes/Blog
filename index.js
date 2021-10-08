const express = require('express');
const app = express();
const session = require('express-session');
const connection = require('./database/database');

//Controllers
const categoriesController = require('./categories/CategoriesController');
const ArticlesController = require('./articles/ArticlesController'); 
const UserController = require('./user/userController');

//Models
const Article = require('./articles/Article');
const Category = require('./categories/Category');

//Abrindo conexão com banco de dados
 connection
    .authenticate()
    .then(() => console.log('Conexão feita com o banco de dados!'))
    .catch((msgErro) => console.log(msgErro));
    
//informando ao Express que sua view engine será o ejs
app.set('view engine', 'ejs');

//session
app.use(session({
    secret: 'umapalavraqualquer', 
    cookie: { maxAge: 90000000 }
}))
//informando ao Express que vai trabalhar com arquivos estaticos
app.use(express.static('public'))

//Traduzindo os dados para o express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Rotas
app.use('/', categoriesController);
app.use('/', ArticlesController);
app.use('/', UserController);

app.get('/', (req, res) => {
    Article.findAll({
        order: [
            ['id', 'DESC']
        ],
        limit: 4
    }).then(articles => {
        Category.findAll().then(category => {
            res.render('index', { articles: articles, categories: category })
        })
    })
});

app.get('/:slug', (req, res) => {
    let slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if(article != undefined) {
            Category.findAll().then(category => {
                res.render('article', { article: article, categories: category })
            })
        } else {
            res.redirect('/')
        }
    }).catch(err => {
        res.redirect('/');
    })
});

app.get('/category/:slug', (req, res) => {
    let slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}] // Efetuando um join nas tabelas
    }).then(category => {
        if(category != undefined){
            Category.findAll().then(categories => {
                res.render('index', {articles: category.articles, categories: categories})
            })
        } else {
            res.redirect('/');
        }
    }).catch(err => {
        res.redirect('/');
    })
})


//Subindo servidor
app.listen(3000, () => console.log('Servidor ON'));