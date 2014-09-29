'use strict';

/**
 * @ngdoc function
 * @name colombiaApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the colombiaApp
 */
angular.module('colombiaApp')
  .controller('MainCtrl', function ($scope, $http, $timeout) {

    $scope.dailyPv = 0;


    (function updateDailyPv() {
      var when = Date.create().format('{yyyy}-{MM}-{dd}');
      $http.get('http://dev.api.apimail.jp/api/1.0/pv/account/kat2n/daily/' + when)
        .success(function (data) {
          $scope.dailyPv = data.count;
          $timeout(updateDailyPv, 5000);
        })
      ;
    }());



    Highcharts.setOptions({
      global: {
        useUTC: false
      }
    });

    $('#container').highcharts({
      chart: {
        type: 'spline',
        animation: Highcharts.svg,
        marginRight: 10,
        events: {
          load: function () {
            var series = this.series[0];
            setInterval(function () {
              var
                x = (new Date()).getTime(),
                y = parseFloat($scope.dailyPv)
              ;
              series.addPoint([x, y], true, true);
            }, 1000);
          }
        }
      },
      title: {
        text: 'PV Real-Time Report'
      },
      xAxis: {
        type: 'datetime',
        tickPixelInterval: 150
      },
      yAxis: {
        title: {
          text: 'PV'
        },
        plotLines: [{
          value: 0,
          width: 1,
          color: '#808080'
        }]
      },
      tooltip: {
        formatter: function () {
          return '<b>' + this.series.name + '</b><br/>' +
          Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
          Highcharts.numberFormat(this.y, 2);
        }
      },
      legend: {
        enabled: false
      },
      exporting: {
        enabled: false
      },
      series: [{
        name: 'Random data',
        data: (function () {
          var
            data = [],
            time = (new Date()).getTime(),
            i
          ;
          for (i = -19; i <= 0; i += 1) {
            data.push({
              x: time + i * 1000,
              y: 0
            });
          }
          return data;
        }())
      }]
    });


  })
;
