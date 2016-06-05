/**
 * Created by inokentii on 24.04.2016.
 */

define(['pubsub', 'configModel', 'configView'], function (PubSub, config, ConfigView) {

  function onCelsius() {
    config.setIsCelsius(true);
  }

  function onFahrenheit() {
    config.setIsCelsius(false);
  }

  function onDaysChanged(eventName, value) {
    config.setDaysNumber(value);
  }

  function onUpdateTimeChanged(eventName, value) {
    config.setUpdateTime(value);
  }

  ConfigView.render(config);
  PubSub.subscribe('config.celsius.checked', onCelsius);
  PubSub.subscribe('config.celsius.unchecked', onFahrenheit);
  PubSub.subscribe('config.range.days.changed', onDaysChanged);
  PubSub.subscribe('config.range.updateTime.changed', onUpdateTimeChanged);

});
