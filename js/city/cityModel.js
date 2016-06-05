/**
 * Created by inokentii on 14.05.2016.
 */

define(['pubsub', 'googleService', 'forecastService', 'configModel'], function (PubSub, googleService, forecastService, config) {

  function CityModel(placeId) {
    var thisCity = this;
    thisCity.placeId = placeId;
    thisCity.requestDetails(function () {
      thisCity.updateForecast();
    });
  }

  CityModel.prototype.updateForecast = function (callback) {
    var thisCity = this;
    forecastService.getForecast({
      lat: thisCity.coordinates.lat,
      lng: thisCity.coordinates.lng
    }, function (response) {
      thisCity.forecast = response;
      thisCity.changeTempUnit();
      console.log(response);
      if(callback) {
        callback();
      }
    });
  };

  CityModel.prototype.requestDetails = function (callback) {
    var thisCity = this;
    googleService.getCityDetails(thisCity.placeId, function (response) {
      thisCity.placeId = response.placeId;
      thisCity.address = response.address;
      thisCity.coordinates = response.coordinates;
      if (callback) {
        callback();
      }
    });
  };

  CityModel.prototype.changeTempUnit = function () {
    var type = config.getIsCelsius() ? 'c' : 'f';
    if (!this.forecast) {
      return false;
    }
    forecastService.setTempUnit(this.forecast, type);
    PubSub.publish('city.forecast.updated', this);
  };

  return CityModel;

});
