const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const multer  = require('multer') //파일업로드 기능 multer 사용하기 위한 불러오기
//데이터베이스의 데이터 입력,출력을 위한 함수명령어 불러들이는 작업
const app = express();
const port = 5000;

//ejs 태그를 사용하기 위한 세팅
app.set("view engine","ejs");
//사용자가 입력한 데이터값을 주소로 통해서 전달되는 것을 변환(parsing)
app.use(express.urlencoded({extended: true}));
app.use(express.json()) 
//css/img/js(정적인 파일)사용하려면 이코드를 작성!
app.use(express.static('public'));

// 데이터 베이스 연결작업
let db; //데이터베이스 연결을 위한 변수세팅(변수의 이름은 자유롭게 지어도 됨)

MongoClient.connect("mongodb+srv://02skdisk:Aa9755815@cluster0.pbta6ip.mongodb.net/?retryWrites=true&w=majority",function(err,result){
    //에러가 발생했을경우 메세지 출력(선택사항)
    if(err) { return console.log(err); }
    
    //위에서 만든 db변수에 최종연결 ()안에는 mongodb atlas 사이트에서 생성한 데이터베이스 이름
    db = result.db("portfolio2");
    
    //db연결이 제대로 됬다면 서버실행
    app.listen(port,function(){
        console.log("서버연결 성공");
    });

});
//파일 첨부후 서버에 전달 할 때 multer library 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/upload') //업로드 폴더 지정
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8'))
      //영어가 아닌 다른 파일명 안깨지고 나오게 처리
    }
  })
  
const upload = multer({ storage: storage })
//upload는 위의 설정사항을 담은 변수(상수) 

app.get("/", (req, res) => {
    db.collection("product").find().toArray((err, productResult) => {
      
      
      db.collection("news").find().toArray((err, newsResult) => {
        
        res.render("index", {productResult:productResult,newsResult:newsResult});
      });
    });
  });

//상품등록 페이지
app.get("/shop/insert",(req,res)=>{
    res.render("prd_insert.ejs",{login:req.user});
})

//상품들 데이터베이스에 등록처리
app.post("/dbupload",upload.array("thumbnail"),(req,res)=>{
    // console.log(req.file); 파일정보들 확인
    let fileNames = [];
    for(let i=0; i<req.files.length; i++){
        fileNames[i] = req.files[i].filename
        // 첨부한 파일들의 파일명만 뽑아서 배열에 옮겨담음
    }
    db.collection("count").findOne({name:"상품갯수"},(err,countResult)=>{
        db.collection("product").insertOne({
            num:countResult.prdCount,
            title:req.body.title,
            price:req.body.price,
            attachfile:fileNames,
        },(err,result)=>{
            db.collection("count").updateOne({name:"상품갯수"},{$inc:{prdCount:1}},(err,result)=>{
                res.redirect(`/shop/detail/${countResult.prdCount}`)
               //  /detail/${countResult.prdCount}
            })
        })
    })
})



//상품 상세화면페이지
app.get("/shop/detail/:num",(req,res)=>{

    db.collection("product").findOne({num:Number(req.params.num)},(err,productResult)=>{
        //find로 찾아온 데이터값은 result에 담긴다
        //상세페이지 보여주기위해서 찾은 데이터값을 함께 전달한다.
        res.render("prd_detail.ejs",{productResult:productResult,login:req.user});
    })
})


//상품등록 수정화면 페이지 요청
app.get("/shop/update/:num",(req,res)=>{
    db.collection("product").findOne({num:Number(req.params.num)},(err,result)=>{

        res.render("prd_update.ejs",{productResult:productResult,login:req.user});
    })
})


//  상품 데이터베이스 수정
app.post("/dbupdate",upload.single("thumbnail"),(req,res)=>{
    // 첨부파일 첨부하지 않았을 때 경우는 아직 구현 안함
    db.collection("product").updateOne({num:Number(req.body.num)},{$set:{title:req.body.title,text:req.body.text,price:req.body.price,attachfile:req.file.filename}},(err,result)=>{
       res.redirect(`/shop/detail/${req.body.num}`)
    })
})
app.get("/dbdelete/:num",(req,res)=>{
   db.collection("product").deleteOne({num:Number(req.params.num)},(err,result)=>{
       //게시글 삭제후 게시글 목록페이지로 요청
       res.redirect("/shop")
   })
})


//파일 첨부후 서버에 전달 할 때 multer library 설정
const storage2 = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/upload2') //업로드 폴더 지정
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8'))
      //영어가 아닌 다른 파일명 안깨지고 나오게 처리
    }
  })
  
const upload2 = multer({ storage: storage2 })
//upload는 위의 설정사항을 담은 변수(상수) 


//뉴스등록 페이지
app.get("/news/insert",(req,res)=>{
    res.render("news_insert.ejs",{login:req.user});
})

//상품들 데이터베이스에 등록처리
app.post("/dbupload2",upload2.array("thumbnail"),(req,res)=>{
    // console.log(req.file); 파일정보들 확인
    let fileNames = [];
    for(let i=0; i<req.files.length; i++){
        fileNames[i] = req.files[i].filename
        // 첨부한 파일들의 파일명만 뽑아서 배열에 옮겨담음
    }
    db.collection("count").findOne({name:"뉴스갯수"},(err,countResult)=>{
        db.collection("news").insertOne({
            num:countResult.newsCount,
            title:req.body.title,
            newsDetail:req.body.newsDetail,
            attachfile:fileNames,
        },(err,result)=>{
            db.collection("count").updateOne({name:"뉴스갯수"},{$inc:{newsCount:1}},(err,result)=>{
                res.redirect(`/news/detail/${countResult.newsCount}`)
            })
        })
    })
})



//뉴스 상세화면페이지
app.get("/news/detail/:num",(req,res)=>{

    db.collection("news").findOne({num:Number(req.params.num)},(err,newsResult)=>{
        //find로 찾아온 데이터값은 result에 담긴다
        //상세페이지 보여주기위해서 찾은 데이터값을 함께 전달한다.
        res.render("news_detail.ejs",{newsResult:newsResult,login:req.user});
    })
})


//상품등록 수정화면 페이지 요청
app.get("/news/update/:num",(req,res)=>{
    db.collection("news").findOne({num:Number(req.params.num)},(err,result)=>{

        res.render("news_update.ejs",{newsResult:newsResult,login:req.user});
    })
})


//  상품 데이터베이스 수정
app.post("/dbupdate2",upload.single("thumbnail"),(req,res)=>{
    // 첨부파일 첨부하지 않았을 때 경우는 아직 구현 안함
    db.collection("news").updateOne({num:Number(req.body.num)},{$set:{title:req.body.title,text:req.body.text,price:req.body.price,attachfile:req.file.filename}},(err,result)=>{
       res.redirect(`/news/detail/${req.body.num}`)
    })
})
app.get("/dbdelete2/:num",(req,res)=>{
   db.collection("news").deleteOne({num:Number(req.params.num)},(err,result)=>{
       //게시글 삭제후 게시글 목록페이지로 요청
       res.redirect("/news")
   })
})

