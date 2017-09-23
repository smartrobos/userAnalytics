let express = require('express');
let app = express();
let useragent = require('express-useragent');
const requestIp = require('request-ip');
let lookup = require("./ip2Location");

let uaAnalytics = { 
    "browser":{"name":"","version":""},
    "os":"",
    "platform":"",
    "source":"",
    "geoIp":"",
    "ipAddress":"",
    "ip2Location":{}
  };
 
app.use(useragent.express());
app.use(requestIp.mw())

function ip2LocationCallBack(error,response){
    if(error){
        console.log(Date(),"Error Getting IP2Location Details: "+error);
         uaAnalytics.ip2Location = error;
    }else{
        uaAnalytics.ip2Location = JSON.parse(response);
       //debugging  console.log(Date(),"Location Details: ",uaAnalytics);
       /*Save the data in DB here ... (Sravanthi) complete uaAnalytics) 
       Have individual column in the DB for all the params in ip2Location.
       */
       
    }

}

app.get('/', function(req, res){
  
   //uaAnalytics.ipAddress = req.clientIp; // in Server Actual Code.
   uaAnalytics.ipAddress = "223.230.36.72";//For testing Local server
   lookup.ip2Location(uaAnalytics.ipAddress,ip2LocationCallBack);//1st Argument is passing the IP in 1st step.
   let ua = req.useragent;
   /* save the following data in DB for that customname*/
    uaAnalytics.browser.name = ua.browser;
    uaAnalytics.browser.version = ua.version;
    uaAnalytics.os = ua.os;
    uaAnalytics.platform = ua.platform;
    uaAnalytics.source = ua.source;
    uaAnalytics.geoIp = ua.geoIp;
    //You need not redirect for your application;
    setTimeout(()=>{res.redirect('/uaAnalytics/success')},200);
  
});

//Below Route is not required for you.
let retryCount=0;
app.get('/uaAnalytics/success',(req,res)=>{
      if(uaAnalytics.os.length==0){
        res.send('Cannot Access Directly');
        return;
      }
      if(!uaAnalytics.ip2Location.status){
        retryCount++;
        if(retryCount<=10){
          setTimeout(()=>{ console.log(Date(),"Redirecting- Retry:",retryCount);res.redirect('/uaAnalytics/success')},100);
        } 
      }else{
          res.send(uaAnalytics);
      }
    }
);

app.listen(4000);