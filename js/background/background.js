/**
 * Created by Inokentii_Duka on 03.06.2016.
 */

define(function () {

  var container = document.querySelector('.bg');

  var dropClasses = ['rain', 'snow'];
  var timeClasses = ['evening', 'morning', 'night'];

  function rain() {
    clearWeather();
    container.classList.add('rain');
  }

  function snow() {
    clearWeather();
    container.classList.add('snow');
  }
  
  function warm() {
    container.classList.add('warm');
  }
  
  function cold() {
    container.classList.remove('warm');
  }

  function clearWeather() {
    dropClasses.forEach(function (className) {
      container.classList.remove(className);
    });
  }
  
  function clearTime() {
    timeClasses.forEach(function (className) {
      container.classList.remove(className);
    });
  }

  function setTime(phase) {
    clearTime();
    var timeClass;
    if (phase >= -0.1 && phase <= 0.1) {
      timeClass = 'morning';
    } else if (phase >= 0.9 && phase <= 1.1) {
      timeClass = 'evening';
    } else if (phase < -0.1 || phase > 1.1) {
      timeClass = 'night';
    }
    container.classList.add(timeClass);
  }

  return {
    rain: rain,
    snow: snow,
    clearWeather: clearWeather,
    setTime: setTime,
    warm: warm,
    cold: cold
  };

});
