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


app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));

//TEMPORARY CAN BE HUGE SECURITY FLAW
// WITH THIS APP IS OPEN TO ANYONE TO CREATE
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST","PUT");
  next();
});

var interactWithDatabase = function(queryString, callback){
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
  interactWithDatabase(queryString, function(results, error){
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
  interactWithDatabase(queryString, function(results, error){
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
  interactWithDatabase(queryString, function(results, error){
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
  interactWithDatabase(queryString, function(results, error){
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
  interactWithDatabase(queryString, function(results, error){
    if(error){
      res.status(500).json(error)
    }else{
      res.json(results);
    }
  });
})

app.get('/user/:userid/coupons', function(req,res){
  var userID =req.params.userid;
  var queryString = "SELECT      c.*"
                  +" FROM        coupon c"
                  +" INNER JOIN  users_coupon uc"
                  +"   ON        uc.coupon_id=c.id"
                  +" WHERE uc.users_id = " + userID;

  interactWithDatabase(queryString, function(results, error){
    if(error){
      res.status(500).json(error)
    }else{
      res.json(results);
    }
  });
})

app.post('/user/:userid/coupons/:couponid', function(req,res){
  var userID =req.params.userid;
  var couponID = req.params.couponid;
  var queryString = "INSERT INTO users_coupon (coupon_id, users_id)"
                  +" VALUES("+couponID+","
                  +" (SELECT id"
                  +" FROM users"
                  +" WHERE id = "+userID+"));"

  interactWithDatabase(queryString, function(results, error){
    if(error){
      res.status(500).json(error)
    }else{
      res.json({success:true});
    }
  });
})

app.delete('/user/:userid/coupons/:couponid', function(req, res){
  var userID =req.params.userid;
  var couponID = req.params.couponid;
  var queryString = "DELETE FROM users_coupon"
                  +" WHERE users_id = "+userID+" AND coupon_id = "+couponID+";"
  interactWithDatabase(queryString, function(results, error){
    if(error){
      res.status(500).json({
        success: false,
        error: error
      })
    }else{
      res.json({success:true});
    }
  });
})

app.get('/login/:email/:password', function(req, res){
  var email =req.params.email;
  var password = req.params.password;
  var queryString = "SELECT FROM users"
                  +" WHERE users_id = "+userID+" AND coupon_id = "+couponID+";"
  interactWithDatabase(queryString, function(results, error){
    if(error){
      res.status(500).json({
        success: false,
        error: error
      })
    }else{
      res.json({success:true,
                user_data: results});
    }
  });
});


app.get('/test', function(req,res){
  res.json({msg:"got it"})
});

var server = app.listen(app.get('port'), function(){
  console.log("Express server listening on port" + server.address().port);
})
