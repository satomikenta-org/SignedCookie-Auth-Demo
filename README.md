# SignedCookie-Auth-Demo
SignedCookie Authentication Demo

* TODO:
remote IP address validation (except access from mobile device *1)

* 1. store ip in cookie when loggedIn.
* 2. If ip address is different from login's, then clearCookie() and res.sendStatus(500) or something.

*(*1) using mobile-detect.js  

* [For more Security]
* add rate-limit(express-slow-down etc) middleware on login route. 
* hasing(using "upash" library etc) cookie payload and verify it. 
