/**
 * Created by inokentii on 15.05.2016.
 */

define(['jquery', 'mustache', 'pubsub', 'swiper'], function ($, Mustache, PubSub, Swiper) {

  var container = $('.setup-locations');
  var addedListContainer = container.find('.location-added-list .swiper-wrapper');
  var addedTemplate = addedListContainer.find('#location-added-template').html();

  var scrollbar = new Swiper('.location-added-list', {
    direction: 'vertical',
    slidesPerView: 'auto',
    mousewheelControl: true,
    observer: true,
    grabCursor: true
  });

  function appendCity(city) {
    var output = Mustache.render(addedTemplate, city);
    addedListContainer.append(output);
  }

  function removeCity(placeId) {
    addedListContainer
      .find('[data-place-id="' + placeId + '"]')
      .remove();
  }

  function updateCity(city) {
    var placeId = city.placeId;
    var output = Mustache.render(addedTemplate, city);
    var old = addedListContainer.find('[data-place-id="' + placeId + '"]');
    old.replaceWith(output);
  }

  function uncheckAll() {
    addedListContainer.find(':checked')
      .prop('checked', false);
  }

  // function renderList(cityList) {
  //   var output = Mustache.render(addedTemplate, {cities: cityList});
  //   addedListContainer.html(output);
  // }

  addedListContainer.on('click', '.location-item', function (e) {
    var placeId = e.currentTarget.getAttribute('data-place-id');
    PubSub.publish('cityList.city.clicked', placeId);
  });

  addedListContainer.on('click', '.checkbox-location-choose', function (e) {
    e.stopPropagation();
    var check = e.target.checked ? 'checked' : 'unchecked';
    PubSub.publish('cityList.city.' + check, e.target.getAttribute('data-place-id'));
  });

  return {
    updateCity: updateCity,
    appendCity: appendCity,
    removeCity: removeCity,
    uncheckAll: uncheckAll
  };

});
