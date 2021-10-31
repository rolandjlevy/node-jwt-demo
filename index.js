const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
const cookieParser = require('cookie-parser')
const app = express();
app.use(express.urlencoded());
app.use(cookieParser());
const port = 3000;

app.get('/', (req , res) => {
  res.sendFile(__dirname + '/login.html');
});

app.post('/login', (req, res) => {
  const mockUser = { id: 1, name: 'Roland' };
  const user = Object.keys(req.body).length ? {...req.body} : {...mockUser};
  // create token and store it in local storage
  jwt.sign({ user }, 'secretkey', { expiresIn: '60s' }, (err, token) => {
    res.json({
      token
    })
    // res.send(
    //   `<h3>See posts</h3>
    //   <form action="/posts" method="post">
    //     <input type="text" name="token" value="${token}"/>
    //     <button type="submit">Go</button>
    //   </form>`
    // );
  });
});

const verifyToken = (req, res, next) => {
  // get the auth header value
  const bearerHeader = req.headers['authorization'];
  if (bearerHeader) {
    const bearerToken = bearerHeader.split(':')[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403); // forbidden
  }
}

app.post('/posts', verifyToken, (req , res) => {
  jwt.verify(req.token, 'secretkey', (err, data) => {
    if (err) {
      res.sendStatus(403); // forbidden
    } else {
      res.json({
        message: 'Received posts',
        data
      });
    }
  })
});

app.listen(port, () => {
  console.log('Listening on port', port);
});