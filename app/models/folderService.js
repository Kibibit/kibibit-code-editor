var console = process.console,
    dirTree = require('directory-tree'),
    fs = require('fs'),
    path = require("path");

var folderService = {};

folderService.get = function(req, res) {
    var directoryFullPath = req.params.dir_id;
    try {
        var tree = dirTree.directoryTree(directoryFullPath);
        res.json(tree);
        console.time().tag('DIRECTORY CONTENT').info('directory requested: ' + directoryFullPath);
    } catch (err) {
        res.json(err);
        console.time().tag('DIRECTORY CONTENT').error('directory requested not found: ' + directoryFullPath);
    }

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
            console.time().tag('DIRECTORY CONTENT').info('directory created: ' + directoryFullPath);
        }
    });
};

folderService.delete = function(req, res) {
    var directoryFullPath = req.params.dir_id;
    fs.rmdir(directoryFullPath, function(err) {
        if (err && err.code == "ENOTEMPTY") {
            // couldn't delete file
            console.error(err);
        }
    });
    res.json(directoryFullPath);
    console.time().tag('DIRECTORY CONTENT').info('directory deleted: ' + directoryFullPath);
};

folderService.putExtraArg = function(req, res) {
    var directoryFullPath = req.params.dir_id;
    var newDirectoryFullPath = req.params.extra_arg;
    fs.rename(directoryFullPath, newDirectoryFullPath, function(err) {
        if (err) {
            res.json(err);
        } else {
            console.time().tag('DIRECTORY RENAME').info('directory renamed from: ' + directoryFullPath + '; to: ' + newDirectoryFullPath);
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

            if (filename == "." || filename == "..") {
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
        if (isHardDelete === "true") {
            rmdir(directoryFullPath);
            res.json({
                message: 'Directory deleted (recursively) successfully'
            });
            console.time().tag('DIRECTORY DELETED').info('directory deleted (recursively) successfully: ' + directoryFullPath);
        } else {
            res.json({
                message: 'For a hard delete, 2nd param should be: True'
            });
        }
    } catch (err) {
        res.json(err);
        console.time().tag('DIRECTORY DELETED').error('directory wasn\'t found: ' + directoryFullPath);
    }

};

module.exports = folderService;
