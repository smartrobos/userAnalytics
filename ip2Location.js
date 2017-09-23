
module.exports.ip2Location = function (ipAddress,callback) {
    var https = require('https');
    var http  = require('http');
    
    var str = '';
    //ipAddress = "0.0.0.0";
    var options = {
        host: 'ip-api.com',
        port: 80,
        path: '/json/'+ipAddress,
        method: 'POST'
    };

    var req = http.get(options, function (res) {
         res.on('data', function (body) {
             str += body;
         });
         res.on('end', function () {
             if(JSON.parse(str).status == "fail"){
                 return callback(str,null);
             }
             return callback(null,str);
         });
    }).on('error', function (err) {
        return callback(err,null);
    });
    req.end();
}

/*

url2 = "http://geoip.nekudo.com/api/223.230.36.72";
    url1 = "http://freegeoip.net/json/8.8.8.8";
    url = "http://ip-api.com/json/223.230.36.72"
      var options1 = {
        host: 'geoip.nekudo.com',
        port: 80,
        path: '/api/8.8.8.8',
        method: 'POST'
    };
  
    
*/