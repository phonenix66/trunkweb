define([
  'jquery',
  'underscore',
  'backbone',
  'text!modules/map/tmpl.html',
  'modules/map/model',
  'modules/map/components/general/view',
  'modules/map/components/investment/view',
  'modules/map/components/center/view',
  'modules/map/components/quality/view',
  'modules/map/components/warning/view'
], function ($, _, Backbone, tmpl, Model, General, Investment, Center, Quality, Warning) {
  'use strict';
  return Backbone.View.extend({
    el: '#mapWrapper',
    template: _.template(tmpl),
    initialize: function () {
      var self = this;
      this.render();
      this.model = new Model();
      var userinfo = this.model.get('userinfo');
      console.log(userinfo);
      var general = new General(userinfo);
      var investment = new Investment(userinfo);
      var center = new Center();
      var quality = new Quality(userinfo);
      var warning = new Warning(userinfo);
      //console.log(general, investment, center, quality, warning);
      this.fetchArray = [];
      Backbone.on('listen:fetch', this.listenFetch, this);
    },
    render: function () {
      this.$el.html(this.template());
    },
    listenFetch: function (data) {
      this.fetchArray.push(data);
      if (this.fetchArray.length == 4) {
        $('.mask-layer').hide();
        this.fetchArray = [];
      } else {
        $('.mask-layer').show();
      }
    }
  })
});