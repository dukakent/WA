/**
 * Created by inokentii on 24.04.2016.
 */

define(['pubsub', 'cityModel'], function (PubSub, CityModel) {

  var cities = [];

  function find(placeId) {
    var found = false;
    cities.some(function (city) {
      if (city.placeId === placeId) {
        found = city;
        return true;
      }
      return false;
    });
    return found;
  }

  function add(placeId) {
    if (find(placeId)) {
      return false;
    }
    var newCity = new CityModel(placeId);
    cities.push(newCity);
    PubSub.publish('citiesCollection.added', newCity);
    return true;
  }

  function remove(placeId) {
    cities.some(function (city, index) {
      if (city.placeId === placeId) {
        cities.splice(index, 1);
        PubSub.publish('citiesCollection.removed', placeId);
        return true;
      }
      return false;
    });
  }

  function getList() {
    return cities;
  }

  function changeTempUnit() {
    cities.forEach(function (city) {
      city.changeTempUnit();
    });
  }

  function update() {
    cities.forEach(function (city) {
      city.updateForecast();
    });
  }

  return {
    add: add,
    remove: remove,
    getList: getList,
    find: find,
    update: update,
    changeTempUnit: changeTempUnit
  };

});
