const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

//set storage engine

const storage = multer.diskStorage({
  destination:'./public/uploads/',
  filename: function(req,file,cb){
  	cb(null,file.fieldname+'-'+Date.now()+path.extname(file.originalname));
  }
});
//init upload
const upload = multer({
  storage:storage,
  limits:{fileSize:10000000000},
  fileFilter:function(req,file,cb){
    AllowAllformat(file,cb);
  }

}).single('myImage');

//allow all
function AllowAllformat(file,cb){
  return cb(null,true);
}

//check file type
function checkFileTypeForImage(file,cb){
  //allowed ext
  const filetype=/jpeg|jpg|png|gif/;
  //check ext
  const extname=filetype.test(path.extname(file.originalname).toLowerCase());
  //check mimetype
  const mimetype=filetype.test(file.mimetype);
  if (extname && mimetype ) {
    return cb(null,true);
  }else{
    cb('Error: Images Only!')
  }  
}

//init app
const app=express();

//ejs
app.set('view engine', 'ejs');

//pulic folder
app.use(express.static('./public'));

app.get('/',(req,res)=>res.render('index'));
app.post('/upload',(req,res)=>{
	upload(req,res,(err)=>{
       if (err) {
       	res.render('index',{
       		msg:err
       	});
       }else{
       	if (req.file==undefined) {
       		res.render('index',{
       			msg:"Error: No File Selected"
       		})
       	}else{
       		// console.log(req.file);
         	res.render('index',{
         		msg:"File Uploaded",
         		file:`uploads/${req.file.filename}`
         	})
       	}
       }
	})
});

const port=3000;

app.listen(port, ()=>console.log(`Server is running on port ${port}`));