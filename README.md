# Prerequisite

It is assumed, and indeed required, that [node](https://nodejs.org/en/) is installed. There _might_ be possible incompatibilities between the project dependencies and your locally installed version of `node`. For what it is worth,
I have `v15.0.1` installed, but I assume recent versions will still work fine.

# Installation

Take the ZIP file, and unzip it somewhere, and from a command prompt navigate to the directory. Run the following command:
```
npm install
```

Or if you prefer to use 'yarn', you can simply run
```
yarn
```

# Running the application

Once the dependencies have been installed you run the application thusly:
```
npm run dev
```

This starts the web server which can now receive requests. GET Requests are accepted from the following path:
```
/weather/lat/:latitude/long/:longitude
```

# Example

With the web server running, you can perform a search by opening the following URL in your browser
```
http://localhost:8080/weather/lat/39.629628/long/-105.067465
```

# Assumptions

**API Design**

THere are no details about exactly what the API should be here. I have assumed that accepting GET requests, with the `latitude` and `longitude` parameters being encoded as parameters in the URL itself. This could have been captured in a request body, but the simpler approach was to encode this directly in the URL itself.

**Output**

It is not entirely clear exactly what the desired output format is. I have assumed that JSON is sufficient for this exercise. I did toy around with the idea of letting you configure that somehow, similar to what Open Weather also allows you to do.

**Alerts are not confirmed to work**

Sooooo... I did not _actually_ verify that the alert functionality works. I could not find a location that had any alerts show up so I cannot really say whether or not the `fetchWeatherAlerts()` path of the code works.

**Error handling**

There is some error handling, but it is not exhaustive and pretty fragile. If you put in bogus latitudes and longitudes it probably blows up, for instance.

# My Projects

I have a few personal projects that I might as well highlight. I have not contributed significantly to any open source projects beyond a random commit or two. I am happy to elaborate if you are curious.

[crypto-viz](https://github.com/DeiNile/crypto-viz) is a proof of concept for how to visually demonstrate and instruct people how cryptographic algorithms work.

[NESemulator](https://github.com/DeiNile/NESemulator), a semi-functional emulator of the NES CPU.

[dnd-beyond-renamer](https://github.com/DeiNile/dnd-beyond-renamer) is a super simple Chrome extension (not published btw.) that I made to help a friend when they play Dungeons & Dragons. They confuse some terms and the plugin will work with [D&D Beyond](https://www.dndbeyond.com/) to rename very specific pieces of text on the page. The scope of this thing is super limited.

# My (highlighted) Skills

This might sound weird, but I think I do pretty good job of code reviews. I try to give lots of meaningful feedback - whether that is functional, edge cases, missing tests etc. - and use code reviews as a platform for communicating with the rest of the team. It also helps me learn from others, which I find really valuable.

