var console = process.console,
    dirTree = require('directory-tree'),
    fs = require('fs'),
    path = require("path");

var fileService = {};

fileService.get = function(req, res) {
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
};

fileService.put = function(req, res) {
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
};

fileService.delete = function(req, res) {
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
};

fileService.putExtraArg = function(req, res) {
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

};

module.exports = fileService;
