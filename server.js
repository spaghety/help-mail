const fs = require("fs");
const http = require("http");
const https = require("https");
const express = require("express");

const app = express();

//Certificate
const privateKey = fs.readFileSync("/etc/letsencrypt/live/helpmail.io/privkey.pem", "utf-8");
const certificate = fs.readFileSync("/etc/letsencrypt/live/helpmail.io/cert.pem", "utf-8");
const ca = fs.readFileSync("/etc/letsencrypt/live/helpmail.io/chain.pem", "utf-8");

const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
};

app.use((req, res) => {
    console.log(req.originalUrl);
    if (req.originalUrl.substring(0,5) == "/src/"){
        res.sendFile(__dirname+"/public"+req.originalUrl);
    }else{
        if (req.originalUrl == "/.well-known/acme-challenge/d-Mz6dDPSHeJMdZvecEeLkcfNnIvIG1TbaECB3JlHis"){
            res.send("d-Mz6dDPSHeJMdZvecEeLkcfNnIvIG1TbaECB3JlHis.6eWW8a5Jn9D_oCziWtECWojm8Y257QNokwh2f2AF_K8");
        }else{
            res.sendFile(__dirname+"/public/main.html");
        }
    }
});

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(80, () => {
    console.log("HTTP Server running on port 80");
});

httpsServer.listen(443, () => {
    console.log("HTTPS Server running on port 443");
});

/*app.get("*", function(req,res) {
    console.log(req.originalUrl);
    if (req.originalUrl == "/.well-known/acme-challenge/d-Mz6dDPSHeJMdZvecEeLkcfNnIvIG1TbaECB3JlHis"){
        res.send("d-Mz6dDPSHeJMdZvecEeLkcfNnIvIG1TbaECB3JlHis.6eWW8a5Jn9D_oCziWtECWojm8Y257QNokwh2f2AF_K8");
    }else if (req.originalUrl.substring(0,5) == "/src/"){
        res.sendFile(__dirname+"/public"+req.originalUrl);
    }else{
        res.sendFile(__dirname+"/public/main.html");
    }
});

http.listen(80, function(){
    console.log("listening on: 80");
});*/