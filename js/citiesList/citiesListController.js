/**
 * Created by inokentii on 15.05.2016.
 */

define(['citiesListView', 'pubsub', 'citiesCollection', 'searchView'], function (citiesListView, PubSub, citiesCollection, searchView) {

  var chosenPlaceIds = [];

  function onCityAdded(eventName, city) {
    citiesListView.appendCity(city);
  }

  function onCityRemoved(eventName, placeId) {
    citiesListView.removeCity(placeId);
  }
  
  function onForecastUpdated(eventName, city) {
    citiesListView.updateCity(city);
  }

  function onCityChecked(eventName, placeId) {
    if (chosenPlaceIds.indexOf(placeId) === -1) {
      chosenPlaceIds.push(placeId);
    }
    searchView.showSubmitButton();
  }

  function onCityUnchecked(eventName, placeId) {
    var index = chosenPlaceIds.indexOf(placeId);
    if (index > -1) {
      chosenPlaceIds.splice(index, 1);
    }
    if (chosenPlaceIds.length === 0) {
      searchView.hideSubmitButton();
    }
  }

  function onToggled(eventName) {
    chosenPlaceIds = [];
    citiesListView.uncheckAll();
  }

  function onSubmit (eventName) {
    chosenPlaceIds.forEach(function (placeId) {
      citiesCollection.remove(placeId);
    });
  }


  PubSub.subscribe('citiesCollection.added', onCityAdded);
  PubSub.subscribe('citiesCollection.removed', onCityRemoved);
  PubSub.subscribe('city.forecast.updated', onForecastUpdated);
  PubSub.subscribe('city.tempUnit.changed', onForecastUpdated);
  PubSub.subscribe('cityList.city.checked', onCityChecked);
  PubSub.subscribe('cityList.city.unchecked', onCityUnchecked);
  PubSub.subscribe('cityList.submitted', onSubmit);
  PubSub.subscribe('remove.toggled', onToggled);
  PubSub.subscribe('sidebar.submitted', onSubmit);

});
