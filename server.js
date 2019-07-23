const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

const cookieOptions = {
  secure: false,  // in production, use https and set secure: true.
  httpOnly: true, 
  signed: true, 
  maxAge: 60 * 60 * 24 * 1000, // expiracy in browser: 24hours
  sameSite: true  // for CSRF 
};

app.use(helmet());
// If not serving content to client (ex. API server), not need below.
// CSR app (like React, Vue) with AWS Amplify console, you can set CSP header in amplify console instead.  
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    // :If You are using outsource style or script (bootstrap etc), Fill below to permit.
    // scriptSrc: ["'self'", 'code.jquery.com', 'maxcdn.bootstrapcdn.com'],
    // styleSrc: ["'self'", 'maxcdn.bootstrapcdn.com'],
    // fontSrc: ["'self'", 'maxcdn.bootstrapcdn.com']
  }
}));
app.use(cors()); // in production, set your domain(maybe client-side domain).
app.use(cookieParser('SUPER_SECRET_FROM_ENV')); // get from env variable accutually.

app.get('/login', (req,res) => {
  const userInfo = { // get from DB acctually.
    id: "sato@gmail.com", // or user_id etc  // TODO: better to be hashed ?
    exp: new Date().getTime() + 60 * 60 * 24 * 1000 // set expiracy of cookie in order to check if expired or not in server-side. 
  };
  res.cookie('user', userInfo, cookieOptions);
  res.send('Success');
})

app.get('/logout', (req, res) => {
  if (req.signedCookies.user) {
    res.clearCookie('user'); // NOTICE: if cookie stolen by attacker, attacker can access until cookie expiration time. 
    res.send('LOGOUT SUCCESS')
  } else {
    res.sendStatus(403);
  }
})

const customAuthMiddleware = (req, res, next) => { 
  if (req.signedCookies.user) { // no need to validate signedCookie. cookie-parser automatically validates.
    // check the expiracy of cookie
    if (req.signedCookies.user.exp > new Date().getTime()) {
     return next();
    }
  } 
  res.sendStatus(403);
};

app.get('/private', customAuthMiddleware, (req, res) => {
  res.send(`You are: ${req.signedCookies.user.id}`);
});



app.listen(5000);

module.exports = app;