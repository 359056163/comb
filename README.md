# comb
a middle-wear for Express to validate the parameters of request

usage:
```
  const comb = require("comb");
  let router = Express.Route();
  
  let options = {
    id:"required;isInt",
    name:"optional;REGEXP:^[a-z_0-9]{6,20}$"
  } 
  router.all("/",comb.newComb(options),(req,res,next)=>{
      //TODO:your code
  }
  
```  
