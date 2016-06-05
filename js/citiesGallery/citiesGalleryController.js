/**
 * Created by inokentii on 16.05.2016.
 */

define([
  'citiesGalleryView',
  'pubsub',
  'citiesCollection',
  'sunView',
  'background',
  'configModel'
], function (citiesGalleryView, PubSub, citiesCollection, sunView, background, config) {

  function onCityAdded(eventName, city) {
    citiesGalleryView.appendCity(city);
  }

  function onCityRemoved(eventName, placeId) {
    citiesGalleryView.removeCity(placeId);
    if (citiesCollection.getList().length === 0) {
      resetBackground();
    }
  }

  function onForecastUpdated(eventName, city) {
    citiesGalleryView.updateCity(city);
  }

  function onSlideChanged(eventName, placeId) {
    var city = citiesCollection.find(placeId);
    setBackground(city);
  }

  function setBackground(city) {
    var icon = city.forecast.currently.icon;
    var phase = city.forecast.currently.sunPhase;
    var temp = city.forecast.currently.temperature.c;

    sunView.update({
      phase: phase,
      speed: 0.5
    });

    background.setTime(phase);

    if (icon === 'rain') {
      background.rain();
    } else if (icon === 'snow') {
      background.snow();
    } else {
      background.clearWeather();
    }

    if(temp > 20) {
      background.warm();
    } else {
      background.cold();
    }
  }

  function resetBackground() {
    sunView.update({
      phase: 0,
      speed: 1
    });

    background.setTime(0.5);
    background.cold();
    background.clearWeather();
  }

  function onCityRendered(eventName, city) {
    var num = config.getDaysNumber();
    citiesGalleryView.showDays(city, num);
  }

  function onDaysNumberChanged() {
    var cities = citiesCollection.getList();
    var num = config.getDaysNumber();
    cities.forEach(function (city) {
      citiesGalleryView.showDays(city, num);
    });
  }

  function onUpdate() {
    citiesCollection.update();
  }

  function onCityClicked(eventName, placeId) {
    citiesGalleryView.slide(placeId);
  }

  PubSub.subscribe('citiesCollection.added', onCityAdded);
  PubSub.subscribe('citiesCollection.removed', onCityRemoved);
  PubSub.subscribe('city.forecast.updated', onForecastUpdated);
  PubSub.subscribe('city.tempUnit.changed', onForecastUpdated);
  PubSub.subscribe('gallery.slide.changed', onSlideChanged);
  PubSub.subscribe('gallery.city.rendered', onCityRendered);
  PubSub.subscribe('gallery.updateButton.clicked', onUpdate);
  PubSub.subscribe('config.daysNumber.changed', onDaysNumberChanged);
  PubSub.subscribe('cityList.city.clicked', onCityClicked);

});
