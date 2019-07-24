require.config({
  map: {
    "*": {
      'css': "../../js/lib/require-css/css"
    }
  },
  paths: {
    "jquery": ["../../js/lib/jquery/dist/jquery"],
    "underscore": ["../../js/lib/underscore/underscore"],
    "underscore.string": ["../../js/lib/underscore.string/dist/underscore.string.min"],
    "doT": ['../../js/lib/doT/doT'],
    "Backbone": ['../../js/lib/backbone/backbone'],
    "fastclick": ["../../js/lib/fastclick/lib/fastclick"],
    "text": ['../../js/lib/text/text'],
    "api": ['../../js/api/api'],
    "apiConfig": ['../../js/api/apiConfig'],
    "jquery.cookie": ['../../js/lib/jquery/dist/jquery.cookie'],
    "base64": ['../../js/lib/base64/base64'],
    "verify": ["../../js/plugin/verify/verify"],
  },
  shim: {
    "apiConfig": {
      deps: ['jquery', 'api']
    },
    "verify": {
      deps: ['jquery', 'css!../../js/plugin/verify/css/verify.css']
    },
  }
});

require(['app'], function (App) {
  var app = new App();
})