/**
 * Created by Inokentii_Duka on 12.05.2016.
 */

define([
  'pubsub',
  'searchView',
  'googleService',
  'citiesCollection'
], function (
  PubSub,
  searchView,
  googleService,
  citiesCollection
) {

  var chosenPlaceIds = [];

  function onCityChecked(eventName, placeId) {
    if (chosenPlaceIds.indexOf(placeId) === -1) {
      chosenPlaceIds.push(placeId);
      searchView.showSubmitButton();
    }
  }

  function onCityUnchecked(eventName, placeId) {
    var index = chosenPlaceIds.indexOf(placeId);
    if (index !== -1) {
      chosenPlaceIds.splice(index, 1);
    }

    if (chosenPlaceIds.length === 0) {
      searchView.hideSubmitButton();
    }
  }

  function onKeywordChange(eventName, keyword) {
    chosenPlaceIds = [];
    if (keyword.length === 0) {
      return false;
    }
    googleService.findCities(keyword, function (proposedCities) {
      searchView.render(proposedCities);
    });
    return true;
  }

  function onSubmit() {
    chosenPlaceIds.forEach(function (placeId) {
      citiesCollection.add(placeId);
    });
    chosenPlaceIds = [];
    searchView.hideSubmitButton();
  }

  PubSub.subscribe('search.keyword.changed', onKeywordChange);
  PubSub.subscribe('search.city.checked', onCityChecked);
  PubSub.subscribe('search.city.unchecked', onCityUnchecked);
  PubSub.subscribe('sidebar.submitted', onSubmit);
  PubSub.subscribe('config.isCelsius.changed', citiesCollection.changeTempUnit);

  PubSub.subscribe('search.toggled', function () {
    chosenPlaceIds = [];
  });

});
