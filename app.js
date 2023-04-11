const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/blogDB");

const homeStartingContent = "Welcome to my blog website! My name is Nate Karns, and I am excited to share my thoughts and experiences with you through this platform. I developed this app as part of a challenge in a bootcamp that I am currently taking, and it has been an incredible learning experience. Behind the scenes, this website is powered by ejs, mongodb, and mongoose on the back end. These technologies work together seamlessly to display the posts that you, the user, type in. Whether it's a personal reflection, a travel diary, or a recipe, this website provides a space for you to share your stories and connect with others who may have similar experiences. I hope you enjoy browsing through my blog and reading about my adventures. Don't forget to leave a comment and share your thoughts as well!";
const aboutContent = "Hello and welcome to my website! My name is Nate Karns, and I am a student at Michigan State University studying marketing. However, my passion lies in the world of web development, which is why I am currently enrolled in a full stack coding bootcamp. Through this program, I have gained a solid foundation in a variety of programming languages, including HTML, CSS, JavaScript, and more. I have also learned how to use frameworks and tools such as Node.js, Express, MongoDB, and Mongoose, to name just a few. I am excited to apply my skills and knowledge to create websites and web applications that are both aesthetically pleasing and functional. As a marketing student, I am particularly interested in creating websites that not only look great, but also effectively communicate a brand's message and values to its target audience.I believe that the world of web development is constantly evolving, and I am eager to continue learning and staying up-to-date on the latest trends and technologies. Thank you for visiting my website, and please feel free to reach out if you have any questions or if you would like to collaborate on a project.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({}).then(foundPosts => {
    res.render("home", {startingContent: homeStartingContent, posts: foundPosts})
  })
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  // const post = {
  //   title: req.body.postTitle,
  //   content: req.body.postBody
  // };

  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save().then(savedPost => {
    console.log("Post saved successfully");
    res.redirect("/");
  }).catch(err => {
    console.log(err);
  })


});

app.get("/posts/:postId", function(req, res){
  const requestedTitle = _.lowerCase(req.params.postName);
  const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}).exec().then(foundPost => {
    res.render("post", {title: foundPost.title, content: foundPost.content});
  }).catch(err => {
    console.log(err);
  })

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
