/**
 * Created by inokentii on 15.05.2016.
 */

define(['jquery', 'mustache', 'pubsub', 'swiper'], function ($, Mustache, PubSub, Swiper) {

  var sidebarContainer = $('.setup');
  var forecastContainer = $('.forecast');
  var sidebarButton = sidebarContainer.find('.setup-extend');

  sidebarButton.on('click', function () {
    sidebarContainer.toggleClass('setup-hidden');
    forecastContainer.toggleClass('forecast-hidden');
  });

});

// $(document).on('pageinit', function () {
//   $.getJSON('assets/data/channels.json', {}, function (channelData, textStatus, jqXHr) {
//     var channelList = $('#channels');
//     $.get('assets/templates/channelList.mustache.html', function (template, textStatus, jqXhr) {
//       channelList.append(Mustache.render($(template).filter('#channelTpl').html(), channelData))
//       channelList.listview("refresh");
//     });
//   });
// });
