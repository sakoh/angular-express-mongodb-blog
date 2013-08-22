dataPosts = []
MongoClient = require("mongodb").MongoClient
blogs = undefined
i = 0
oldPost = []
connect = MongoClient.connect "mongodb://127.0.0.1:27017/test", (err, db) ->
  throw err  if err
  console.log "connected to the database"
  blogs = db.collection("blogs")
  blogs.find().toArray (error, docs) ->
    docs.forEach (doc) -> 
      dataPosts.push doc 
      console.log doc

# GET
exports.posts = (req, res) ->
  posts = []
  dataPosts.forEach (post, i) ->
    posts.push
      id: i
      title: post.title
      text: post.text.substr(0, 50) + "..."

  res.json posts: posts

exports.post = (req, res) ->
  id = req.params.id
  if 0 <= id < dataPosts.length
    res.json post: dataPosts[id]
  else
    res.json false

# POST
exports.addPost = (req, res) ->
  dataPosts.push req.body
  res.json req.body
  blogs.insert req.body, (err, doc) -> console.log doc

# PUT
exports.editPost = (req, res) ->
  id = req.params.id
  if 0 <= id < dataPosts.length
    i++
    oldPost[i] = dataPosts[id]
    dataPosts[id] = req.body
    blogs.update {title: oldPost[i].title},
      $set:
        {title: dataPosts[id].title, text: dataPosts[id].text}
      ,{w:1}, (err, doc) -> console.log doc

    res.json true
  else
    res.json false

# DELETE
exports.deletePost = (req, res) ->
  id = req.params.id
  if id >= 0 and id < dataPosts.length
    i++
    oldPost[i] = dataPosts[id]
    dataPosts.splice id, 1
    blogs.remove oldPost[i], (err, doc) -> console.log doc
    
    res.json true
  else
    res.json false
