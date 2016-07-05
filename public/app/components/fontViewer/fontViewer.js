angular.module('kibibitCodeEditor')

.directive('kbFontViewer', function() {
  return {
    scope: {},
    bindToController: {
      openFont: "=kbOpenFont"
    },
    controller: 'fontViewerController',
    controllerAs: 'fontViewerCtrl',
    templateUrl: 'app/components/fontViewer/fontViewerTemplate.html',
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

    vm.fontSize = 100;

    vm.updateFontView = function (fontObject) {
      var path = '/api/download/' + encodeURIComponent(fontObject.path);
      opentype.load(path, function(err, font) {
        if (err) {
          alert('Font could not be loaded: ' + err);
        } else {
          console.log('font: ', font);
          vm.font = font;
          vm.redrawFont();
        }

      });
    };

    vm.redrawFont = function() {
      var canvas = document.getElementById('font-canvas');
      var ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Construct a Path object containing the letter shapes of the given text.
      // The other parameters are x, y and fontSize.
      // Note that y is the position of the baseline.
      var baseline = 150;
      var path = vm.font.getPath('f', 0, baseline, vm.fontSize);
      // If you just want to draw the text you can also use font.draw(ctx, text, x, y, fontSize).
      path.draw(ctx);

      //adjust the ascent and descent to font size
      var descent = vm.font.descender * vm.fontSize / 1000;
      var ascent = vm.font.ascender * vm.fontSize /1000;

      ctx.beginPath();
      ctx.moveTo(0, baseline);
      ctx.lineTo(500,baseline);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.stroke();

      ctx.font = "20px Ariel";
      ctx.fillStyle = "white";
      ctx.fillText('baseline', 520, baseline);

      ctx.beginPath();
      ctx.moveTo(0, baseline - descent);
      ctx.lineTo(500,baseline - descent);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(0, 0, 255, 0.5)';
      ctx.stroke();

      ctx.font = "20px Ariel";
      ctx.fillStyle = "blue";
      ctx.fillText('descent', 520, baseline - descent);

      ctx.beginPath();
      ctx.moveTo(0, baseline - ascent);
      ctx.lineTo(500,baseline - ascent);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
      ctx.stroke();

      ctx.font = "20px Ariel";
      ctx.fillStyle = "green";
      ctx.fillText('ascent', 520, baseline - ascent);

    }

  }
]);
