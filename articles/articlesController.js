const express = require('express');
const router = express.Router();
const Category = require('../categories/Category');
const Article = require('./Article');
const slugify = require('slugify');


router.get('/admin/articles', (req, res) => {
    Article.findAll({
        include: [{model: Category}]
    }).then(articles => {
        res.render('admin/articles/index', {articles:articles});
    });
});

Article.findAll({
    include: [{model: Category}]
}).then(articles => {
    console.log(articles);
});

router.get('/admin/articles/new', (req,res) => {
    Category.findAll().then(categories => {
        res.render("admin/articles/new",{categories:categories});
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
    if(id != undefined) {
        if(!isNaN(id)) {
            Article.destroy({
                where: {
                    id:id
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







module.exports = router;