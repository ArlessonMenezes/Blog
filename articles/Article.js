//Model
const Sequelize = require('sequelize');
const connection = require('../database/database');
const Category = require('../categories/Category');

const Article = connection.define('articles', {
    title: {
        type: Sequelize.STRING,
        allowNull: false      
    },
    
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },

    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

Category.hasMany(Article); //Definindo relacionameto 1 para muitos
Article.belongsTo(Category); //Definindo relaciomento 1 para 1

Article.sync({ force: false });

module.exports = Article;