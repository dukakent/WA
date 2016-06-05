/**
 * Created by inokentii on 17.04.2016.
 */

/* global $, define, PubSub */

define(['jquery', 'pubsub', 'sunView'], function ($, PubSub, view) {
  
  view.render();
  
  $(window).resize(view.render);
  

});
