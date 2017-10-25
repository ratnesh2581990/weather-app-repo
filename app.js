const request = require('request');
const yargs = require('yargs');
const geocode = require('./geocode/geocode');
const weather = require('./weather/weather');
var argv = yargs
  .options({
    a: {
      demand: true,
      alias: 'address',
      describe: 'Address to fetch the weather for',
      string: true
    }
})
.help()
.alias('help', 'h')
.argv;
geocode.geocodeAddress(argv.address, (errorMessage, results) => {
  if(errorMessage){
    console.log(errorMessage);
  }
  else {
    console.log(results.address);
    weather.getWeather(results.latitude, results.longitude, (errorMessage, weatherResults) => {
      if(errorMessage){
         console.log(errorMessage);
      }
      else {
           console.log(`It's Currently ${weatherResults.temperature}. It's feels like ${weatherResults.apparentTemperature}.`);
        }
    });
  }
});
