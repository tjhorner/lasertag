/*
 * GET home page.
 */
var Models = require('../config/models');

exports.index = function(req, res){
	var player = new Models.Player("bob");
	res.render('index', { title: JSON.stringify(player), extraClasses: "" });
};

exports.scoreboard = function(req, res){
	res.render('scoreboard', { title: "Scoreboard", extraClasses: "no-margin" });
}