var dataPosts = [];
var MongoClient = require('mongodb').MongoClient;  
var blogs;

var connect = MongoClient.connect('mongodb://127.0.0.1:27017/test', 
  function(err, db) {
    if(err) 
      throw err;
    
    console.log('connected to the database');
    blogs = db.collection('blogs');
    blogs.find().toArray(function(err, docs) {
      docs.forEach(function(doc){
        dataPosts.push(doc);
        console.log(doc);
        return dataPosts;
      });
    });
});

// GET

exports.posts = function (req, res) {
  var posts = [];
  dataPosts.forEach(function (post, i) {
    posts.push({
      id: i,
      title: post.title,
      text: post.text.substr(0, 50) + '...'
    });
  });
  res.json({
    posts: posts
  });
};

exports.post = function (req, res) {
  var id = req.params.id;
  if (id >= 0 && id < dataPosts.length) {
    res.json({
      post: dataPosts[id]
    });
  } else {
    res.json(false);
  }
};

// POST

exports.addPost = function (req, res) {
  dataPosts.push(req.body);
  res.json(req.body);
  blogs.insert(req.body, function(err,doc){
    console.log(doc);
  });
};

// PUT

exports.editPost = function (req, res) {
  var id = req.params.id;

  if (id >= 0 && id < dataPosts.length) {
    var oldPost = dataPosts[id];
    dataPosts[id] = req.body;
    blogs.update(oldPost, {title: dataPosts[id].title, 
      text:dataPosts[id].text}, 
      {w:1}, function(err, doc){
        console.log(doc);
    });
    res.json(true);
  } else {
    res.json(false);
  }
};


// DELETE

exports.deletePost = function (req, res) {
  var id = req.params.id;

  if (id >= 0 && id < dataPosts.length) {
    dataPosts.splice(id, 1);
    blogs.remove(dataPosts[id], function(err,doc){
      console.log(doc);
    });
    res.json(true);
  } else {
    res.json(false);
  }
};
