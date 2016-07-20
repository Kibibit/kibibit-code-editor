var fs = require('fs'),
    path = require('path'),
    fileService = require('./fileService.js');
var console = require('./consoleService')
  ('DIRECTORY CONTENT', ['green', 'inverse']);

var folderService = {};

folderService.get = function(req, res) {
  var output = {};
  var directoryFullPath = req.params.dir_id;
  fs.readdir(directoryFullPath, function(err, items) {
    try {
      output.path = directoryFullPath;
      output.name = directoryFullPath.split(/\/|\\/).reverse()[0];
      output.type = 'directory';
      output.children = [];

      for (var i = 0; i < items.length; i++) {
        if (fs.lstatSync(directoryFullPath +
                          '/' + items[i]).isDirectory()) {
          output.children.push({
            name: items[i],
            path: directoryFullPath + '/' + items[i],
            type: 'directory',
            children: []
          });
        } else {
          output.children.push({
            name: items[i],
            path: directoryFullPath + '/' + items[i],
            tags: fileService.getFileTags(directoryFullPath + '/' + items[i]),
            type: folderService.getFileExtension(items[i])
          });
        }
      }
      output.children.sort(compare);
      console.info('directory requested and sent: ' + directoryFullPath);
      res.json(output);
    } catch (error) {
      res.json(error);
      console.error('directory requested not found: ' + directoryFullPath);
    }
  });

  function compare(a, b) {
    if (a.type === 'directory') {
      if (b.type === 'directory') {
        if (a.name < b.name) {
          return -1;
        } else if (a.name > b.name) {
          return 1;
        } else {
          return 0;
        }
      } else {
        return -1;
      }
    } else {
      if (b.type === 'directory') {
        return 1;
      } else {
        if (a.name < b.name) {
          return -1;
        } else if (a.name > b.name) {
          return 1;
        } else {
          return 0;
        }
      }
    }
  }
};

folderService.getFileExtension = function(filename) {
  var a = filename.split('.');
  if (a.length === 1 || (a[0] === '' && a.length === 2)) {
    return '';
  }
  return a.pop().toLowerCase();
};

folderService.put = function(req, res) {
  var directoryFullPath = req.params.dir_id;
  fs.mkdir(directoryFullPath, function(err) {
    if (err) {
      res.json(err);
    } else {
      res.json({
        message: 'Folder created successfully'
      });
      console.info('directory created: ' + directoryFullPath);
    }
  });
};

folderService.delete = function(req, res) {
  var directoryFullPath = req.params.dir_id;
  fs.rmdir(directoryFullPath, function(err) {
    if (err && err.code == 'ENOTEMPTY') {
      // couldn't delete file
      console.error(err);
    }
  });
  res.json(directoryFullPath);
  console.info('directory deleted: ' + directoryFullPath);
};

folderService.putExtraArg = function(req, res) {
  var directoryFullPath = req.params.dir_id;
  var newDirectoryFullPath = req.params.extra_arg;
  fs.rename(directoryFullPath, newDirectoryFullPath, function(err) {
    if (err) {
      res.json(err);
    } else {
      console.info('directory renamed from: ' +
              directoryFullPath +
              '; to: ' +
              newDirectoryFullPath);
      res.json({
        message: 'Folder renamed successfully'
      });
    }
  });
};

folderService.deleteExtraArg = function(req, res) {
  var directoryFullPath = req.params.dir_id;
  var isHardDelete = req.params.extra_arg;
  var rmdir = function(dir) {
    var list = fs.readdirSync(dir);
    for (var i = 0; i < list.length; i++) {
      var filename = path.join(dir, list[i]);
      var stat = fs.statSync(filename);

      if (filename == '.' || filename == '..') {
          // pass these files
      } else if (stat.isDirectory()) {
        // rmdir recursively
        rmdir(filename);
      } else {
        // rm fiilename
        fs.unlinkSync(filename);
      }
    }
    fs.rmdirSync(dir);
  };

  try {
    if (isHardDelete === 'true') {
      rmdir(directoryFullPath);
      res.json({
        message: 'Directory deleted (recursively) successfully'
      });
      console.info('directory deleted (recursively) successfully: ' +
              directoryFullPath);
    } else {
      res.json({
        message: 'For a hard delete, 2nd param should be: True'
      });
    }
  } catch (err) {
    res.json(err);
    console.error('directory wasn\'t found: ' + directoryFullPath);
  }

};

module.exports = folderService;
