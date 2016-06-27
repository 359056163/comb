"use strict";
let Matcher = require("./index");


let options = {
  id:"required;isInt",
  name:"required",
  x:"required;isNumber",
  express:"REGEXP:^\\w{1,20}\\#\\d{5}$"
}

let request = {
  body:{
    id:"10010",
    name:"dirtypp",
    x:3.1415926,
    express:"dirtypp#01001"
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
/**
 * 这里有个小坑，作为分隔符的字符串，最好不要出现在 matcherCollection.REGEXP 正则表达式中。
 * there is a little problem , the character as separator could not be included in regular.
 * @type {*|Function}
 */
let midwear = Matcher.newMatcher(options,"render:default.jade",";");

midwear(request,response,next);