var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/extrem');

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title: String,
    date: String,
    description: String
});

mongoose.model('Article', ArticleSchema);

var Article = mongoose.model('Article');

var article = new Article({
   title: 'new event',
   date: '01.02.03',
   description: 'new event will be there'
});

article.save();

var app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/app'));

app.get('/api/articles', function(req, res) {
    Article.find(function(err, docs) {
        docs.forEach(function(item) {
            console.log('GET id: ' + item._id);
        });
        res.send(docs);
    });
});
app.post('/api/articles', function(req, res) {
	console.log('POST request:');
	for (var key in req.body) {
		console.log(key + ': ' + req.body[key]);
	}
	var article = new Article(req.body);
	article.save(function(err, doc) {
		res.send(doc);
	});
});
app.delete('/api/articles/:id', function(req, res) {
	console.log('DELETE request for _id: ' + req.params.id);
	Article.remove({_id: req.params.id}, function(err, doc) {
		res.send({_id: req.params.id});
	});
});
app.put('/api/articles/:id', function(req, res) {
	console.log('UPDATE request for _id: ' + req.params.id);
	Article.update({_id: req.params.id}, req.body, function(err) {
		res.send({_id: req.params.id});
	});
});

var port = 3000;

app.listen(port);
console.log('server on ' + port);