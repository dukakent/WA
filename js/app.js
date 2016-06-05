/**
 * Created by Inokentii_Duka on 21.04.2016.
 */

/* global $ */

require.config({
  baseUrl: 'js/',
  paths: {

    // Libraries and utilities
    jquery:                       'utils/jquery.min',
    swiper:                       'utils/swiper.min',
    pubsub:                       'utils/pubsub',
    mustache:                     'utils/mustache',
    googlePlacesAPI:              'https://maps.googleapis.com/maps/api/js?key=AIzaSyAKuBv-lzUDR8StEt7RRNDwzWtjqZD_bv4&language=en&libraries=places',

    // services
    googleService:                'googleService/googleService',
    forecastService:              'forecastService/forecastService',

    // city component
    cityModel:                    'city/cityModel',

    // cities collection component
    citiesCollection:             'citiesCollection/citiesCollection',
    citiesListController:         'citiesList/citiesListController',
    citiesListView:               'citiesList/citiesListView',
    citiesGalleryController:      'citiesGallery/citiesGalleryController',
    citiesGalleryView:            'citiesGallery/citiesGalleryView',

    // config component
    configModel:                  'config/configModel',
    configController:             'config/configController',
    configView:                   'config/configView',

    // search component
    searchController:             'search/searchController',
    searchView:                   'search/searchView',

    // sidebar component
    sidebarController:             'sidebar/sidebarController',
    sidebarView:                   'sidebar/sidebarView',

    // sun component
    sunController:                'sun/sunController',
    sunView:                      'sun/sunView',

    // background
    background:                   'background/background'
  }
});

require([
  'background',
  'sunController',
  'sidebarController',
  'configController',
  'searchController',
  'citiesListController',
  'citiesGalleryController'
]);
