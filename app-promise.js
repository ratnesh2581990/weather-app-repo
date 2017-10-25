const yargs = require('yargs');
const fs = require('fs');
const axios = require('axios');
var argv = yargs
  .options({
    a: {
      demand: false,
      alias: 'address',
      describe: 'Address to fetch the weather for',
      string: true
    },
    d : {
      demand: false,
      alias: 'defAddress',
      describe: 'Default Address for the app',
      string: true
    }
})
.help()
.alias('help', 'h')
.argv;
var addressValue = argv.address;
var defaultAddress = argv.defAddress;
if(typeof addressValue != 'undefined')
{
  console.log(`Address is present ${addressValue}.`);
  var encodeAddress = encodeURIComponent(addressValue);
  if(defaultAddress === '1')
  {
      fs.writeFileSync('notes-data.json', JSON.stringify(addressValue));
  }
}
else {
  var notesString = fs.readFileSync('notes-data.json');
  var DefultAddress = JSON.parse(notesString);
  console.log(DefultAddress);
  var encodeAddress = encodeURIComponent(DefultAddress);
}
var geocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeAddress}`;
axios.get(geocodeURL).then((response) => {
  if(response.data.status === 'ZERO_RESULTS')
  {
    throw new Error('Unable to find the address specified');
  }
  var lat =  response.data.results[0].geometry.location.lat;
  var long = response.data.results[0].geometry.location.lng;
  var weatherURL =  `https://api.darksky.net/forecast/0abedc6c9db63d44543488f283b1da8a/${lat},${long}`;
  console.log(response.data.results[0].formatted_address);
  return axios.get(weatherURL);
}).then((response) => {
  var temperature =   response.data.currently.temperature;
  var apparentTemperature = response.data.currently.apparentTemperature;
  console.log(`It's currently ${temperature}. It's feels like ${apparentTemperature}`);
}).catch((e) => {
    if(e.code === 'ENOTFOUND')
    {
      console.log('Unable to connect to api servers');
    }
    else {
      console.log(e.message);
    }
});
