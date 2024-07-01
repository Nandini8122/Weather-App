const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("home.html","utf-8");

const convertToCelsius = (fahrenheit) => ((fahrenheit - 32) * 5 / 9).toFixed(2);


const  replaceVal = (tempVal,orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", convertToCelsius((orgVal.main.temp - 273.15) * 9/5 + 32)); // Convert Kelvin to Fahrenheit then to Celsius
    temperature = temperature.replace("{%tempmin%}", convertToCelsius((orgVal.main.temp_min - 273.15) * 9/5 + 32));
    temperature = temperature.replace("{%tempmax%}", convertToCelsius((orgVal.main.temp_max - 273.15) * 9/5 + 32));
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
    
return temperature;
}

const server= http.createServer((req,res)=>{
    if(req.url=="/"){
        requests("https://api.openweathermap.org/data/2.5/weather?q=Vadodara&appid=094f2f4c6be645a113b19ac466019f5c",)
        .on("data", (chunk) => {
            const objdata = JSON.parse(chunk);
            const arrData = [objdata];
            const realTimeData = arrData
            .map((val) => replaceVal(homeFile,val))
            .join("");
            // console.log(realTimeData);
            res.write(realTimeData);
        })
        .on("end",(err) => {
        if(err) return console.log("connection closed due to error",err);
         res.end();
        });
    }
});
server.listen(8000,"127.0.0.1")