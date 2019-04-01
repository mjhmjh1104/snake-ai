var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.redirect('/index.html');
});

var PORT = process.env.PORT || 3000;
app.listen(PORT, function(req, res) {
  console.log('Server on');
});
