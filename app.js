const yargs = require('yargs');
const axios = require('axios');

const argv = yargs
    .options({
        a: {
            demand: true,
            alias: 'address',
            describe: 'Address to fetch weather for',
            string: true
        }
    })
    .help()
    .alias('help', 'h')
    .argv;

const encodedAddress = encodeURIComponent(argv.address);
var geocodeUrl = `http://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`;

axios.get(geocodeUrl).then((response) => {
    if (response.data.status === 'ZERO_RESULTS') {
        throw new Error('Unable to find that address.')
    }
    const lat = response.data.results[0].geometry.location.lat;
    const lng = response.data.results[0].geometry.location.lng;
    const weatherUrl = `https://api.darksky.net/forecast/cbb165d16dea47a6d025ed982dd527e9/${lat},${lng}`
    console.log(response.data.results[0].formatted_address);
    return axios.get(weatherUrl);
}).then((response) => {
    const temperature = response.data.currently.temperature;
    const celsiustemperature = ((temperature - 32)/1.8).toFixed(1);
    const apparentTemperature = response.data.currently.apparentTemperature;
    const celsiusapparentTemperature = ((apparentTemperature - 32)/1.8).toFixed(1);

    const currentWeather = response.data.currently.summary;

    const pressure = response.data.currently.pressure;
    const windSpeed = response.data.currently.windSpeed;
    const km_windSpeed = 3.6*windSpeed.toFixed(2);

    console.log(`Current weather: ${currentWeather}`);
    console.log(`It's currently ${celsiustemperature} C. It feels like ${celsiusapparentTemperature} C.`);
    console.log(`Pressure: ${pressure} hPa`);
    console.log(`Windspeed: ${km_windSpeed} km/h`);
}).catch((e) => {
    if (e.code === 'ENOTFOUND') {
        console.log('Unable to connect to API servers.');
    } else
        console.log(e.message);
});



// cbb165d16dea47a6d025ed982dd527e9

