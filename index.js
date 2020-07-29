const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');

const categoriesController = require('./categories/categoriesController');
const articlesController = require("./articles/articlesController");

const Article = require('./articles/Article');
const Category = require('./categories/Category');

// Setting view engine
app.set('view engine', 'ejs');

// Setting body parser to work with form data and JSON.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use static structures (CSS, etc.)
app.use(express.static('public'));

// Database connection
connection
    .authenticate()
    .then(() => {
        console.log("Database connection has been made!");
    }).catch((error) => {
        console.log(error);
    });


app.get('/', (req,res) => {
    Article.findAll({
        order: [
            ['id', 'DESC']
        ]
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render("index", {articles:articles, categories:categories});
        });
        
    });
});



app.get("/:slug", (req,res) => {
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug:slug
        }
    }).then(article => {
        if(article != undefined) {
            Category.findAll().then(categories => {
                res.render("article", {article:article, categories:categories});
            });
        } else {
            res.redirect('/');
        }
        
    }).catch( err => {
        console.log(err);
        res.redirect('/');
    });
});

app.get("/category/:slug", (req, res) => {
    var slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then(category => {
        if (category != undefined) {
            Category.findAll().then(categories => {
                res.render("index", {articles: category.articles, categories: categories})
            });
            
        } else {
            res.redirect('/');
        }
    }).catch( err => {
        res.redirect('/');
    });
});

// Categories and Articles controllers
app.use('/', categoriesController);
app.use('/', articlesController);


//Putting server to listen
app.listen(8080, () => {
    console.log("Server is up and running!");
});