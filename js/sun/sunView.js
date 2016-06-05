/**
 * Created by inokentii on 16.04.2016.
 */

/* global define, $ */

define(['jquery'], function ($) {
  /* Getting DOM objects of sun and its field */
  var _orbit = $('.sun-orbit');
  var _sun = _orbit.find('.sun');

  /* Method for computing height of orbit's visible segment */
  _orbit.segmentHeight = function () {
    var h = window.innerHeight / 2;
    if (h > window.innerWidth / 2) {
      h = window.innerWidth / 2;
    }
    return h;
  };

  /* Method for calculating radius or orbit */
  _orbit.radius = function () {
    return (this.segmentHeight() / 2) + ((window.innerWidth * window.innerWidth) / (8 * this.segmentHeight()));
  };

  /* Method for calculating angle of orbit's visible segment */
  _orbit.angle = function () {
    var angleVisible = 2 * Math.acos((this.radius() - this.segmentHeight()) / this.radius());
    var angleAdditional = 2 * Math.asin(_sun.width() / (4 * this.radius()));
    return angleVisible + 2 * angleAdditional;
  };

  /* Orbit's method for setting DOM element */
  _orbit.render = function () {
    this.css({ top: window.innerHeight - this.segmentHeight() });
    this.width(this.radius() * 2);
    this.height(this.radius() * 2);
  };

  /* method for changing sun color relate on phase */
  _sun.setColor = function (phase) {
    var midColorGreen = (240 - 156 * phase).toFixed();
    var opacity = (0.5 + 0.5 * phase).toFixed(5);
    _sun.css({
      background: 'radial-gradient(rgb(255, 240, 0), ' +
        'rgba(255, ' + midColorGreen + ', 0, ' + opacity + ') 33%, ' +
        'rgba(255, 240, 0, 0) 66%)'
    });
  };

  /* Change position of sun on the orbit, relate on phase */
  _sun.render = function (phase) {
    var angle = _orbit.angle();
    var newX;
    var newY;
    phase = phase || _sun.currentPhase || 0;
    if (phase < 0 || phase >= 1) {
      phase = 0;
    }
    newX = 50 - (50 * Math.cos((Math.PI + (2 * angle * phase) - angle) / 2));
    newY = 50 - (50 * Math.sin((Math.PI + (2 * angle * phase) - angle) / 2));
    _sun.currentPhase = phase.toFixed(5) / 1;
    _sun.css({
      top: newY + '%',
      left: newX + '%'
    });
  };

  /* Sun's method for transitive moving from current phase to new one */
  _sun.move = function (newPhase, speed) {
    _sun.css({
      letterSpacing: _sun.currentPhase
    }).stop().animate({
      letterSpacing: newPhase
    }, {
      duration: Math.abs(newPhase - _sun.currentPhase) / speed * 1000,
      step: function (t) {
        _sun.render(t);
        _sun.setColor(t);
      },
      queue: false
    });
  };

  return {
    /* Public initial method */
    render: function () {
      _orbit.render();
      _sun.render();
    },
    /* Update sun position, relate on sunrise, sunset and current time */
    update: function (params) {
      var speed = 0.1;
      var newPhase = _sun.currentPhase;

      if ('phase' in params) {
        newPhase = params.phase;
      }

      if ('now' in params && 'sunrise' in params && 'sunset' in params) {
        newPhase = ((params.now - params.sunrise) / (params.sunset - params.sunrise)).toFixed(5) / 1;
      }

      if ('speed' in params) {
        speed = params.speed;
      }

      if (_sun.currentPhase > 0 || newPhase < 1) {
        _sun.move(newPhase, speed);
      }
    }
  };
});
