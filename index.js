var express = require('express');
var pgp = require('pg-promise')();

var app = express();
var connection = {
  host:"ec2-54-235-124-2.compute-1.amazonaws.com",
  port:5432,
  database:"d5f2jhp9vvsgqh",
  user: "yaxjxskpbuqhrp",
  password:"a59tP-DWsdUu06qjF05JhGDcNg",
  ssl: true
}

var db = pgp(connection);
//var connectionString = "postgres://yaxjxskpbuqhrp:a59tP-DWsdUu06qjF05JhGDcNg@ec2-54-235-124-2.compute-1.amazonaws.com:5432/d5f2jhp9vvsgqh"

app.set('port', process.env.PORT || 3000);

var getFromDatabase = function(queryString, callback){
  var results = [];
  console.log(queryString);
  db.any(queryString, [true])
    .then(function (data) {
        // success;
        callback(data, null)
    })
    .catch(function (error) {
        // error;
        callback(null, error)
    });
}

app.get('/coupon/all', function(req,res){
  var queryString = "SELECT c.*, b.name"
            + " FROM coupon c"
            + " INNER JOIN business b"
            + " on c.business_id = b.id";
  getFromDatabase(queryString, function(results, error){
    if(error){
      res.status(500).json(error)
    }else{
      res.json(results);
    }
  })
});



app.get('/coupon/:id', function(req,res){
  var couponId =req.params.id;
  var queryString = "SELECT c.*, b.name"
            + " FROM coupon c"
            + " INNER JOIN business b"
            + " ON c.business_id = b.id"
            + " WHERE  c.id = " + couponId;
  getFromDatabase(queryString, function(results, error){
    if(error){
      res.status(500).json(error)
    }else{
      res.json(results);
    }
  });
})


app.get('/business/all', function(req,res){
  console.log('here')
  var queryString = "SELECT * FROM business";
  getFromDatabase(queryString, function(results, error){
    if(error){
      res.status(500).json(error)
    }else{
      res.json(results);
    }
  });

})

app.get('/business/coupons/:id', function(req,res){
  var businessId =req.params.id;
  var queryString = "SELECT c.*"
            + " FROM coupon c"
            + " INNER JOIN business b"
            + " ON c.business_id = b.id"
            + " WHERE  b.id = " + businessId;
  getFromDatabase(queryString, function(results, error){
    if(error){
      res.status(500).json(error)
    }else{
      res.json(results);
    }
  });
})

app.get('/business/:id', function(req,res){
  var businessId =req.params.id;
  var queryString = "SELECT b.*"
            + " FROM business b"
            + " WHERE  b.id = " + businessId;
  getFromDatabase(queryString, function(results, error){
    if(error){
      res.status(500).json(error)
    }else{
      res.json(results);
    }
  });
})


app.get('/test', function(req,res){
  res.json({msg:"got it"})
});

var server = app.listen(app.get('port'), function(){
  console.log("Express server listening on port" + server.address().port);
})
