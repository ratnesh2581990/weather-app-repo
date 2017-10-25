const request = require('request');
var getWeather = (lat, long, callback) => {
  request({
    url: `https://api.darksky.net/forecast/0abedc6c9db63d44543488f283b1da8a/${lat},${long}`,
    json: true
  }, function (error, response, body) {
    if(error)
    {
      callback('Unable to connect to Forecast io Server');
    }
    else if (response.statusCode === 200) {
          callback(undefined, {
            temperature: body.currently.temperature,
            apparentTemperature: body.currently.apparentTemperature
          });
    }
    else {
      callback('Unable to fetch weather information');
    }
  });
};

module.exports.getWeather = getWeather;
