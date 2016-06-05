/**
 * Created by inokentii on 24.04.2016.
 */

/* global $, PubSub */

define(['jquery', 'pubsub'], function ($, PubSub) {

  var container = $('.setup-view');
  var temp = container.find('.radio-temp');
  var days = container.find('.setup-days');
  var updateTime = container.find('.setup-update');

  var setTempType = function (newValue) {
    temp.filter('.radio-temp-celsius').prop('checked', newValue);
    temp.filter('.radio-temp-fahrenheit').prop('checked', !newValue);
  };

  var setRange = function (range, newValue) {
    range.find('.range-value').html(newValue);
    range.find('input[type="range"]').val(newValue);
  };

  var getRange = function (range) {
    return range.find('input[type="range"]').val();
  };

  var render = function (config) {
    setTempType(config.getIsCelsius());
    setRange(days, config.getDaysNumber());
    setRange(updateTime, config.getUpdateTime());
  };

  temp.on('change', function (e) {
    var isCelsius;
    var event;
    if (e.target.checked) {
      isCelsius = e.target.classList.contains('radio-temp-celsius');
      event = isCelsius ? 'checked' : 'unchecked';
      PubSub.publish('config.celsius.' + event);
    }
  });

  days.on('input', function () {
    var value = getRange(days);
    setRange(days, value);
    PubSub.publish('config.range.days.changed', value);
  });

  updateTime.on('input', function () {
    var value = getRange(updateTime);
    setRange(updateTime, value);
    PubSub.publish('config.range.updateTime.changed', value);
  });

  return {
    render: render
  };

});
