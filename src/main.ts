import express, { Request, Response } from 'express';
import axios from 'axios';

/*
 |-------------------------------------------
 | Types
 |-------------------------------------------
 */

interface RequestParameters {
	latitude: string;
	longitude: string;
}

interface CurrentWeather {
	weather: {
		id: string;
		main: string;
		description: string;
		icon: string;
	}[];
	main: {
		temp: number;
		feels_like: number;
		temp_min: number;
		temp_max: number;
		pressure: number;
		humidity: number;
	};
}

interface WeatherAlert {
	sender_name: string;
	event: string;
	start: number;
	end: number;
	description: string;
}

interface WeatherAlertResponse {
	alerts: WeatherAlert[];
}

enum Temperature {
	Hot = 'Hot',
	Cold ='Cold',
	Moderate = 'Moderate',
}

/*
 |-------------------------------------------
 | Constants
 |-------------------------------------------
 */

const app = express();
const apiKey = 'f0da747600851400ebd09cbd7abf614e';

/*
 |-------------------------------------------
 | Functions / logic
 |-------------------------------------------
 */

function isValidWeatherResponse(weather: any): weather is CurrentWeather {
	return  weather != null
	&& Array.isArray(weather?.weather)
	&& weather.weather.every(w => (
		typeof w?.id === 'number'
		&& typeof w?.main === 'string'
		&& typeof w?.description === 'string'
		&& typeof w?.icon === 'string'
	))
	&& typeof weather?.main?.feels_like === 'number'
	&& typeof weather?.main?.temp_min === 'number'
	&& typeof weather?.main?.temp_max === 'number'
	&& typeof weather?.main?.pressure === 'number'
	&& typeof weather?.main?.humidity === 'number';
}

function isValidWeatherAlertResponse(response: any): response is WeatherAlertResponse {
	return response != null
		&& ((Array.isArray(response.alerts)
			// If there are a lot of alerts, this might be a little excessive. We could probably just look at the first
			// element and if it passes the type checks assume that the rest of them also passes.
			&& response.alerts.every(alert => (
				alert != null
				&& typeof alert.sender_name === 'string'
				&& typeof alert.event === 'string'
				&& typeof alert.start === 'number'
				&& typeof alert.end === 'number'
				&& typeof alert.description === 'string'
			)))
			|| response.alerts == null
		);
}

function temperatureEstimate(weather: CurrentWeather): Temperature {
	if (weather.main.feels_like < 5) {
		return Temperature.Cold;
	} else if (weather.main.feels_like > 20) {
		return Temperature.Hot;
	} else {
		return Temperature.Moderate;
	}
}


async function fetchWeather(latitude: string, longitude: string): Promise<CurrentWeather | Error> {
	const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`);
	if (response.status !== 200) {
		return new Error(`Could not fetch weather - ${response.status}`);
	}
	const responseBody = response.data;
	if (isValidWeatherResponse(responseBody)) {
		return responseBody;
	} else {
		return new Error('Error parsing Weather JSON response object');
	}
}

async function fetchWeatherAlerts(latitude: string, longitude: string) {
	const response = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,daily,current,alerts&appid=${apiKey}`);

	if (response.status !== 200) {
		return new Error(`Could not fetch Weather alerts - ${response.status}`);
	}
	const responseBody = await response.data;
	if (isValidWeatherAlertResponse(responseBody)) {
		return responseBody.alerts;
	} else {
		return new Error(`Error parsing Weather JSON response object`);
	}
}

async function handleWeatherRequest(request: Request<RequestParameters>, result: Response): Promise<void> {

	const [ weather, weatherAlerts ] = await Promise.all([
		fetchWeather(request.params.latitude, request.params.longitude),
		fetchWeatherAlerts(request.params.latitude, request.params.longitude),
	]);

	if (weather instanceof Error) {
		result.send(JSON.stringify({
			error: weather.message,
		}));
	} else {
		result.send(JSON.stringify({
			conditions: weather.weather.map(w => w.main),
			temperature: temperatureEstimate(weather),
			...(weatherAlerts instanceof Error || weatherAlerts == null
				? {}
				: {
					alerts: weatherAlerts.map(a => ({
						sender: a.sender_name,
						event: a.event,
						description: a.description,
					}))
				}
			)
		}));
	}
}

/*
 |-------------------------------------------
 | Application start-up
 |-------------------------------------------
 */

app.get('/weather/lat/:latitude/long/:longitude', handleWeatherRequest);
app.listen(8080, () => {
	console.log('The simplest weather service known to man has just started...\n\n');
});
