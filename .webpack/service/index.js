module.exports=function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s="./index.js")}({"./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! exports provided: loginFunction, signupFunction, validateTokenFunction, isAliveFunction, vtnc */function(e,t,n){"use strict";n.r(t),n.d(t,"loginFunction",function(){return a}),n.d(t,"signupFunction",function(){return u}),n.d(t,"validateTokenFunction",function(){return i}),n.d(t,"isAliveFunction",function(){return c}),n.d(t,"vtnc",function(){return d});var o=n(/*! ./src/controllers/user/login */"./src/controllers/user/login.js"),r=n(/*! ./src/controllers/user/signup */"./src/controllers/user/signup.js"),s=n(/*! ./src/controllers/user/validateToken */"./src/controllers/user/validateToken.js");const a=o.login,u=r.signup,i=s.validateToken,c=e=>{console.log("body: ",e.body),console.log("httpMethod: ",e.httpMethod),console.log("queryStringParameters: ",e.queryStringParameters),console.log("multiValueQueryStringParameters: ",e.multiValueQueryStringParameters),console.log("stageVariables: ",e.stageVariables),console.log("resource: ",e.resource),console.log("pathParameters: ",e.pathParameters)},d=e=>{console.log("event: ",e)}},"./src/controllers/user/login.js":
/*!***************************************!*\
  !*** ./src/controllers/user/login.js ***!
  \***************************************/
/*! exports provided: login, default */function(e,t,n){"use strict";n.r(t),n.d(t,"login",function(){return f});var o=n(/*! bcrypt */"bcrypt"),r=n.n(o),s=n(/*! jsonwebtoken */"jsonwebtoken"),a=n.n(s),u=n(/*! dotenv */"dotenv"),i=n.n(u),c=n(/*! ../../status */"./src/status.js"),d=n(/*! ../../db/Mongodb */"./src/db/Mongodb.js");i.a.config();let l=null;const f=async e=>{const{username:t,password:n}=JSON.parse(e.body),{SECRET:o,MONGO_URL:s}=e.stageVariables||{SECRET:"weednaoehganja",MONGO_URL:"weednaoehganja"};try{const u=(l=await Object(d.default)({conn:l,mongoUrl:e.stageVariables?`mongodb+${s}`:void 0})).model("users"),i=await u.findOne({username:t});if(!i)return{status:c.default.UNAUTHORIZED.code,body:JSON.stringify({error:"user/not-found"})};if(!await r.a.compare(n,i.password))return{statusCode:c.default.UNAUTHORIZED.code,body:JSON.stringify({error:"user/wrong-password"})};const f=a.a.sign({username:t,ida:i._id},o,{expiresIn:"1h"});return{statusCode:c.default.ACCEPTED.code,body:JSON.stringify({data:{ida:i._id,token:f}})}}catch(e){return{statusCode:c.default.INTERNAL_SERVER_ERROR.code,body:JSON.stringify({error:e})}}};t.default=f},"./src/controllers/user/signup.js":
/*!****************************************!*\
  !*** ./src/controllers/user/signup.js ***!
  \****************************************/
/*! exports provided: signup, default */function(e,t,n){"use strict";n.r(t),n.d(t,"signup",function(){return l});var o=n(/*! dotenv */"dotenv"),r=n.n(o),s=n(/*! jsonwebtoken */"jsonwebtoken"),a=n.n(s),u=n(/*! ../utils */"./src/controllers/utils.js"),i=n(/*! ../../db/Mongodb */"./src/db/Mongodb.js"),c=n(/*! ../../status */"./src/status.js");r.a.config();let d=null;const l=async e=>{const{username:t,password:n}=JSON.parse(e.body),{SECRET:o,MONGO_URL:r}=e.stageVariables||{SECRET:"weednaoehganja",MONGO_URL:"weednaoehganja"};try{const s=(d=await Object(i.default)({conn:d,mongoUrl:e.stageVariables?`mongodb+${r}`:void 0})).model("users");if(await s.findOne({username:t}))return{statusCode:c.default.UNAUTHORIZED.code,error:"auth/duplicated-user"};const l=new s({username:t,password:await Object(u.hashPassword)(n)});await l.save();const f=a.a.sign({username:t,ida:l._id},o,{expiresIn:"1h"});return{statusCode:c.default.CREATED.code,body:JSON.stringify({data:{ida:l._id,token:f}})}}catch(e){return{statusCode:c.default.INTERNAL_SERVER_ERROR.code,body:JSON.stringify({error:e})}}};t.default=l},"./src/controllers/user/validateToken.js":
/*!***********************************************!*\
  !*** ./src/controllers/user/validateToken.js ***!
  \***********************************************/
/*! exports provided: validateToken, default */function(e,t,n){"use strict";n.r(t),n.d(t,"validateToken",function(){return i});var o=n(/*! jsonwebtoken */"jsonwebtoken"),r=n.n(o),s=n(/*! dotenv */"dotenv"),a=n.n(s),u=n(/*! ../../status */"./src/status.js");a.a.config();const i=async e=>{const{token:t}=JSON.parse(e.body);console.log("token: ",t);const{SECRET:n}=e.stageVariables||{SECRET:"weednaoehganja"};console.log("SECRET: ",n);try{const e=await r.a.verify(t,n);return{statusCode:200,body:JSON.stringify(e)}}catch(e){return{statusCode:u.default.UNAUTHORIZED.code,body:JSON.stringify({error:u.default.UNAUTHORIZED.tag})}}};t.default=i},"./src/controllers/utils.js":
/*!**********************************!*\
  !*** ./src/controllers/utils.js ***!
  \**********************************/
/*! exports provided: hashPassword, default */function(e,t,n){"use strict";n.r(t),n.d(t,"hashPassword",function(){return s});var o=n(/*! bcrypt */"bcrypt"),r=n.n(o);const s=async e=>{return await new Promise((t,n)=>{r.a.hash(e,10,(e,o)=>{e&&n(e),t(o)})})};t.default=s},"./src/db/Mongodb.js":
/*!***************************!*\
  !*** ./src/db/Mongodb.js ***!
  \***************************/
/*! exports provided: default */function(e,t,n){"use strict";n.r(t);var o=n(/*! mongoose */"mongoose"),r=n.n(o),s=n(/*! ./models/users.model */"./src/db/models/users.model.js");r.a.Promise=global.Promise,t.default=(async({conn:e,mongoUrl:t="mongodb://localhost/auth-ida"})=>{console.log("mongoUrl: ",t);try{if(!e){console.log("=> using new database connection"),r.a.model("users",s.default);const e=await r.a.createConnection(t,{bufferCommands:!1,bufferMaxEntries:0,keepAlive:!0});return e.model("users",s.default),e}return console.log("=> using existing database connection"),e}catch(e){throw e}})},"./src/db/models/users.model.js":
/*!**************************************!*\
  !*** ./src/db/models/users.model.js ***!
  \**************************************/
/*! exports provided: default */function(e,t,n){"use strict";n.r(t);var o=n(/*! mongoose */"mongoose");const r=new o.Schema({username:{type:String,unique:!0,required:!0},password:{type:String,required:!0},active:{type:Boolean,default:!0},confirmed:{type:Boolean,default:!1},last_login:{type:Date,default:Date.now()}},{usePushEach:!0,timestamps:{updatedAt:"updated_at",createdAt:"created_at"}});t.default=r},"./src/status.js":
/*!***********************!*\
  !*** ./src/status.js ***!
  \***********************/
/*! exports provided: default */function(e,t,n){"use strict";n.r(t),t.default={SUCCESS:{code:200,tag:"success"},CREATED:{code:201,tag:"register"},ACCEPTED:{code:202,tag:"accepted"},BAD_REQUEST:{code:400,tag:"bad-request"},UNAUTHORIZED:{code:401,tag:"unauthorized"},INTERNAL_SERVER_ERROR:{code:500,tag:"internal-server-error"}}},bcrypt:
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/*! no static exports found */function(e,t){e.exports=require("bcrypt")},dotenv:
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/*! no static exports found */function(e,t){e.exports=require("dotenv")},jsonwebtoken:
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/*! no static exports found */function(e,t){e.exports=require("jsonwebtoken")},mongoose:
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/*! no static exports found */function(e,t){e.exports=require("mongoose")}});
//# sourceMappingURL=index.js.map