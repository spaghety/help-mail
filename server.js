const express = require("express");
const app = express();
const http = require("http").createServer(app);

app.get("*", function(req,res) {
    console.log(req.originalUrl);
    if (req.originalUrl.substring(0,5) == "/src/"){
        res.sendFile(__dirname+"/public"+req.originalUrl);
    }else{
        res.sendFile(__dirname+"/public/main.html");
    }
});

http.listen(80, function(){
    console.log("listening on: 80");
});