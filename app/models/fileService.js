var fs = require('fs'),
    util = require('util'),
    mime = require('mime-types'),
    id3 = require('id3js'),
    base64 = require('base64-arraybuffer');
var console = require('./consoleService')('FILE CONTENT', ['blue', 'inverse']);

var fileService = {};

fileService.get = function(req, res) {
  var fileFullPath = req.params.file_id;
  var mimeType = mime.lookup(fileFullPath) || extraTypes(fileFullPath) || '';

  // fix case for ES6 files (currently, highlight them as regular javascript)
  if (!mimeType && fileFullPath.toLowerCase().endsWith('es6')) {
    mimeType = 'application/javascript';
  }

  var isFileOfType = function(type) {
    return mimeType.indexOf(type) !== -1;
  };

  var showNoContent = false ||
      isFileOfType('zip') ||
      isFileOfType('program') ||
      isFileOfType('application/x-apple-diskimage') ||
      isFileOfType('application/vnd.ms-fontobject');

  // temprorary solution until we have a view selector on the FRONT-END
  if (showNoContent) {
    res.json({
      content: 'awww man... we can\'t show ' + mimeType + ' yet :-(',
      mimeType: 'text/text',
      errno: -1
    });
  } else if (isFileOfType('audio')) {
    console.info('audio requested. Serving data info');
    id3({
      file: fileFullPath,
      type: id3.OPEN_LOCAL
    }, function(err, tags) {
      if (err) {
        var file = {
          url: 'api/download/' + encodeURIComponent(fileFullPath),
          mimeType: mimeType,
          path: fileFullPath
        };

        res.json(file);

        return;
      }
      // get album cover as base64 encoded dataURI
      var album = tags.v2.image ? converterToBase64(tags.v2.image) : undefined;

      var file = {
        url: 'api/download/' + encodeURIComponent(fileFullPath),
        mimeType: mimeType,
        path: fileFullPath,
        artist: tags.artist,
        album: tags.album,
        name: tags.title,
        albumArt: album,
        albumArtFormat: tags.v2.image ? tags.v2.image.mime : undefined
      };
      res.json(file);
    });
  } else if (isFileOfType('image')) {
    console.info('image requested. Serving data URI');
    var dataUri = base64Image(fileFullPath);
    var file = {
      content: dataUri,
      mimeType: mimeType,
      path: fileFullPath
    };
    res.json(file);
  } else if (isFileOfType('font')) {
    var file = {
      mimeType: mimeType,
      path: fileFullPath
    };
    res.json(file);
  } else {
    fs.readFile(fileFullPath, 'utf8', function(err, data) {
      if (err) {
        res.json(err);
        console.error('file-get returned an error: ' + err);
      } else {
        fs.stat(fileFullPath, function(err, stats) {
          var file = {
            content: data,
            mimeType: mimeType,
            lastModified: stats.mtime,
            path: fileFullPath
          };
          res.json(file);
          console.info('file requested: ' + fileFullPath);
        });
      }
    });
  }
};

fileService.put = function(req, res) {
  var fileFullPath = req.params.file_id;
  try {
    var stat = fs.statSync(fileFullPath);
    res.json({
      'errno': '330',
      'code': 'File already exists',
      'path': fileFullPath
    });
    console.error('file couldn\'t be saved: ' + fileFullPath);
  } catch (err) {
    if (req.body.newContent) {
      fs.writeFile(fileFullPath,
        req.body.newContent, 'utf8', function(err) {
        if (err) {
          res.json(err);
          console.error('file couldn\'t be saved: ' + err);
        } else {
          res.json({
            message: 'file saved successfully'
          });
          console.info('file saved: ' + fileFullPath);
        }
      });
    }
  }
};

fileService.delete = function(req, res) {
  var fileFullPath = req.params.file_id;
  try {
    // rm fiilename
    fs.unlinkSync(fileFullPath);
    res.json({
      message: 'file deleted successfully'
    });
    console.info('file deleted: ' + fileFullPath);
  } catch (err) {
    res.json(err);
    console.error('couldn\'t delete file: ' + fileFullPath);
  }
};

fileService.putExtraArg = function(req, res) {
  var fileFullPath = req.params.file_id;
  var isHardSave = req.params.extra_arg;
  if (isHardSave === 'true') {
    if (req.body.newContent) {
      fs.writeFile(fileFullPath, req.body.newContent, 'utf8', function(err) {
        if (err) {
          res.json(err);
          console.error('file couldn\'t be saved: ' + err);
        } else {
          res.json({
            message: 'file saved successfully'
          });
          console.info('file saved: ' + fileFullPath);
        }
      });
    } else {
      res.json({
        message: 'you have to include a body with newContent'
      });
    }
  } else {
    res.json({
      message: 'For a hard save, 2nd param should be: True'
    });
  }
};

fileService.getFileTags = function(filepath) {
  var fileTags = [];
  var filenameRegex = /[\\\/]([^\\\/]+)$/;
  var match = filenameRegex.exec(filepath);
  var match = match.length > 0 ? match[1] : undefined;
  if (filepath.indexOf('.') !== -1 && match) {
    var tags = match.split('.');
    // remove the extension
    tags.pop();

    tags.forEach(function(tag) {
      switch (tag) {
        case 'min':
          fileTags.push('minified');
          break;
        case 'conf':
        case 'config':
        case 'configuration':
          fileTags.push('configuration');
          break;
        case 'test':
        case 'spec':
        case 'specs':
          fileTags.push('test');
          break;
        case 'template':
        case 'partial':
          fileTags.push('template');
          break;
        case 'controller':
        case 'ctrl':
          fileTags.push('controller');
          break;
        case 'service':
          fileTags.push('service');
          break;
        case 'module':
          fileTags.push('module');
          break;
        case 'routes':
        case 'route':
          fileTags.push('routes');
          break;
        case 'directive':
          fileTags.push('directive');
          break;
      }
    });
  }
  return fileTags;
};

function base64Image(src) {
  var data = fs.readFileSync(src).toString('base64');
  return util.format('data:%s;base64,%s', mime.lookup(src), data);
}

function extraTypes(filepath) {
  if (filepath.indexOf('.') !== -1) {
    var extensionStart = filepath.lastIndexOf('.') + 1;
    var fileExtension = filepath.substring(extensionStart, filepath.length);
    var mime;

    switch (fileExtension) {
      case 'nsi':
        mime = 'nsis';
        break;
      default:
        mime = fileExtension;
    }

    return 'application/' + mime;
  } else {
    return undefined;
  }
}

function converterToBase64(pic) { // fn BLOB => Binary => Base64 ?
  return 'data:' + pic.mime + ';base64,' + base64.encode(pic.data);
};

module.exports = fileService;
