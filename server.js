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

// if user is active, then extends cookie expiracy.
const customAuthMiddleware = (req, res, next) => { 
  if (req.signedCookies.user) {
    const user = req.signedCookies.user;
    res.cookie('user', user, cookieOptions);
    next();
  } else {
    res.sendStatus(403);
  }
};

app.get('/login', (req,res) => {
  const user = "satomi@gmail.com";
  res.cookie('user', user, cookieOptions);
  res.send('Success');
})

app.get('/logout', (req, res) => {
  console.log(cluster.worker.id);
  if (req.signedCookies.user) {
    res.clearCookie('user');
    res.send('LOGOUT SUCCESS')
  } else {
    res.sendStatus(403);
  }
})

app.use(customAuthMiddleware);
app.get('/private', (req, res) => {
  console.log(cluster.worker.id);
  res.send(`You are authenticated: ${req.signedCookies.user}`);
});



app.listen(5000);

module.exports = app;