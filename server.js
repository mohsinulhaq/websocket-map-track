const express = require('express');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

const updateInterval = 3000;
const toggleInterval = 8000;
const range = 0.01;
// a location near my college
const origin = {
  lat: 34.068998,
  lng: 74.8078893,
};

function getRandomNumberBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function startEmmision(socket) {
 const timer = setInterval(() => {
    socket.emit('randomCoordinates', {
      lat: origin.lat + getRandomNumberBetween(-range, range),
      lng : origin.lng + getRandomNumberBetween(-range, range),
    });
  }, updateInterval);

  setTimeout(() => {
    socket.emit('status', 'offline');
    clearInterval(timer);
    setTimeout(() => {
      socket.emit('status', 'online');
      startEmmision(socket);
    }, toggleInterval);
  }, toggleInterval);
}

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

http.listen(port);

io.on('connection', function(socket){
  socket.emit('initialCoordinates', origin);

  startEmmision(socket);
});
