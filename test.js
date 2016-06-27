"use strict";
let comb = require("./index");


let options = {
  id:"required;isInt",
  name:"required",
  x:"required;isNumber",
  express:"REGEXP:^\\w{1,20}\\#\\d{5}$"
}

let request = {
  body:{
    id:"10sed",
    name:"dirtypp",
    x:3.1415926,
    express:"dirtypp#010dd"
  }
}
let response = {
  json:function(obj){
    console.log("JSON：");
    console.log(obj)
  },
  redirect:function(URL){
    console.log("redirect:");
    console.log(URL);
  },
  render:function(temp,args){
    console.log("render:");
    console.log(temp,args);
  }
}
let next = function(){
  console.log("NEXT was called");
}

let midwear = comb.newComb(options,"render:default.jade");

midwear(request,response,next);