angular.module('kibibitCodeEditor')

.directive('kbFontViewer', function() {
  return {
    scope: {},
    bindToController: {
      openFont: "=kbOpenFont"
    },
    controller: 'fontViewerController',
    controllerAs: 'fontViewerCtrl',
    link: function(scope, element, attrs, fontViewerCtrl) {
      scope.$watch('fontViewerCtrl.openFont', function(newOpenFont) {
        console.log('element: ',element);
        fontViewerCtrl.updateFontView(newOpenFont);
      });
    }
  };
})

.controller('fontViewerController', [
  function() {
    var vm = this;

    vm.updateFontView = function (fontObject) {

      // remove previous svg from dom if exists
      d3.select(".font-view-container").selectAll("svg").remove();
      

      var width = 960;
      var height = 500;
      var size = 120;
      var font = new Font();
      var text = 'f';

      font.onload = loaded;
      font.onerror = function (err) {
        alert(err);
      };
      font.fontFamily = 'fontName';
      font.src = '/api/download/' + encodeURIComponent(fontObject.path);

      var svg = d3.select(".font-view-container").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append('g')
        .attr('transform', 'translate('+[width/4, height/2-size/2]+')');

      svg.append('text')
        .classed('text', true)
        .style("dominant-baseline", "alphabetic")
        .style("text-anchor", "left")
        .style("font-size", size)
        .attr('x', width/4)
        .text(text);

      function show_font_metrics(metrics) {
        console.log(metrics);
        svg.append('line')
          .attr({x1:0, x2:2*width/4})
          .style({stroke: 'green'});
        svg.append('text')
          .text('baseline')
          .attr({x: 2*width/4+10})
          .style({'dominant-baseline': 'central', fill: 'green'});
        var y_a = -size*metrics.ascent;
        svg.append('line')
          .attr({x1:0, x2:2*width/4, y1: y_a, y2: y_a })
          .style({stroke: 'gray'});
        svg.append('text')
          .text('ascent')
          .attr({x: 2*width/4+10, y: y_a})
          .style({'dominant-baseline': 'central', fill: 'gray'});
        var y_d = -size*metrics.descent;
        svg.append('line')
          .attr({x1:0, x2:2*width/4, y1: y_d, y2: y_d })
          .style({stroke: 'gray'});
        svg.append('text')
          .text('descent')
          .attr({x: 2*width/4+10, y: y_d })
          .style({'dominant-baseline': 'central', fill: 'gray'});
      }

      function show_text_metrics(metrics) {
        console.log(metrics);
        // the bounding box around a text's pixels
        svg.append('rect')
          .attr({x: width/4+metrics.bounds.minx, y: -metrics.bounds.maxy
            ,width: metrics.bounds.maxx-metrics.bounds.minx
            ,height: metrics.bounds.maxy-metrics.bounds.miny})
          .style({fill: 'none', stroke: 'steelblue'});
        // leading -- the vertical distance between two baselines
        var y_leading = metrics.leading;
        svg.append('line')
          .attr({x1: 0, y1: -y_leading
            ,x2: 2*width/4, y2: -y_leading})
          .style({fill: 'none', stroke: 'lightgreen'});
        svg.append('line')
          .attr({x1: 0, y1: y_leading
            ,x2: 2*width/4, y2: y_leading})
          .style({fill: 'none', stroke: 'lightgreen'});
        // the width and height of a text
        svg.append('rect')
          .attr({x: width/4, y: -metrics.bounds.maxy
            ,width: metrics.width
            ,height: metrics.height})
          .style({fill: 'none', stroke: 'orange'});

        svg.append('text')
          .text('bounds')
          .style('fill', 'steelblue')
          .attr('x', width/4+metrics.bounds.maxx+10)
          .attr('y', -metrics.bounds.maxy);

        svg.append('text')
          .text('width & height')
          .style('fill', 'orange')
          .attr('x', width/4+metrics.bounds.maxx+10)
          .attr('y', -metrics.bounds.maxy+20);
      }

      function loaded() {
        show_font_metrics(font.metrics);
        console.time('measureText');
        var tm = font.measureText(text, size);
        console.timeEnd('measureText');
        show_text_metrics(tm);

        var d = [];
        svg.select('.text')
          .style('font-family', font.fontFamily)
          .each(function() { d.push(this.getBBox()) });
        d3.select('svg .term').selectAll('rect')
          .data(d).enter()
          .append('rect')
          .attr('x', function(d) {return d.x})
          .attr('y', function(d) {return d.y})
          .attr('width', function(d) {return d.width})
          .attr('height', function(d) {return d.height})
          .style('stroke', 'gray')
          .style('stroke-dasharray', '6 6')
          .style('fill', 'none')
      }
    }
  }
]);
