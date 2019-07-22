const express = require('express');
const cluster = require('cluster');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();


const cookieOptions = {
  httpOnly: true, 
  signed: true, 
  maxAge: 60 * 60 * 24 * 1000, // expiracy: 24hours
  // secure: true 
  // sameSite: true  // for CSRF 
};

app.use(cors());
app.use(cookieParser('SUPER_SECRET_FROM_ENV'));

const customAuthMiddleware = (req, res, next) => { 
  if (req.signedCookies.user) {
    // check the expiracy of cookie
    if (req.signedCookies.user.exp > new Date().getTime()) {
     return next();
    }
    console.log("expired");
  } 
  res.sendStatus(403);
};

app.get('/login', (req,res) => {
  const userInfo = {
    id: "sato@gmail.com",
    exp: new Date().getTime() + 60 * 60 * 24 * 1000 
  };
  res.cookie('user', userInfo, cookieOptions);
  res.send('Success');
})

app.get('/logout', (req, res) => {
  if (req.signedCookies.user) {
    res.clearCookie('user');
    res.send('LOGOUT SUCCESS')
  } else {
    res.sendStatus(403);
  }
})

app.use(customAuthMiddleware);
app.get('/private', (req, res) => {
  res.send(`You are authenticated: ${req.signedCookies.user}`);
});



app.listen(5000);

module.exports = app;