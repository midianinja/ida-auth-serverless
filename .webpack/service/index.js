module.exports=function(e){var n={};function o(t){if(n[t])return n[t].exports;var r=n[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,o),r.l=!0,r.exports}return o.m=e,o.c=n,o.d=function(e,n,t){o.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,n){if(1&n&&(e=o(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(o.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)o.d(t,r,function(n){return e[n]}.bind(null,r));return t},o.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(n,"a",n),n},o.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},o.p="",o(o.s="./index.js")}({"./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! exports provided: loginFunction, signupFunction, validateTokenFunction, isAliveFunction */function(e,n,o){"use strict";o.r(n),o.d(n,"loginFunction",(function(){return a})),o.d(n,"signupFunction",(function(){return c})),o.d(n,"validateTokenFunction",(function(){return i})),o.d(n,"isAliveFunction",(function(){return l}));var t=o(/*! ./src/controllers/user/login */"./src/controllers/user/login.js"),r=o(/*! ./src/controllers/user/signup */"./src/controllers/user/signup.js"),s=o(/*! ./src/controllers/user/validateToken */"./src/controllers/user/validateToken.js");const a=t.login,c=r.signup,i=s.validateToken,l=()=>({statusCode:200,headers:{"Access-Control-Allow-Credentials":!0,"Access-Control-Allow-Origin":"*","Content-Type":"application/json"},body:JSON.stringify({})})},"./src/controllers/user/login.js":
/*!***************************************!*\
  !*** ./src/controllers/user/login.js ***!
  \***************************************/
/*! exports provided: login, default */function(e,n,o){"use strict";o.r(n),o.d(n,"login",(function(){return f}));var t=o(/*! bcrypt */"bcrypt"),r=o.n(t),s=o(/*! jsonwebtoken */"jsonwebtoken"),a=o.n(s),c=o(/*! dotenv */"dotenv"),i=o.n(c),l=o(/*! ../../status */"./src/status.js"),u=o(/*! ../../db/Mongodb */"./src/db/Mongodb.js");i.a.config();let d=null;const f=async e=>{const{username:n,password:o}=JSON.parse(e.body),{SECRET:t,MONGO_URL:s}=e.stageVariables||{SECRET:"weednaoehganja",MONGO_URL:process.env.MONGO_URL};try{const e=(d=await Object(u.default)({conn:d,mongoUrl:s})).model("users"),c=await e.findOne({username:n});if(!c)return{status:l.default.UNAUTHORIZED.code,headers:{"Access-Control-Allow-Credentials":!0,"Access-Control-Allow-Origin":"*","Content-Type":"application/json"},body:JSON.stringify({error:"user/not-found"})};const i=await r.a.compare(o,c.password);if(console.log("match: ",i),!i)return{statusCode:l.default.UNAUTHORIZED.code,headers:{"Access-Control-Allow-Credentials":!0,"Access-Control-Allow-Origin":"*","Content-Type":"application/json"},body:JSON.stringify({error:"user/wrong-password"})};const f=a.a.sign({username:n,ida:c._id},t,{expiresIn:"1h"});return console.log("token: ",f),{statusCode:l.default.ACCEPTED.code,headers:{"Access-Control-Allow-Credentials":!0,"Access-Control-Allow-Origin":"*","Content-Type":"application/json"},body:JSON.stringify({data:{ida:c._id,token:f}})}}catch(e){return console.log("error: ",e),{statusCode:l.default.INTERNAL_SERVER_ERROR.code,headers:{"Access-Control-Allow-Credentials":!0,"Access-Control-Allow-Origin":"*","Content-Type":"application/json"},body:JSON.stringify({error:e})}}};n.default=f},"./src/controllers/user/signup.js":
/*!****************************************!*\
  !*** ./src/controllers/user/signup.js ***!
  \****************************************/
/*! exports provided: signup, default */function(e,n,o){"use strict";o.r(n),o.d(n,"signup",(function(){return d}));var t=o(/*! dotenv */"dotenv"),r=o.n(t),s=o(/*! jsonwebtoken */"jsonwebtoken"),a=o.n(s),c=o(/*! ../utils */"./src/controllers/utils.js"),i=o(/*! ../../db/Mongodb */"./src/db/Mongodb.js"),l=o(/*! ../../status */"./src/status.js");r.a.config();let u=null;const d=async e=>{const{username:n,password:o}=JSON.parse(e.body),{SECRET:t,MONGO_URL:r}=e.stageVariables||{SECRET:"weednaoehganja",MONGO_URL:process.env.MONGO_URL};try{const e=(u=await Object(i.default)({conn:u,mongoUrl:r})).model("users");if(await e.findOne({username:n}))return{statusCode:l.default.UNAUTHORIZED.code,headers:{"Access-Control-Allow-Credentials":!0,"Access-Control-Allow-Origin":"*","Content-Type":"application/json"},error:"auth/duplicated-user"};const s=new e({username:n,password:await Object(c.hashPassword)(o)});await s.save();const d=a.a.sign({username:n,ida:s._id},t,{expiresIn:"1h"});return{statusCode:l.default.CREATED.code,headers:{"Access-Control-Allow-Credentials":!0,"Access-Control-Allow-Origin":"*","Content-Type":"application/json"},body:JSON.stringify({data:{ida:s._id,token:d}})}}catch(e){return{statusCode:l.default.INTERNAL_SERVER_ERROR.code,headers:{"Access-Control-Allow-Credentials":!0,"Access-Control-Allow-Origin":"*","Content-Type":"application/json"},body:JSON.stringify({error:e})}}};n.default=d},"./src/controllers/user/validateToken.js":
/*!***********************************************!*\
  !*** ./src/controllers/user/validateToken.js ***!
  \***********************************************/
/*! exports provided: validateToken, default */function(e,n,o){"use strict";o.r(n),o.d(n,"validateToken",(function(){return i}));var t=o(/*! jsonwebtoken */"jsonwebtoken"),r=o.n(t),s=o(/*! dotenv */"dotenv"),a=o.n(s),c=o(/*! ../../status */"./src/status.js");a.a.config();const i=async e=>{const{token:n}=JSON.parse(e.body);console.log("token: ",n);const{SECRET:o}=e.stageVariables||{SECRET:"weednaoehganja"};console.log("SECRET: ",o);try{const e=await r.a.verify(n,o);return{statusCode:200,headers:{"Access-Control-Allow-Credentials":!0,"Access-Control-Allow-Origin":"*","Content-Type":"application/json"},body:JSON.stringify(e)}}catch(e){return{statusCode:c.default.UNAUTHORIZED.code,headers:{"Access-Control-Allow-Credentials":!0,"Access-Control-Allow-Origin":"*","Content-Type":"application/json"},body:JSON.stringify({error:c.default.UNAUTHORIZED.tag})}}};n.default=i},"./src/controllers/utils.js":
/*!**********************************!*\
  !*** ./src/controllers/utils.js ***!
  \**********************************/
/*! exports provided: hashPassword, default */function(e,n,o){"use strict";o.r(n),o.d(n,"hashPassword",(function(){return s}));var t=o(/*! bcrypt */"bcrypt"),r=o.n(t);const s=async e=>{return await new Promise((n,o)=>{r.a.hash(e,10,(e,t)=>{e&&o(e),n(t)})})};n.default=s},"./src/db/Mongodb.js":
/*!***************************!*\
  !*** ./src/db/Mongodb.js ***!
  \***************************/
/*! exports provided: default */function(e,n,o){"use strict";o.r(n);var t=o(/*! mongoose */"mongoose"),r=o.n(t),s=o(/*! ./models/users.model */"./src/db/models/users.model.js");r.a.Promise=global.Promise,n.default=async({conn:e,mongoUrl:n=""})=>{console.log("mongoUrl: ",n);try{if(!e){console.log("=> using new database connection"),r.a.model("users",s.default);const e=await r.a.createConnection(n,{bufferCommands:!1,bufferMaxEntries:0,keepAlive:!0});return e.model("users",s.default),e}return console.log("=> using existing database connection"),e}catch(e){throw e}}},"./src/db/models/users.model.js":
/*!**************************************!*\
  !*** ./src/db/models/users.model.js ***!
  \**************************************/
/*! exports provided: default */function(e,n,o){"use strict";o.r(n);var t=o(/*! mongoose */"mongoose");const r=new t.Schema({username:{type:String,unique:!0,required:!0},password:{type:String,required:!0},active:{type:Boolean,default:!0},confirmed:{type:Boolean,default:!1},last_login:{type:Date,default:Date.now()}},{usePushEach:!0,timestamps:{updatedAt:"updated_at",createdAt:"created_at"}});n.default=r},"./src/status.js":
/*!***********************!*\
  !*** ./src/status.js ***!
  \***********************/
/*! exports provided: default */function(e,n,o){"use strict";o.r(n),n.default={SUCCESS:{code:200,tag:"success"},CREATED:{code:201,tag:"register"},ACCEPTED:{code:202,tag:"accepted"},BAD_REQUEST:{code:400,tag:"bad-request"},UNAUTHORIZED:{code:401,tag:"unauthorized"},INTERNAL_SERVER_ERROR:{code:500,tag:"internal-server-error"}}},bcrypt:
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/*! no static exports found */function(e,n){e.exports=require("bcrypt")},dotenv:
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/*! no static exports found */function(e,n){e.exports=require("dotenv")},jsonwebtoken:
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/*! no static exports found */function(e,n){e.exports=require("jsonwebtoken")},mongoose:
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/*! no static exports found */function(e,n){e.exports=require("mongoose")}});
//# sourceMappingURL=index.js.map