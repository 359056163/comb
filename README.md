# param-matcher
a middle-wear for Express to validate the parameters of request

usage:
```
  const Matcher = require("param-matcher");
  let router = Express.Route();
  
  let options = {
    id:"required;isInt",
    name:"optional;REGEXP:^[a-z_0-9]{6,20}$"
  } 
  router.all("/",Matcher.newMatcher(options),(req,res,next)=>{
      //TODO:your code
  }
  
```  

```Matcher.newMatcher(options,fail) ```

###### options：
an object contains key-values that used for specifying which method to match the parameter in request
  
  
###### fail:
a string variate,only 3 patterns, specifed which way to return the unmatch message.                  
1. ```""```  or ```"json"``` :return an msg object.                   
2. ```"redirect:${URL}"``` : redirect to the URL with unmatch message in the query string                               
3. ```"render:${templat}"``` : render the specified templat to browser,with unmatch message                    

`Matcher.setMatcher(name,matcher)`                        


###### name
a string to mark the matcher
###### matcher
a function to check the pattern ,if the pattern is matched return ```"ok"``` ,not return your tips 
