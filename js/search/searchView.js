/**
 * Created by Inokentii_Duka on 13.05.2016.
 */

define(['jquery', 'swiper', 'mustache', 'pubsub'], function ($, Swiper, Mustache, PubSub) { 

  var addModeClass = 'setup-locations-add';
  var removeModeClass = 'setup-locations-remove';
  var showSubmitClass = 'submit-visible';

  var container = $('.setup-locations');

  var addButton = container.find('.location-add');
  var submitButton = container.find('.location-submit');
  var removeButton = container.find('.location-remove');
  var input = container.find('input.location-search');
  var foundListContainer = container.find('.location-found-list .swiper-wrapper');
  var foundTemplate = container.find('#location-found-template').html();

  var scrollbar = new Swiper('.location-found-list', {
    direction: 'vertical',
    slidesPerView: 'auto',
    mousewheelControl: true,
    freeMode: true,
    observer: true,
    grabCursor: true
  });

  var render = function (proposedCities) {
    var output = Mustache.render(foundTemplate, {cities: proposedCities});
    foundListContainer.html(output);
  };

  var clearList = function () {
    foundListContainer.html('');
  };

  var clearInput = function () {
    input.val('');
  };

  var showSubmitButton = function () {
    container.addClass(showSubmitClass);
  };

  var hideSubmitButton = function () {
    container.removeClass(showSubmitClass);
  };

  addButton.on('click', function () {
    clearInput();
    clearList();
    container.removeClass(removeModeClass);
    container.toggleClass(addModeClass);
    input.focus();
    PubSub.publish('search.toggled');
  });

  removeButton.on('click', function () {
    container.removeClass(addModeClass);
    container.toggleClass(removeModeClass);
    PubSub.publish('remove.toggled');
  });

  input.on('keyup', function (e) {
    clearList();
    if (e.keyCode > 64 || e.keyCode === 8) {
      PubSub.publish('search.keyword.changed', e.target.value);
    }
  });

  foundListContainer.on('click', '.checkbox-location-choose', function (e) {
    var check = e.target.checked ? 'checked' : 'unchecked';
    PubSub.publish('search.city.' + check, e.target.getAttribute('data-place-id'));
  });

  submitButton.on('click', function () {
    PubSub.publish('sidebar.submitted');
    clearList();
    clearInput();
    container.removeClass(removeModeClass);
    container.removeClass(addModeClass);
  });

  return {
    render: render,
    showSubmitButton: showSubmitButton,
    hideSubmitButton: hideSubmitButton
  };


});
