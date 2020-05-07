const fs = require("fs");
const http = require("http");
const https = require("https");
const express = require("express");
const session = require("express-session");
const socketio = require("socket.io");

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

app.use(session({secret: 'testsecret', saveUninitialized: true, resave: true}));
app.use((req, res) => {
    var sess;
    if (req.originalUrl.substring(0,5) == "/src/"){
        res.sendFile(__dirname+"/public"+req.originalUrl);
    }else{
        if (req.originalUrl == "/.well-known/acme-challenge/d-Mz6dDPSHeJMdZvecEeLkcfNnIvIG1TbaECB3JlHis"){
            res.send("d-Mz6dDPSHeJMdZvecEeLkcfNnIvIG1TbaECB3JlHis.6eWW8a5Jn9D_oCziWtECWojm8Y257QNokwh2f2AF_K8");
        }else if (req.originalUrl != "/socket.io/socket.io.js"){
            res.sendFile(__dirname+"/public/main.html");
        }
    }
});
const httpServer = http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
});
const httpsServer = https.createServer(credentials, app);

var io = socketio(httpsServer);

io.on("connection", function(socket){
    console.log("a user has connected from "+socket.request.connection.remoteAddress);
    socket.on("newNote", function(note){
        io.emit("displayNote", note);
    });
});

httpServer.listen(80, () => {
    console.log("HTTP Server running on port 80");
});
httpsServer.listen(443, () => {
    console.log("HTTPS Server running on port 443");
});