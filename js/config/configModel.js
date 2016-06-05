/**
 * Created by inokentii on 24.04.2016.
 */

define(['pubsub'], function (PubSub) {

  var config = {
    daysNumber: 3,
    updateTime: 15,
    isCelsius: false
  };


  function setIsCelsius(value) {
    config.isCelsius = value;
    save();
    PubSub.publish('config.isCelsius.changed');
  }

  function setDaysNumber(value) {
    config.daysNumber = value;
    save();
    PubSub.publish('config.daysNumber.changed');
  }

  function setUpdateTime(value) {
    config.updateTime = value;
    save();
    PubSub.publish('config.updateTime.changed');
  }

  function getIsCelsius() {
    return config.isCelsius;
  }

  function getDaysNumber() {
    return config.daysNumber;
  }

  function getUpdateTime() {
    return config.updateTime;
  }

  function open() {
    var json = localStorage.getItem('config');
    if (json === null) {
      return false;
    }
    config = JSON.parse(json);
    return true;
  }

  function save() {
    localStorage.removeItem('config');
    localStorage.setItem('config', JSON.stringify(config));
    return true;
  }

  open();

  return {
    setIsCelsius: setIsCelsius,
    setDaysNumber: setDaysNumber,
    setUpdateTime: setUpdateTime,
    getIsCelsius: getIsCelsius,
    getDaysNumber: getDaysNumber,
    getUpdateTime: getUpdateTime
  };

});
