/**
 * Created by inokentii on 14.05.2016.
 */

define(['jquery'], function ($) {

  var baseUrl = 'https://api.forecast.io/forecast/4428afdc9d256890d8e46d0a882eff6b/';

  var icons = {
    'clear-day':            'sunny',
    'clear-night':          'night',
    'rain':                 'rain',
    'snow':                 'snow',
    'wind':                 'wind',
    'fog':                  'fog',
    'cloudy':               'cloudy-day',
    'partly-cloudy-day':    'partly-cloudy',
    'partly-cloudy-night':  'night-less-cloudy'
  };

  var moonIcons = ['empty-moon', 'young-moon', 'almost-full', 'full-moon', 'almost-old', 'old-moon'];

  var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  var months = ['january', 'february', 'march', 'april', 'may', 'june',
                'july', 'august', 'september', 'october', 'november', 'december'];

  function round(response) {
    response.currently.windSpeed = (response.currently.windSpeed * 0.447).toFixed(1) /1;
    response.currently.humidity = (response.currently.humidity * 100).toFixed(0) /1;
  }

  function changeIconClass(response) {
    response.currently.icon = icons[response.currently.icon];
    response.hourly.data.forEach(function (hour) {
      hour.icon = icons[hour.icon];
    });
    response.daily.data.forEach(function (day) {
      day.icon = icons[day.icon];
    });
  }

  function setTime (response) {
    var now = response.currently;
    var today = response.hourly.data;
    var thisWeek = response.daily.data;
    var nowTime = new Date(now.time * 1000);

    now.timeShort = nowTime.toLocaleTimeString('en-US', {
      hour12: false,
      hour: 'numeric',
      minute: 'numeric'
    });
    now.dateLong = days[nowTime.getDay()] + ', ' + months[nowTime.getMonth()] + ' ' + nowTime.getDate();

    today.forEach(function (hour) {
      var hourTime = new Date(hour.time * 1000);
      hour.timeShort = hourTime.toLocaleTimeString('en-US', {
        hour12: false,
        hour: 'numeric',
        minute: 'numeric'
      });
    });

    thisWeek.forEach(function (day) {
      var dayTime = new Date(day.time * 1000);
      day.dayShort = days[dayTime.getDay()].match(/^.{3}/)[0];
    });

    thisWeek[0].dayShort = 'today';
    now
  }

  function setSun(resource) {
    var sunriseTime = new Date(resource.daily.data[0].sunriseTime * 1000);
    var sunsetTime = new Date(resource.daily.data[0].sunsetTime * 1000);
    var now = new Date(resource.currently.time * 1000);
    resource.currently.sunPhase = ((now - sunriseTime) / (sunsetTime - sunriseTime)).toFixed(5) / 1;
    resource.currently.sunriseTime = sunriseTime.toLocaleString('en-US', {
      hour12: false,
      hour: 'numeric',
      minute: 'numeric'
    });
    resource.currently.sunsetTime = sunsetTime.toLocaleString('en-US', {
      hour12: false,
      hour: 'numeric',
      minute: 'numeric'
    });

  }

  function setMoon(response) {
    var phase = response.daily.data[0].moonPhase;
    var delta = 1 / moonIcons.length;
    var halfDelta = delta / 2;
    var moonIconIndex = 0;

    for (var i = delta, k = 1; i <= 1 ; i += delta, k++) {
      if(phase >= (i - halfDelta)) {
        moonIconIndex = k % moonIcons.length;
      }
    }

    response.currently.moonIcon = moonIcons[moonIconIndex];
  }

  function setWind(response) {
    var bearing = response.currently.windBearing;
    var dir = 'n';
    if (bearing >= 23) {
      dir = 'ne';
    }
    if (bearing >= 68) {
      dir = 'e';
    }
    if (bearing >= 113) {
      dir = 'se';
    }
    if (bearing >= 158) {
      dir = 's';
    }
    if (bearing >= 203) {
      dir = 'sw';
    }
    if (bearing >= 248) {
      dir = 'w';
    }
    if (bearing >= 293 && bearing < 338) {
      dir = 'nw';
    }
    response.currently.windDir = dir;
  }

  function setTemp(response) {
    var now = response.currently;
    var today = response.hourly.data;
    var thisWeek = response.daily.data;

    var fahrenheit = now.temperature;
    var celsius = (fahrenheit - 32) / 1.8;
    now.temperature = {
      f: fahrenheit.toFixed(0) / 1,
      c: celsius.toFixed(0) / 1
    };

    today.forEach(function (hour) {
      var fahrenheit = hour.temperature;
      var celsius = (fahrenheit - 32) / 1.8;
      hour.temperature = {
        f: fahrenheit.toFixed(0) / 1,
        c: celsius.toFixed(0) / 1
      };
    });

    thisWeek.forEach(function (day) {
      var fahrenheit = day.temperatureMax;
      var celsius = (fahrenheit - 32) / 1.8;
      day.temperatureMax = {
        f: fahrenheit.toFixed(0) / 1,
        c: celsius.toFixed(0) / 1
      };
      fahrenheit = day.temperatureMin;
      celsius = (fahrenheit - 32) / 1.8;
      day.temperatureMin = {
        f: fahrenheit.toFixed(0) / 1,
        c: celsius.toFixed(0) / 1
      };
    });
  }

  function setTempUnit(forecast, type) {
    var now = forecast.currently;
    var today = forecast.hourly.data;
    var thisWeek = forecast.daily.data;

    now.temperature.actual = now.temperature[type];
    today.forEach(function (hour) {
      hour.temperature.actual = hour.temperature[type];
    });

    thisWeek.forEach(function (day) {
      day.temperatureMin.actual = day.temperatureMin[type];
      day.temperatureMax.actual = day.temperatureMax[type];
    });
  }

  function limit(array, number) {
    array.splice(number, array.length);
  }

  function getForecast(coordinates, callback) {
    $.getJSON(baseUrl + coordinates.lat + ',' + coordinates.lng + '?callback=?', function (response) {
      changeIconClass(response);
      round(response);
      setTime(response);
      setSun(response);
      setMoon(response);
      setWind(response);
      setTemp(response);
      limit(response.hourly.data, 24);
      limit(response.daily.data, 7);
      callback(response);
    });
  }


  return {
    getForecast: getForecast,
    setTempUnit: setTempUnit
  };

});
