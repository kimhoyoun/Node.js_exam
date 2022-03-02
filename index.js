const http = require('http');
const express = require('express');
const app = express();
const router = express.Router();
// post 방식 데이터 전송
const bodyPaser = require('body-parser');

// 미들웨어
app.use(express.static(__dirname + "/public"));
app.use(bodyPaser.urlencoded({extended:false})); 
app.use(bodyPaser.json());

// ejs 뷰엔진 설정
app.set("views", __dirname +"/views");
app.set("view engine","ejs");

router.route("/").get((req,res)=>{
  res.writeHead(200,{"Content-Type":"text/html;charset=UTF-8"});
  res.write("<h1>Homepage</h1>")
  res.end("<h1>Hello Nodejs world</h1>");

});

router.route("/home").get((req,res)=>{
 req.app.render("home",{"user":"홍길동"},(err,html)=>{
    if(err) throw err;
    res.end(html);
 });
});

var carList = [
  {"no":1, "name":"Soanta","price":3000, "company":"HYUNDAI", "year":2019},
  {"no":2, "name":"BMW","price":7000, "company":"BMW", "year":2015},
  {"no":3, "name":"S80","price":6000, "company":"VOLVO", "year":2020},
  {"no":4, "name":"K7","price":3500, "company":"KIA", "year":2021},
];
var sequence = 5;
router.route("/car/list").get((req,res)=>{
  req.app.render("car_list",{"carList":carList},(err,html)=>{
     if(err) throw err;
     res.end(html);
  });
 });



 router.route("/car/input").post((req,res)=>{
  // POST 방식은 req.body에서 파라미터를 전달 받는다.
  var carData = {
    
    "no":sequence++,
    "name":req.body.name,
    "price":req.body.price,
    "company":req.body.company,
    "year":req.body.year,
  }
  carList.push(carData);
  res.redirect("list");
});

function findCar(no){
  var car = null;
  for(var i =0; i<carList.length; i++){
    if(carList[i].no == no){
      car = carList[i];
      break;
    } 
  }
  return car;
}

router.route("/car/detail/:no").get((req, res)=>{
  var no =parseInt(req.params.no);
  var car = findCar(no);

  req.app.render("car_detail",{"car":car},(err,html)=>{
    if(err) throw err;
    res.end(html);
  });
});

router.route("/car/modify/:no").get((req, res)=>{
  var no =parseInt(req.params.no);
  var car = findCar(no);

  req.app.render("car_modify",{"car":car},(err,html)=>{
    if(err) throw err;
    res.end(html);
  });
});

router.route("/car/modify/:no").post((req,res)=>{
  // POST 방식은 req.body에서 파라미터를 전달 받는다.
  var carData = {
    
    "no":req.body.no,
    "name":req.body.name,
    "price":req.body.price,
    "company":req.body.company,
    "year":req.body.year,
  }
  for (var i =0; i<carList.length; i++){
    if(carList[i].no == carData.no){
      carList.splice(i,1,carData);
      break;
    }
  }
  
  res.redirect("/car/list");
});

router.route("/car/delete/:no").get((req, res)=>{
  var no =parseInt(req.params.no);

  for(var i =0; i<carList.length; i++){
    if(carList[i].no == no){
      carList.splice(i,1);
    } 
  }
  res.redirect("/car/list");
});

router.route("/car/detail").get((req, res)=>{
  var no =req.query.no;
  console.log("no ==>> ", no);
});

app.use("/", router);
var server = http.createServer(app);
server.listen(3000, ()=>{
    console.log("서버 실행 중 >>> http://localhost:3000 ...");
});