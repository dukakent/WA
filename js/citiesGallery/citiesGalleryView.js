/**
 * Created by inokentii on 16.05.2016.
 */

define(['swiper', 'jquery', 'mustache', 'pubsub'], function (Swiper, $, Mustache, PubSub) {

  var gallerySwiper = new Swiper('.forecast', {
    spaceBetween: 50,
    pagination: '.forecast-dots',
    paginationClickable: true,
    observer: true
  });

  var galleryContainer = $('.forecast .swiper-wrapper');
  var template = galleryContainer.find('#gallery-item-template').html();
  var dailyTemplate = galleryContainer.find('#gallery-item-daily-template').html();

  function createHoursSlider(placeId) {
    return new Swiper('[data-place-id="' + placeId + '"] .weather-today', {
      scrollbarHide: false,
      scrollbarDraggable: true,
      scrollbar: '.forecast-hours-scrollbar',
      direction: 'horizontal',
      slidesPerView: 'auto',
      mousewheelControl: true,
      observer: true,
      nested: true,
      grabCursor: true
    });
  }

  function appendCity(city) {
    var output = Mustache.render(template, city);
    galleryContainer.append(output);
  }

  function removeCity(placeId) {
    galleryContainer
      .find('[data-place-id="' + placeId + '"]')
      .remove()
      .ready(onSlideChanged);
  }

  function updateCity(city) {
    var output = Mustache.render(template, city);
    var old = galleryContainer.find('[data-place-id="' + city.placeId + '"]');
    old.replaceWith(output)
      .ready(function () {
        createHoursSlider(city.placeId);
        onSlideChanged();
        PubSub.publish('gallery.city.rendered', city);
      });
  }

  function showDays(city, number) {
    var dailyContainer = galleryContainer
      .find('[data-place-id="' + city.placeId + '"] .forecast-weekly')
      .empty();
    var days = city.forecast.daily.data;
    for (var i = 0; (i < number) && (i < days.length); i++) {
      var html = Mustache.render(dailyTemplate, days[i]);
      dailyContainer.append(html);
    }
  }

  function onSlideChanged() {
    setTimeout(function () {
      var placeId = galleryContainer[0]
        .querySelector('.forecast-location.swiper-slide-active')
        .getAttribute('data-place-id');
      PubSub.publish('gallery.slide.changed', placeId);
    }, 100);
  }

  function slide(placeId) {
    var slides = galleryContainer.find('.forecast-location');
    var clickedSlide = slides.filter('[data-place-id="' + placeId + '"]');
    var index = slides.index(clickedSlide);
    gallerySwiper.slideTo(index);
    onSlideChanged();
  }


  gallerySwiper.on('slideChangeEnd', onSlideChanged);
  galleryContainer.on('click', '.sync-icon', function () {
    PubSub.publish('gallery.updateButton.clicked');
  });

  return {
    appendCity: appendCity,
    removeCity: removeCity,
    updateCity: updateCity,
    showDays: showDays,
    slide: slide
  };

});
