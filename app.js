//jshint esversion:6
const express = require("express");
const bodyParser =  require("body-parser");
const ejs = require("ejs")
const mongoose = require("mongoose");
const session = require("express-session");
const passport =  require("passport");
 const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.use(express.static("public"));
app.set('veiw engine','ejs');
app.use(bodyParser.urlencoded({

    extended:true
}));
// telling the app to start the sessions

app.use(session({
    secret: "ourlittlesecret",
    resave:false,
    saveUninitialized:false
}));

// telling the app to initialize the session and use passport to deal with the session
app.use(passport.initialize());
app.use(passport.session());





mongoose.connect("mongodb://localhost:27017/userDB" , {useNewUrlParser : true});


const userSchema = new mongoose.Schema({ 
    email: String,
    password: String
});


userSchema.plugin(passportLocalMongoose);



const User =  mongoose.model("User" , userSchema );


passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.get("/" , function(req,res){

res.render("home.ejs");

});

app.get("/login" , function(req,res){

    res.render("login.ejs");
    
    });

    app.get("/register" , function(req,res){
    
        res.render("register.ejs");

    });
    app.get("/secrets" , function(req,res){
    
        if (req.isAuthenticated()){
            
                res.render("secrets.ejs")
        }
        else{
            res.redirect("/login")
        }

    });
  
    app.get("/logout" , function(req,res){
    
        req.logout(function(err){
if(err){
    console.log(err);
} else{res.redirect("/");}

        });
        
    });
  



    // app.get("/articles", async (req, res) => {
    //     try {
    //       const articles = await Article.find({ });
    //       res.send(articles);
    //       console.log(articles);
    //     } catch (err) {
    //       console.log(err);
    //     }
    //   });



    //   app.post("/register",async(req,res)=>{
    //     try {
    //         const newUser = new User({
    //             email:req.body.username,
    //             password:req.body.password
    //         });
    //         const result = await newUser.save();
    //         if(result){
    //             res.render('secrets.ejs');
    //         }else{
    //             console.log("Login Failed");
    //         }
    //     } catch (err) {
    //         console.log(err);
    //     }
    // });

    //     app.post("/login",async(req,res)=>{
//         const username = req.body.username;
//         const password = req.body.password;
 
//     try {
//         const foundName = await User.findOne({username:username})
//         if(foundName){
//             if(foundName.password===password){
//                 res.render('secrets.ejs');
//             }else{
//                 console.log('Password Does not Match...Try Again !')
//             }
//         }else{
//             console.log("User Not found...")
//         }
//     } catch (err) {
//         console.log(err);
//     }

// });


    app.post("/register",function(req,res){
        
           User.register({username:req.body.username}, req.body.password , function(err, user){

                if(err){
                    console.log("err found");
                    res.redirect("/register.ejs")
                }
                    else{
                          passport.authenticate("local")(req,res , function (){

                            res.redirect("/secrets");
                            
                          });          
                    }


           });




            
          
        
    });




    app.post("/login", passport.authenticate("local"), function(req, res){
        res.redirect("/secrets");
    });





app.listen(3000 , function() {

console.log("server started at port 3000")

});