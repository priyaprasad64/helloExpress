
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
//var db_name = "priyadb";
//var mongoose = require('mongoose');

var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;
    



var app = express();

// all environments
app.set('port', process.env.PORT || 3000);   //port set to 3000 which is why we type localhost:3000 to access the project
app.set('views', path.join(__dirname, 'views')); //this will give my project access to jade files
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') })); //not quite used in this project
app.use(express.static(path.join(__dirname, 'public')));


//for development purpose
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}



app.get('/', routes.index); //this routes to the first jade page and renders the first page
//app.get('/users', user.list);
app.get('/interface1',function(req,res){ // this renders the interface 1 . Please refer to inteface1.jade to see the code for rendering
	res.render('interface1', {title: 'Interface #1 : Enter Paragraph'});
 });


app.post('/interface1',function(req,res){  //this takes the data from interface1 and inserts into the database
  
   var paragraph = req.body.comments; //takes the textarea value in the name argument and stores it in var paragraph
   var data = {para:paragraph}; //sets the value of data to insert
   console.log(data); //prints the data in the console
   insert_db(data); //function defined below to insert data into the database
   res.render('interface1', {title: 'Interface #1 : Enter Paragraph'});  //This will render the interface 1 again after you click the submit button
 
});



app.get('/interface2', function(req, res){  //this renders the interface2 where the user needs to enter the keyword for search
  var keyword = req.query.keyword;  //the keyword value from interface2.jade comes to var keyword
  data = {}; 
  if(keyword){
  	query = {"para": { "$regex": keyword, "$options": 'i' }}  // This method is a pre-defined method in mongodb using which one can search for all the paragraphs in the database and retrieve the ones that match the keyword

  	
  	  MongoClient.connect('mongodb://127.0.0.1:27017/priyadb', function(err, db) {  //this connects to the database
	  var collection = db.collection('priyadb');  //reference to  the database name in collection
	   collection.find(query).toArray(function(err, docs) {  //to display all the paragraphs matching the keyword
	          if(docs){
	          	data = docs;  //refer to interface2.jade to see hwo the data is accessed in the jade page
	          }
	          console.log(data); 
	          res.render('interface2', { title: 'Interface #2 : Search for a keyword(s)',data:data }); //render the same page on hitting submit with the matching paragraphs

	          
	        });
	 });
  }
  else{
    res.render('interface2', { title: 'Interface #2 : Search for a keyword(s)',data:data });   
  }
});



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));  //connects to the server
});








function insert_db(data){  //method to insert value to the database
  MongoClient.connect('mongodb://127.0.0.1:27017/priyadb', function(err, db) {  //conencts to the database
  if (err) throw err;
  console.log("Connected to Database");  //prints a message to the console if the database is connected
  db.collection('priyadb').insert(data, function(err, records) {   //inserts the paragraph obtained from jade page to database priyadb
      if(err){
      res.send("There was a problem adding information to the database"); //prints error message if fails.
    }
    else{
      console.log("Record added as "+records[0]._id);  //console message for confirmation
      //if worked,forward to success page
     // res.redirect("interface2");
      //and set the header 
     // res.location("interface2");
    }
        //if (err) throw err;
        
    });
});











}





