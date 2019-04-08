(function () {
  'use strict';

  angular
    .module('trucadence')
    .constant('configService', {
      API_URL: 'https://trucadence.lexiconnetworks.com/api',
      Refresh_URL: 'https://169.53.13.77/lexicon/testenv/authProvider/oauth2/token',
      SDLC_URL: 'http://172.25.16.194:4040/api/',
      header_content_type: 'application/json',
      header_accept: 'application/json',
      header_clientid: 'd0fa992a-33a0-4c14-8957-73fd3e3d77fd',
      header_clientsecret: 'R4bL7hC8tS4lC2fD5bN8mP1wX6mD7qY2tQ3iU2nH2bA6vR5bL4',
      header_authorization: 'Bearer '
    });
})();
