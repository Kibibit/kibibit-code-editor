module.exports = function(app, express) {

    var apiRouter = express.Router(),
        console = process.console,
        dirTree = require('directory-tree'),
        fs = require('fs'),
        path = require("path"),
        explicitObjectMapper = require('explicit-object-mapper');

    apiRouter.get('/', function(req, res) {
        res.json({
            message: 'hooray! welcome to our api!'
        });
    });

    // on routes that end in /file/:file_id
    // ----------------------------------------------------
    apiRouter.route('/file/:file_id')

    // get the file content with that file_id = full file path
    .get(function(req, res) {
        var fileFullPath = req.params.file_id;
        fs.readFile(fileFullPath, 'utf8', function(err, data) {
            if (err) {
                res.json(err);
                console.time().tag('FILE CONTENT').error('file-get returned an error: ' + err);
            } else {
                res.json(data);
                console.time().tag('FILE CONTENT').info('file requested: ' + fileFullPath);
            }
        });
    })

    // update the file content with this id
    .put(function(req, res) {
        var fileFullPath = req.params.file_id;
        try {
            var stat = fs.statSync(fileFullPath);
            res.json({
                "errno": "330",
                "code": "File already exists",
                "path": fileFullPath
            });
            console.time().tag('FILE CONTENT').error('file couldn\'t be saved: ' + fileFullPath);
        } catch (err) {
            if (req.body.newContent) {
                fs.writeFile(fileFullPath, req.body.newContent, 'utf8', function(err) {
                    if (err) {
                        res.json(err);
                        console.time().tag('FILE CONTENT').error('file couldn\'t be saved: ' + err);
                    } else {
                        res.json({
                            message: 'file saved successfully'
                        });
                        console.time().tag('FILE CONTENT').info('file saved: ' + fileFullPath);
                    }
                });
            }
        }
    })

    // delete the file content with this id
    .delete(function(req, res) {
        var fileFullPath = req.params.file_id;
        try {
            // rm fiilename
            fs.unlinkSync(fileFullPath);
            res.json({
                message: 'file deleted successfully'
            });
            console.time().tag('DELETE CONTENT').info('file deleted: ' + fileFullPath);
        } catch (err) {
            res.json(err);
            console.time().tag('DELETE CONTENT').error('couldn\'t delete file: ' + fileFullPath);
        }
    });

    // on routes that end in /file/:file_id
    // ----------------------------------------------------
    apiRouter.route('/file/:file_id/:extra_arg')

    // delete the file content with this id
    .put(function(req, res) {
        var fileFullPath = req.params.file_id;
        var isHardSave = req.params.extra_arg;
        if (isHardSave === "true") {
            if (req.body.newContent || 0 === req.body.newContent.length) {
                fs.writeFile(fileFullPath, req.body.newContent, 'utf8', function(err) {
                    if (err) {
                        res.json(err);
                        console.time().tag('FILE CONTENT').error('file couldn\'t be saved: ' + err);
                    } else {
                        res.json({
                            message: 'file saved successfully'
                        });
                        console.time().tag('FILE CONTENT').info('file saved: ' + fileFullPath);
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

    });


    // on routes that end in /directory/:dir_id
    // ----------------------------------------------------
    apiRouter.route('/directory/:dir_id')

    // get the directory content with that directory_id = full file path
    .get(function(req, res) {
        var directoryFullPath = req.params.dir_id;
        try {
            var tree = dirTree.directoryTree(directoryFullPath);
            res.json(tree);
            console.time().tag('DIRECTORY CONTENT').info('directory requested: ' + directoryFullPath);
        } catch (err) {
            res.json(err);
            console.time().tag('DIRECTORY CONTENT').error('directory requested not found: ' + directoryFullPath);
        }

    })

    // create a new directory with the dir_id
    .put(function(req, res) {
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
    })

    // delete the directory content with this id
    .delete(function(req, res) {
        var directoryFullPath = req.params.dir_id;
        fs.rmdir(directoryFullPath, function(err) {
            if (err && err.code == "ENOTEMPTY") {
                // couldn't delete file
                console.error(err);
            }
        });
        res.json(directoryFullPath);
        console.time().tag('DIRECTORY CONTENT').info('directory deleted: ' + directoryFullPath);
    });

    // on routes that end in /directory/:dir_id/:dir_id
    // ----------------------------------------------------
    apiRouter.route('/directory/:dir_id/:extra_arg')

    // rename directory
    .put(function(req, res) {
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
    })

    // hard delete the directory content with this id. This means all the files inside are deleted recursively
    .delete(function(req, res) {
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

    });

    return apiRouter;
};
