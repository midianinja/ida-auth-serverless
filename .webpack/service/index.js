module.exports=function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s="./index.js")}({"./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! exports provided: getUserFunction, loginFunction, signupFunction, validateTokenFunction, generateCodeFunction, validateCodeFunction, sendEmailValidationFunction, validateEmailTokenFunction, isAliveFunction */function(e,t,n){"use strict";n.r(t),n.d(t,"getUserFunction",function(){return l}),n.d(t,"loginFunction",function(){return c}),n.d(t,"signupFunction",function(){return u}),n.d(t,"validateTokenFunction",function(){return f}),n.d(t,"generateCodeFunction",function(){return g}),n.d(t,"validateCodeFunction",function(){return y}),n.d(t,"sendEmailValidationFunction",function(){return p}),n.d(t,"validateEmailTokenFunction",function(){return O}),n.d(t,"isAliveFunction",function(){return C});var o=n(/*! ./src/controllers/user/find */"./src/controllers/user/find.js"),r=n(/*! ./src/controllers/user/login */"./src/controllers/user/login.js"),s=n(/*! ./src/controllers/user/signup */"./src/controllers/user/signup.js"),a=n(/*! ./src/controllers/user/validateToken */"./src/controllers/user/validateToken.js"),i=n(/*! ./src/controllers/user/phone */"./src/controllers/user/phone.js"),d=n(/*! ./src/controllers/user/email */"./src/controllers/user/email.js");const l=o.getUser,c=r.login,u=s.signup,f=a.validateToken,g=i.generateCode,y=i.validateCode,p=d.sendEmailValidation,O=d.validateEmailToken,C=()=>({statusCode:200,headers:{"Access-Control-Allow-Credentials":!0,"Access-Control-Allow-Origin":"*","Content-Type":"application/json"},body:JSON.stringify({})})},"./src/controllers/user/email.js":
/*!***************************************!*\
  !*** ./src/controllers/user/email.js ***!
  \***************************************/
/*! exports provided: sendEmailValidation, validateEmailToken */function(e,t,n){"use strict";n.r(t),n.d(t,"sendEmailValidation",function(){return f}),n.d(t,"validateEmailToken",function(){return g});var o=n(/*! aws-sdk */"aws-sdk"),r=n.n(o),s=n(/*! jsonwebtoken */"jsonwebtoken"),a=n.n(s),i=n(/*! ../../status */"./src/status.js"),d=n(/*! ../../db/Mongodb */"./src/db/Mongodb.js");r.a.config.region="us-west-2";const l=new r.a.SES;let c=null;const u={"Access-Control-Allow-Credentials":!0,"Access-Control-Allow-Origin":"*","Content-Type":"application/json"},f=async e=>{const{email:t,ida:n}=JSON.parse(e.body),{SECRET:o,MONGO_URL:r,WEB_URI:s}=e.stageVariables||{SECRET:"weednaoehganja",MONGO_URL:process.env.MONGO_URL,WEB_URI:"http://localhost:8080"};let f=/^[a-z0-9._-]{2,}@[a-z0-9]{2,}\.[a-z]{2,}(\.[a-z]{2})?$/.test(t);if(!f)return{statusCode:i.default.BAD_REQUEST.code,headers:u,body:JSON.stringify({error:"email/invalid-email"})};if(!(f=/^[0-9a-fA-F]{24}$/.test(n)))return{statusCode:i.default.BAD_REQUEST.code,headers:u,body:JSON.stringify({error:"email/invalid-ida"})};const g={email:{address:t,valid:!1,token:a.a.sign({email:t,ida:n},o,{expiresIn:"1h"})}},y=(c=await Object(d.default)({conn:c,mongoUrl:r})).model("users");let p,O;try{p=await y.findOneAndUpdate({_id:n},g,{new:!0})}catch(e){return{statusCode:i.default.INTERNAL_SERVER_ERROR.code,headers:u,body:JSON.stringify({error:e})}}if(!p)return{statusCode:i.default.BAD_REQUEST.code,headers:u,body:JSON.stringify({error:"phone/invalid-ida"})};try{O=await((e,t,n)=>new Promise((o,r)=>{l.sendEmail(((e,t,n)=>({Destination:{ToAddresses:[t.address]},Message:{Body:{Html:{Charset:"UTF-8",Data:`Clique <a href="${n}/ativacao/${e}?token=${t.token}">aqui</a> para validar sua conta.`},Text:{Charset:"UTF-8",Data:`Seu link de ativação: ${n}/ativacao/${e}?token=${t.token}`}},Subject:{Charset:"UTF-8",Data:"Test email"}},Source:"gabrielfurlan05@gmail.com"}))(e,t,n),(e,t)=>{e?r(e):o(t)})}))(n,g.email,s)}catch(e){return{statusCode:i.default.BAD_REQUEST.code,headers:u,body:JSON.stringify({error:"email/to-send"})}}return{statusCode:i.default.SUCCESS.code,headers:u,body:JSON.stringify(O)}},g=async e=>{const{ida:t,token:n}=JSON.parse(e.body),{SECRET:o,MONGO_URL:r}=e.stageVariables||{SECRET:"weednaoehganja",MONGO_URL:process.env.MONGO_URL};if(!/^[0-9a-fA-F]{24}$/.test(t))return{statusCode:i.default.BAD_REQUEST.code,headers:u,body:JSON.stringify({error:"email/invalid-ida"})};const s=(c=await Object(d.default)({conn:c,mongoUrl:r})).model("users");let l;try{l=await s.findOne({_id:t})}catch(e){return{statusCode:i.default.INTERNAL_SERVER_ERROR.code,headers:u,body:JSON.stringify({error:e})}}if(!l)return{statusCode:i.default.BAD_REQUEST.code,headers:u,body:JSON.stringify({error:"email/invalid-ida"})};if(l.email.token!==n)return{statusCode:i.default.BAD_REQUEST.code,headers:u,body:JSON.stringify({error:"email/invalid-token"})};try{await(()=>new Promise((e,t)=>{a.a.verify(n,o,(n,o)=>{n?t(n):e(o)})}))()}catch(e){return"TokenExpiredError"===e.name?{statusCode:i.default.BAD_REQUEST.code,headers:u,body:JSON.stringify({error:"email/expired-token"})}:{statusCode:i.default.BAD_REQUEST.code,headers:u,body:JSON.stringify({error:"email/invalid-token"})}}try{await s.findOneAndUpdate({_id:t},{"email.valid":!0},{new:!0})}catch(e){return{statusCode:i.default.INTERNAL_SERVER_ERROR.code,headers:u,body:JSON.stringify({error:e})}}const f=a.a.sign({username:l.username,ida:l._id},o,{expiresIn:"1h"});return{statusCode:i.default.SUCCESS.code,headers:u,body:JSON.stringify({data:{ida:t,email:l.email.address,sessionToken:f}})}}},"./src/controllers/user/find.js":
/*!**************************************!*\
  !*** ./src/controllers/user/find.js ***!
  \**************************************/
/*! exports provided: getUser, default */function(e,t,n){"use strict";n.r(t),n.d(t,"getUser",function(){return l});var o=n(/*! dotenv */"dotenv"),r=n.n(o),s=n(/*! ../../status */"./src/status.js"),a=n(/*! ../../db/Mongodb */"./src/db/Mongodb.js");r.a.config();let i=null;const d={"Access-Control-Allow-Credentials":!0,"Access-Control-Allow-Origin":"*","Content-Type":"application/json"},l=async e=>{const{ida:t}=e.pathParameters,{MONGO_URL:n}=e.stageVariables||{MONGO_URL:process.env.MONGO_URL};if(!/^[0-9a-fA-F]{24}$/.test(t))return{statusCode:s.default.BAD_REQUEST.code,headers:d,body:JSON.stringify({error:"email/invalid-email"})};try{i=await Object(a.default)({conn:i,mongoUrl:n})}catch(e){return{statusCode:s.default.INTERNAL_SERVER_ERROR.code,headers:{"Access-Control-Allow-Credentials":!0,"Access-Control-Allow-Origin":"*","Content-Type":"application/json"},body:JSON.stringify({error:e})}}const o=i.model("users"),r=await o.findOne({_id:t});if(!r)return{status:s.default.BAD_REQUEST.code,headers:{"Access-Control-Allow-Credentials":!0,"Access-Control-Allow-Origin":"*","Content-Type":"application/json"},body:JSON.stringify({error:"user/not-found"})};const l={ida:r._id,username:r.username,email:r.email,phone:r.phone,last_login:r.last_login};return{statusCode:s.default.SUCCESS.code,headers:{"Access-Control-Allow-Credentials":!0,"Access-Control-Allow-Origin":"*","Content-Type":"application/json"},body:JSON.stringify({data:{user:l}})}};t.default=l},"./src/controllers/user/login.js":
/*!***************************************!*\
  !*** ./src/controllers/user/login.js ***!
  \***************************************/
/*! exports provided: login, default */function(e,t,n){"use strict";n.r(t),n.d(t,"login",function(){return f});var o=n(/*! bcrypt */"bcrypt"),r=n.n(o),s=n(/*! jsonwebtoken */"jsonwebtoken"),a=n.n(s),i=n(/*! dotenv */"dotenv"),d=n.n(i),l=n(/*! ../../status */"./src/status.js"),c=n(/*! ../../db/Mongodb */"./src/db/Mongodb.js");d.a.config();let u=null;const f=async e=>{const{username:t,password:n}=JSON.parse(e.body),{SECRET:o,MONGO_URL:s}=e.stageVariables||{SECRET:"weednaoehganja",MONGO_URL:process.env.MONGO_URL};try{const e=(u=await Object(c.default)({conn:u,mongoUrl:s})).model("users"),i=await e.findOne({username:t});if(!i)return{status:l.default.UNAUTHORIZED.code,headers:{"Access-Control-Allow-Credentials":!0,"Access-Control-Allow-Origin":"*","Content-Type":"application/json"},body:JSON.stringify({error:"user/not-found"})};if(!await r.a.compare(n,i.password))return{statusCode:l.default.UNAUTHORIZED.code,headers:{"Access-Control-Allow-Credentials":!0,"Access-Control-Allow-Origin":"*","Content-Type":"application/json"},body:JSON.stringify({error:"user/wrong-password"})};const d=a.a.sign({username:t,ida:i._id},o,{expiresIn:"1h"}),f={ida:i._id,username:i.username,email:i.email,phone:i.phone,last_login:i.last_login};return{statusCode:l.default.ACCEPTED.code,headers:{"Access-Control-Allow-Credentials":!0,"Access-Control-Allow-Origin":"*","Content-Type":"application/json"},body:JSON.stringify({data:{user:f,ida:f.ida,token:d}})}}catch(e){return{statusCode:l.default.INTERNAL_SERVER_ERROR.code,headers:{"Access-Control-Allow-Credentials":!0,"Access-Control-Allow-Origin":"*","Content-Type":"application/json"},body:JSON.stringify({error:e})}}};t.default=f},"./src/controllers/user/phone.js":
/*!***************************************!*\
  !*** ./src/controllers/user/phone.js ***!
  \***************************************/
/*! exports provided: generateCode, validateCode */function(e,t,n){"use strict";n.r(t),n.d(t,"generateCode",function(){return c}),n.d(t,"validateCode",function(){return u});var o=n(/*! aws-sdk */"aws-sdk"),r=n.n(o),s=n(/*! ../../db/Mongodb */"./src/db/Mongodb.js"),a=n(/*! ../../status */"./src/status.js");r.a.config.region="us-west-2";let i=null;const d={"Access-Control-Allow-Credentials":!0,"Access-Control-Allow-Origin":"*","Content-Type":"application/json"},l=()=>{let e="";for(let t=0;t<6;t+=1)e+=0===t?"123456789".charAt(Math.floor(Math.random()*"123456789".length)):"0123456789".charAt(Math.floor(Math.random()*"0123456789".length));return e},c=async e=>{const{phone:t,ida:n}=JSON.parse(e.body);let o=/^\+[0-9]{13}$/.test(t);if(!o)return{statusCode:a.default.BAD_REQUEST.code,headers:d,body:JSON.stringify({error:"phone/invalid-number"})};if(!(o=/^[0-9a-fA-F]{24}$/.test(n)))return{statusCode:a.default.BAD_REQUEST.code,headers:d,body:JSON.stringify({error:"phone/invalid-ida"})};const c={phone:{number:t,valid:!1,confirmation_code:l()}},{MONGO_URL:u}=e.stageVariables||{MONGO_URL:process.env.MONGO_URL},f=(i=await Object(s.default)({conn:i,mongoUrl:u})).model("users");let g;try{g=await f.findOneAndUpdate({_id:n},c,{new:!0})}catch(e){return{statusCode:a.default.INTERNAL_SERVER_ERROR.code,headers:d,body:JSON.stringify({error:e})}}if(!g)return{statusCode:a.default.BAD_REQUEST.code,headers:d,body:JSON.stringify({error:"phone/invalid-ida"})};const y=new r.a.SNS,p={Message:`IDA-${c.phone.confirmation_code} é o código de confirmação de seu telefone para sua conta no SOM/IDA.`,MessageStructure:"string",PhoneNumber:t},O=await y.publish(p),C=await O.send();return C.error?{statusCode:a.default.INTERNAL_SERVER_ERROR.code,headers:d,body:JSON.stringify({error:C.error})}:{statusCode:a.default.SUCCESS.code,headers:d,body:JSON.stringify({data:{ida:g._id,phone:{number:t,valid:!1}}})}},u=async e=>{const{code:t,ida:n}=JSON.parse(e.body);if(!/^[0-9a-fA-F]{24}$/.test(n))return{statusCode:a.default.BAD_REQUEST.code,headers:d,body:JSON.stringify({error:"phone/invalid-ida"})};const{MONGO_URL:o}=e.stageVariables||{MONGO_URL:process.env.MONGO_URL},r=(i=await Object(s.default)({conn:i,mongoUrl:o})).model("users");let l;try{l=await r.findOne({_id:n})}catch(e){return{statusCode:a.default.INTERNAL_SERVER_ERROR.code,headers:d,body:JSON.stringify({error:e})}}if(!l)return{statusCode:a.default.BAD_REQUEST.code,headers:d,body:JSON.stringify({error:"phone/invalid-ida"})};if(l.phone.confirmation_code!==t)return{statusCode:a.default.BAD_REQUEST.code,headers:d,body:JSON.stringify({error:"phone/invalid-code"})};const c={phone:{number:l.phone.number,valid:!0,confirmation_code:null}};try{l=await r.findOneAndUpdate({_id:n},c,{new:!0})}catch(e){return{statusCode:a.default.INTERNAL_SERVER_ERROR.code,headers:d,body:JSON.stringify({err:e})}}return{statusCode:a.default.SUCCESS.code,headers:d,body:JSON.stringify({data:{ida:l._id,phone:{number:l.phone.number,valid:!0}}})}}},"./src/controllers/user/signup.js":
/*!****************************************!*\
  !*** ./src/controllers/user/signup.js ***!
  \****************************************/
/*! exports provided: signup, default */function(e,t,n){"use strict";n.r(t),n.d(t,"signup",function(){return u});var o=n(/*! dotenv */"dotenv"),r=n.n(o),s=n(/*! jsonwebtoken */"jsonwebtoken"),a=n.n(s),i=n(/*! ../utils */"./src/controllers/utils.js"),d=n(/*! ../../db/Mongodb */"./src/db/Mongodb.js"),l=n(/*! ../../status */"./src/status.js");r.a.config();let c=null;const u=async e=>{const{username:t,password:n}=JSON.parse(e.body),{SECRET:o,MONGO_URL:r}=e.stageVariables||{SECRET:"weednaoehganja",MONGO_URL:process.env.MONGO_URL};try{const e=(c=await Object(d.default)({conn:c,mongoUrl:r})).model("users");if(await e.findOne({username:t}))return{statusCode:l.default.UNAUTHORIZED.code,headers:{"Access-Control-Allow-Credentials":!0,"Access-Control-Allow-Origin":"*","Content-Type":"application/json"},body:JSON.stringify({error:"auth/duplicated-user"})};const s=new e({username:t,password:await Object(i.hashPassword)(n)});await s.save();const u=a.a.sign({username:t,ida:s._id},o,{expiresIn:"1h"});return{statusCode:l.default.CREATED.code,headers:{"Access-Control-Allow-Credentials":!0,"Access-Control-Allow-Origin":"*","Content-Type":"application/json"},body:JSON.stringify({data:{ida:s._id,token:u}})}}catch(e){return{statusCode:l.default.INTERNAL_SERVER_ERROR.code,headers:{"Access-Control-Allow-Credentials":!0,"Access-Control-Allow-Origin":"*","Content-Type":"application/json"},body:JSON.stringify({error:e})}}};t.default=u},"./src/controllers/user/validateToken.js":
/*!***********************************************!*\
  !*** ./src/controllers/user/validateToken.js ***!
  \***********************************************/
/*! exports provided: validateToken, default */function(e,t,n){"use strict";n.r(t),n.d(t,"validateToken",function(){return d});var o=n(/*! jsonwebtoken */"jsonwebtoken"),r=n.n(o),s=n(/*! dotenv */"dotenv"),a=n.n(s),i=n(/*! ../../status */"./src/status.js");a.a.config();const d=async e=>{const{token:t}=JSON.parse(e.body),{SECRET:n}=e.stageVariables||{SECRET:"weednaoehganja"};try{const e=await r.a.verify(t,n);return{statusCode:200,headers:{"Access-Control-Allow-Credentials":!0,"Access-Control-Allow-Origin":"*","Content-Type":"application/json"},body:JSON.stringify(e)}}catch(e){return{statusCode:i.default.UNAUTHORIZED.code,headers:{"Access-Control-Allow-Credentials":!0,"Access-Control-Allow-Origin":"*","Content-Type":"application/json"},body:JSON.stringify({error:i.default.UNAUTHORIZED.tag})}}};t.default=d},"./src/controllers/utils.js":
/*!**********************************!*\
  !*** ./src/controllers/utils.js ***!
  \**********************************/
/*! exports provided: hashPassword, default */function(e,t,n){"use strict";n.r(t),n.d(t,"hashPassword",function(){return s});var o=n(/*! bcrypt */"bcrypt"),r=n.n(o);const s=async e=>{return await new Promise((t,n)=>{r.a.hash(e,10,(e,o)=>{e&&n(e),t(o)})})};t.default=s},"./src/db/Mongodb.js":
/*!***************************!*\
  !*** ./src/db/Mongodb.js ***!
  \***************************/
/*! exports provided: default */function(e,t,n){"use strict";n.r(t);var o=n(/*! mongoose */"mongoose"),r=n.n(o),s=n(/*! ./models/users.model */"./src/db/models/users.model.js");r.a.Promise=global.Promise,t.default=async({conn:e,mongoUrl:t="mongodb://localhost/auth-ida"})=>{try{if(!e){console.log("=> using new database connection"),r.a.model("users",s.default);const e=await r.a.createConnection(t,{bufferCommands:!1,bufferMaxEntries:0,keepAlive:!0});return e.model("users",s.default),e}return console.log("=> using existing database connection"),e}catch(e){throw e}}},"./src/db/models/users.model.js":
/*!**************************************!*\
  !*** ./src/db/models/users.model.js ***!
  \**************************************/
/*! exports provided: default */function(e,t,n){"use strict";n.r(t);var o=n(/*! mongoose */"mongoose");const r=new o.Schema({username:{type:String,unique:!0,required:!0},password:{type:String,required:!0},active:{type:Boolean,default:!0},email:{address:{type:String,default:null,lowercase:!0},token:{type:String,default:null},valid:{type:Boolean,default:!1}},phone:{number:{type:String,default:null},valid:{type:Boolean,default:!1},confirmation_code:{type:String,default:null}},last_login:{type:Date,default:Date.now()}},{usePushEach:!0,timestamps:{updatedAt:"updated_at",createdAt:"created_at"}});t.default=r},"./src/status.js":
/*!***********************!*\
  !*** ./src/status.js ***!
  \***********************/
/*! exports provided: default */function(e,t,n){"use strict";n.r(t),t.default={SUCCESS:{code:200,tag:"success"},CREATED:{code:201,tag:"register"},ACCEPTED:{code:202,tag:"accepted"},BAD_REQUEST:{code:400,tag:"bad-request"},UNAUTHORIZED:{code:401,tag:"unauthorized"},INTERNAL_SERVER_ERROR:{code:500,tag:"internal-server-error"}}},"aws-sdk":
/*!**************************!*\
  !*** external "aws-sdk" ***!
  \**************************/
/*! no static exports found */function(e,t){e.exports=require("aws-sdk")},bcrypt:
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