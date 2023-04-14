
const express=require('express');
const bodyParser=require("body-parser");
const mySql=require("mysql2");

const app=express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/"));



// ------------------------------------------------- mySQL --------------------------------------------- //


var con = mySql.createPool({
    connectionLimit: 100,
    database: 'freedb_dbmsProject',
    host: 'sql.freedb.tech',
    user: 'freedb_rocky',
    password: 's%YV%e2Cf@M?qnb',
    port: 3306
});


// ------------------------------------------------- GET REQUESTS --------------------------------------------- //


app.get("/",(req,res)=>{
    res.redirect("/login");
});

app.get("/admin",(req,res)=>{

    handleAdmin()
    .then(data=>{
        console.log("res= \n",data)
        res.render(__dirname+"/views/admin.ejs", data);
    });

});

app.get("/login",(req,res)=>{
    res.render(__dirname+"/views/login.ejs");
});

app.get("/register",(req,res)=>{
    res.render(__dirname+"/views/register.ejs");
});

app.get("/home",(req,res)=>{

    res.render(__dirname+"/views/home.ejs");
});

app.get("/home/:getGroup",(req,res)=>{
    const group=req.params.getGroup;
    const options={options:[], group:group};
    var valid = false;
    // console.log(group);
    if(group==="nso"){
        options.options=nso;
        valid= true;
    }else if(group==="ncc"){
        options.options=ncc;
        valid= true;
    }else if(group==="ssg"){
        options.options=ssg;
        valid= true;
    }
    // console.log(options);
    res.render(__dirname+"/views/"+ (valid===true ? "form":"home") +".ejs",options);
});

// ------------------------------------------------- POST REQUESTS --------------------------------------------- //

app.post("/login",(req,res)=>{

    const loginUser={
        username: req.body.username,
        password: req.body.password
    };

    users.forEach((object)=>{
        (object.username === loginUser.username   &&   object.password === loginUser.password) ? res.redirect("/home"): null;
    }); 

    res.redirect("/");
});

app.post("/register",(req,res)=>{

    const newUser={
        username: req.body.username,
        password: req.body.password,
        registered: false
    };
    users.push(newUser);

    res.redirect("/home");
});

app.post("/home/:getGroup",(req,res)=>{
    const group=req.params.getGroup;
    // console.log('In the post request: ', req.body, req.params);
    
    const newRow=[req.body.name, req.body.rollNo, req.body.gender, req.body.phoneNo, req.body.email, group, req.body.subGame];
    console.log(newRow);

    var sql = "insert into dbms values (?,?, ?, ?, ?, ?, ?)";
    con.query(sql, newRow ,function (err, result) {
    if (err) throw err;
    console.log("Successfully inserted ", result);
  });
    res.redirect("/home");
});




// ------------------------------------------------- LISTEN --------------------------------------------- //
const port=8000;
app.listen(port, ()=>{
    console.log("Server started on "+port);
});





// --------------------------------------- //

const users=[];
const admin={ username: "boobguy", password: "assguy" };
const nso=["Cricket","Football","Badminton","Tennis","Table Tennis","Volleyball","Basketball"];
const ncc=["none"];
const ssg=["Polio Drops Drive","Blood Donation","Tree Plantation","Beach Clean-up","Awareness Rally"];
