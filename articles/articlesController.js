const express = require('express');
const router = express.Router();
const Category = require('../categories/Category');
const Article = require('./Article');
const slugify = require('slugify');


router.get('/admin/articles', (req, res) => {
    Article.findAll({
        include: [{ model: Category }]
    }).then(articles => {
        res.render('admin/articles/index', { articles: articles });
    });
});


router.get('/admin/articles/new', (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/articles/new", { categories: categories });
    });
});

router.post('/articles/save', (req, res) => {
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    console.log(title);
    console.log(body);
    console.log(category);

    Article.create({
        title: title,
        body: body,
        slug: slugify(title),
        categoryId: category
    }).then(() => {
        res.redirect('/admin/articles');
    });


});

// Deleting categories
router.post('/articles/delete', (req, res) => {
    var id = req.body.id;
    if (id != undefined) {
        if (!isNaN(id)) {
            Article.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect('/admin/articles');
            });

        } else {
            res.redirect('/admin/articles');
        }
    } else {
        res.redirect('/admin/articles');
    }
});

router.get("/admin/articles/edit/:id", (req, res) => {
    var id = req.params.id;
    Article.findByPk(id).then(article => {
        if (isNaN(id)) {
            res.redirect("/admin/articles");
        }

        if (article != undefined) {
            Category.findAll().then(categories => {
                res.render("admin/articles/edit", { article: article, categories: categories });
            });
        } else {
            res.redirect("/admin/articles");
        }
    }).catch(err => {
        res.redirect("/admin/articles");
    });
});

router.post("/articles/update", (req,res) => {
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    console.log(category);
    
    Article.update({title: title, slug:slugify(title), body: body, categoryId: category}, {
        where: {
            id:id
        }
    }).then(() => {
        res.redirect("/admin/articles");
    });
});

router.get("/articles/page/:num", (req, res) => {
    var page = req.params.num;
    var offset = 0;
    var articlesPerPage = 4;

    if(isNaN(page) || page == 1) {
        offset = 0;
    } else {
        offset = (parseInt(page)-1) * articlesPerPage;
    }



    Article.findAndCountAll({
        limit: articlesPerPage,
        offset: offset,
        order: [
            ['id', 'DESC']
        ]
    }).then(articles => {


        var next;

        if(offset + articlesPerPage >= articles.count) {
            next = false;
        } else {
            next = true;
        }

        console.log(offset);
        console.log(articlesPerPage);
        console.log(Article.count());
        console.log(next);
    
        var result = {
            next: next,
            articles: articles,
            page: parseInt(page)
        }

        Category.findAll().then(categories => {
            res.render("admin/articles/page",{result:result, categories:categories});
        })
        
    })
})

module.exports = router;