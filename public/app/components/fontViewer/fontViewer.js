angular.module('kibibitCodeEditor')

.directive('kbFontViewer', function() {
  return {
    scope: {},
    bindToController: {
      openFont: '=kbOpenFont'
    },
    controller: 'fontViewerController',
    controllerAs: 'fontViewerCtrl',
    templateUrl: 'app/components/fontViewer/fontViewerTemplate.html',
    link: function(scope, element, attrs, fontViewerCtrl) {
      scope.$watch('fontViewerCtrl.openFont', function(newOpenFont) {
        fontViewerCtrl.updateFontView(newOpenFont);
      });
      scope.$watch('fontViewerCtrl.previewText', function(textToRender) {
        if (fontViewerCtrl.font) {
          fontViewerCtrl.drawPreviewText(textToRender);
        }
      });
    }
  };
})

.controller('fontViewerController', [
  'QuotesService',
  function(QuotesService) {
    var vm = this;

    vm.fontSize = 100;

    vm.updateFontView = function(fontObject) {
      var path = '/api/download/' + encodeURIComponent(fontObject.path);
      opentype.load(path, function(err, font) {
        if (err) {
          alert('Font could not be loaded: ' + err);
        } else {
          vm.font = font;
          onFontLoaded();
          getQuotes();
        }

      });
    };

    function getQuotes() {
      QuotesService.getQuotes().then(function(quoteList) {
        vm.previewText = quoteList[0];
      }, function(error) {
        console.error(error);
      });
    }

    var selectedGlyphIndex;
    var selectedGlyphPageIndex = '0';
    var currentPage = '0';

    var cellCount = 100;
    // var cellWidth = 44;
    var cellWidth = 34;
    // var cellHeight = 40;
    var cellHeight = 30;
    var cellMarginTop = 1;
    var cellMarginBottom = 8;
    var cellMarginLeftRight = 1;
    var glyphMargin = 5;
    var pixelRatio = window.devicePixelRatio || 1;

    var pageSelected;
    var font;
    var fontScale;
    var fontSize;
    var fontBaseline;
    var glyphScale;
    var glyphSize;
    var glyphBaseline;
    var previewWidth;

    var ignoreChars = [
      '.notdef',
      'NULL',
      'uni0002',
      'nonmarkingreturn',
      'space',
      'nonbreakingspace',
      'uni2000',
      'uni2001',
      'uni2002',
      'uni2003',
      'uni2004',
      'uni2005',
      'uni2006',
      'uni2007',
      'uni2008',
      'uni2009',
      'uni200A',
      'uni200B',
      'uniFEFF',
      'NULL.001',
      'uni0009'
    ];

    function fixPreviewCanvasSize() {
      var previewInput = document.getElementById('preview-input');
      previewWidth = previewInput.offsetWidth;
      var previewCanvas = document.getElementById('preview-canvas');
      previewCanvas.width = previewWidth;
    }

    function enableHighDPICanvas(canvas) {
      if (typeof canvas === 'string') {
        canvas = document.getElementById(canvas);
      }
      var pixelRatio = window.devicePixelRatio || 1;
      if (pixelRatio === 1) { return; }
      var oldWidth = canvas.width;
      var oldHeight = canvas.height;
      canvas.width = oldWidth * pixelRatio;
      canvas.height = oldHeight * pixelRatio;
      canvas.style.width = oldWidth + 'px';
      canvas.style.height = oldHeight + 'px';
      canvas.getContext('2d').scale(pixelRatio, pixelRatio);
    }

    // function showErrorMessage(message) {
    //   var el = document.getElementById('message');
    //   if (!message || message.trim().length === 0) {
    //     el.style.display = 'none';
    //   } else {
    //     el.style.display = 'block';
    //   }
    //   el.innerHTML = message;
    // }

    function pathCommandToString(cmd) {
      var str = '<strong>' + cmd.type + '</strong> ' +
        ((cmd.x !== undefined) ? 'x=' + cmd.x + ' y=' + cmd.y + ' ' : '') +
        ((cmd.x1 !== undefined) ? 'x1=' + cmd.x1 + ' y1=' + cmd.y1 + ' ' : '') +
        ((cmd.x2 !== undefined) ? 'x2=' + cmd.x2 + ' y2=' + cmd.y2 : '');
      return str;
    }

    function contourToString(contour) {
      return '<pre class="contour">' + contour.map(function(point) {
          return '<span class="' +
                 (point.onCurve ? 'on' : 'off') +
                 'curve">x=' + point.x + ' y=' + point.y + '</span>';
        }).join('\n') + '</pre>';
    }

    function formatUnicode(unicode) {
      unicode = unicode.toString(16);
      if (unicode.length > 4) {
        return ('000000' + unicode.toUpperCase()).substr(-6);
      } else {
        return ('0000' + unicode.toUpperCase()).substr(-4);
      }
    }

    function displayGlyphData(glyphIndex) {
      var container = document.getElementById('glyph-data');
      if (glyphIndex < 0) {
        container.innerHTML = '';
        return;
      }
      var glyph = vm.font.glyphs.get(glyphIndex);

      // Display glyph name
      var glyphName = document.getElementById('selected-glyph-name');
      var nameDesc = 'Name: ' + glyph.name;
      glyphName.innerHTML = nameDesc;

      // Display glyph unicode number
      var glyphCode = document.getElementById('selected-glyph-unicode');
      var unicodeDesc = '';
      if (glyph.unicodes.length > 0) {
        var unicode = glyph.unicodes.map(formatUnicode).join(', ');
        unicodeDesc = 'Unicode: ' + unicode;
      }
      glyphCode.innerHTML = unicodeDesc;

      var glyphWidth = document.getElementById('selected-glyph-width');
      var advancedWidth = 'Width: ' + glyph.advanceWidth;
      glyphWidth.innerHTML = advancedWidth;

      var glyphIndex = document.getElementById('selected-glyph-index');
      var index = 'Index: ' + glyph.index;
      glyphIndex.innerHTML = index;
    }

    /**
     * This function is Path.prototype.draw with an arrow
     * at the end of each contour.
     */
    function drawPathWithArrows(ctx, path) {
      var i;
      var cmd;
      var x1;
      var y1;
      var x2;
      var y2;
      var arrows = [];

      ctx.beginPath();
      for (i = 0; i < path.commands.length; i += 1) {
        cmd = path.commands[i];
        if (cmd.type === 'M') {
          if (x1 !== undefined) {
            arrows.push([ctx, x1, y1, x2, y2]);
          }
          ctx.moveTo(cmd.x, cmd.y);
        } else if (cmd.type === 'L') {
          ctx.lineTo(cmd.x, cmd.y);
          x1 = x2;
          y1 = y2;
        } else if (cmd.type === 'C') {
          ctx.bezierCurveTo(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
          x1 = cmd.x2;
          y1 = cmd.y2;
        } else if (cmd.type === 'Q') {
          ctx.quadraticCurveTo(cmd.x1, cmd.y1, cmd.x, cmd.y);
          x1 = cmd.x1;
          y1 = cmd.y1;
        } else if (cmd.type === 'Z') {
          arrows.push([ctx, x1, y1, x2, y2]);
          ctx.closePath();
        }
        x2 = cmd.x;
        y2 = cmd.y;
      }
      if (path.fill) {
        ctx.fillStyle = path.fill;
        ctx.fill();
      }
      if (path.stroke) {
        ctx.strokeStyle = path.stroke;
        ctx.lineWidth = path.strokeWidth;
        ctx.stroke();
      }
      ctx.fillStyle = '#000000';
      // arrows.forEach(function(arrow) {
      //   drawArrow.apply(null, arrow);
      // });
    }

    function displayGlyph(glyphIndex) {
      var canvas = document.getElementById('glyph');
      var ctx = canvas.getContext('2d');
      var width = canvas.width / pixelRatio;
      var height = canvas.height / pixelRatio;

      ctx.clearRect(0, 0, width, height);
      if (glyphIndex < 0) { return; }

      var glyph = vm.font.glyphs.get(glyphIndex);
      var glyphWidth = glyph.advanceWidth * glyphScale;
      var xmin = (width - glyphWidth) / 2;
      var xmax = (width + glyphWidth) / 2;
      var x0 = xmin;
      var markSize = 10;

      ctx.fillStyle = '#606060';
      ctx.fillRect(xmin - markSize + 1, glyphBaseline, markSize, 1);
      ctx.fillRect(xmin, glyphBaseline, 1, markSize);
      ctx.fillRect(xmax, glyphBaseline, markSize, 1);
      ctx.fillRect(xmax, glyphBaseline, 1, markSize);
      ctx.textAlign = 'center';
      ctx.fillText('0', xmin, glyphBaseline + markSize + 10);
      ctx.fillText(glyph.advanceWidth, xmax, glyphBaseline + markSize + 10);

      ctx.fillStyle = '#000000';
      var path = glyph.getPath(x0, glyphBaseline, glyphSize);
      path.fill = '#808080';
      path.stroke = '#000000';
      path.strokeWidth = 1.5;
      drawPathWithArrows(ctx, path);
      // glyph.drawPoints(ctx, x0, glyphBaseline, glyphSize);
    }

    function renderGlyphItem(canvas, glyphIndex) {
      var cellMarkSize = 4;
      var ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, cellWidth, cellHeight);
      if (glyphIndex >= vm.font.numGlyphs) { return; }

      ctx.fillStyle = '#606060';
      ctx.font = '9px sans-serif';
      ctx.fillText(glyphIndex, 1, cellHeight - 1);
      var glyph = vm.font.glyphs.get(glyphIndex);
      var glyphWidth = glyph.advanceWidth * fontScale;
      var xmin = (cellWidth - glyphWidth) / 2;
      var xmax = (cellWidth + glyphWidth) / 2;
      var x0 = xmin;

      ctx.fillStyle = '#a0a0a0';
      ctx.fillRect(xmin - cellMarkSize + 1, fontBaseline, cellMarkSize, 1);
      ctx.fillRect(xmin, fontBaseline, 1, cellMarkSize);
      ctx.fillRect(xmax, fontBaseline, cellMarkSize, 1);
      ctx.fillRect(xmax, fontBaseline, 1, cellMarkSize);

      ctx.fillStyle = '#000000';
      glyph.draw(ctx, x0, fontBaseline, fontSize);
    }

    function displayGlyphPage(pageNum) {
      pageSelected = pageNum;
      document.getElementById('p' + pageNum).className = 'page-selected';
      var firstGlyph = pageNum * cellCount;
      for (var i = 0; i < cellCount; i++) {
        renderGlyphItem(document.getElementById('g' + i), firstGlyph + i);
      }
    }

    function pageSelect(event) {
      currentPage = event.target.id.substr(1);
      document.getElementsByClassName('page-selected')[0].className = '';
      displayGlyphPage(+event.target.id.substr(1));

      if (currentPage === selectedGlyphPageIndex) {
        selectCurrentGlyph(selectedGlyphIndex);
      } else {
        deselectCurrentGlyph();
      }

    }

    function initGlyphDisplay() {
      var glyphBgCanvas = document.getElementById('glyph-bg');
      var w = glyphBgCanvas.width / pixelRatio;
      var h = glyphBgCanvas.height / pixelRatio;
      var glyphW = w - glyphMargin * 2;
      var glyphH = h - glyphMargin * 2;
      var head = vm.font.tables.head;
      var maxHeight = head.yMax - head.yMin;
      var ctx = glyphBgCanvas.getContext('2d');

      glyphScale = Math.min(
        glyphW / (head.xMax - head.xMin), glyphH / maxHeight
      );
      glyphSize = glyphScale * vm.font.unitsPerEm;
      glyphBaseline = glyphMargin + glyphH * head.yMax / maxHeight;

      function hline(text, yunits) {
        var ypx = glyphBaseline - yunits * glyphScale;
        ctx.fillText(text, 2, ypx + 3);
        ctx.fillRect(80, ypx, w, 1);
      }

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#a0a0a0';
      hline('Baseline', 0);
      // hline('yMax', vm.font.tables.head.yMax);
      // hline('yMin', vm.font.tables.head.yMin);
      hline('Ascender', vm.font.tables.hhea.ascender);
      hline('Descender', vm.font.tables.hhea.descender);
      // hline('Typo Ascender', vm.font.tables.os2.sTypoAscender);
      // hline('Typo Descender', vm.font.tables.os2.sTypoDescender);
    }

    function onFontLoaded() {
      window.font = vm.font;

      var fontName = vm.font.names.fullName.en;
      document.getElementById('font-name').innerHTML = fontName;

      var w = cellWidth - cellMarginLeftRight * 2;
      var h = cellHeight - cellMarginTop - cellMarginBottom;
      var head = vm.font.tables.head;
      var maxHeight = head.yMax - head.yMin;

      fontScale = Math.min(w / (head.xMax - head.xMin), h / maxHeight);
      fontSize = fontScale * vm.font.unitsPerEm;
      fontBaseline = cellMarginTop + h * head.yMax / maxHeight;

      var pagination = document.getElementsByClassName('pagination')[0];
      pagination.innerHTML = '';
      var fragment = document.createDocumentFragment();
      var numPages = Math.ceil(vm.font.numGlyphs / cellCount);
      for (var i = 0; i < numPages; i++) {
        var link = document.createElement('span');
        var lastIndex = Math.min(
          vm.font.numGlyphs - 1, (i + 1) * cellCount - 1
        );
        link.textContent = i * cellCount + '-' + lastIndex;
        link.id = 'p' + i;
        link.addEventListener('click', pageSelect, false);
        fragment.appendChild(link);
        // A white space allows to break very long lines into multiple lines.
        // This is needed for fonts with thousands of glyphs.
        fragment.appendChild(document.createTextNode(' '));
      }
      pagination.appendChild(fragment);

      initGlyphDisplay();
      displayGlyphPage(0);

      var glyphRange = vm.font.numGlyphs > 100 ? 100 : vm.font.numGlyphs;
      selectedGlyphIndex = getRandomIntInclusive(0, glyphRange);
      selectCurrentGlyph(selectedGlyphIndex);

      displayGlyph(selectedGlyphIndex);
      displayGlyphData(selectedGlyphIndex);
    }

    function getRandomIntInclusive(min, max) {
      do {
        var index = Math.floor(Math.random() * (max - min + 1)) + min;
        var tempGlyph = vm.font.glyphs.get(index);
      }
      while (ignoreChars.indexOf(tempGlyph.name) != -1);
      return index;
    }

    function cellSelect(event) {
      if (!vm.font) { return; }
      var firstGlyphIndex = pageSelected * cellCount;
      var cellIndex = +event.target.id.substr(1);
      var glyphIndex = firstGlyphIndex + cellIndex;

      selectCurrentGlyph(glyphIndex);
      if (glyphIndex < vm.font.numGlyphs) {
        displayGlyph(glyphIndex);
        displayGlyphData(glyphIndex);
      }
    }

    function selectCurrentGlyph(index) {
      //we use mod100 in order to get the right index(0-99) after the 1st page
      index %= 100;
      selectedGlyphIndex = index;
      selectedGlyphPageIndex = currentPage;
      deselectCurrentGlyph();
      var selectedGlyph = document.getElementById('g' + index);
      selectedGlyph.className += ' selected-glyph';
    }

    function deselectCurrentGlyph() {
      var glyphToDeselect = document.getElementsByClassName('selected-glyph');
      if (glyphToDeselect[0]) {
        glyphToDeselect[0].className = 'item';
      }
    }

    function prepareGlyphList() {
      var marker = document.getElementById('glyph-list-end');
      var parent = marker.parentElement;

      for (var i = 0; i < cellCount; i++) {
        var canvas = document.createElement('canvas');
        canvas.width = cellWidth;
        canvas.height = cellHeight;
        canvas.className = 'item';
        canvas.id = 'g' + i;
        canvas.addEventListener('click', cellSelect, false);
        enableHighDPICanvas(canvas);
        parent.insertBefore(canvas, marker);
      }
    }

    vm.drawPreviewText = function(textToRender) {
      var snapPath = vm.font.getPath(textToRender, 10, 25, 20);
      var snapCtx = document.getElementById('preview-canvas').getContext('2d');
      snapCtx.clearRect(0, 0, previewWidth, 40);
      snapPath.fill = 'rgb(255, 188, 0)';
      snapPath.stroke = 'rgb(255, 188, 0)';
      snapPath.draw(snapCtx);

    };

    fixPreviewCanvasSize();

    enableHighDPICanvas('glyph-bg');
    enableHighDPICanvas('glyph');

    prepareGlyphList();
  }
]);
