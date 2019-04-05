'use strict';

var Transform = require('readable-stream/transform');
var fs = require('fs');

module.exports = function (tag) {
    return new Transform({
        objectMode: true,
        transform: function (file, enc, callback) {
            if (file.isNull()) {
                return callback();
            }
            function isLang(attr, lang) {
                if (lang === 'tpl') {
                    return true;
                }
                if (tag === 'js' || tag === 'css') {
                    return !/lang=["']?\w+/.test(attr);
                }
                if (tag === 'sass') {
                    return /lang=["']?s[ac]ss/.test(attr);
                }
                return new RegExp('lang=["\']?'+lang).test(attr);
            }
            function doReplace() {
                if (!file.isBuffer()) {
                    return callback();
                }
                if (tag === 'json') {
                    var path = file.path.replace(file.extname, '.json');
                    var data = {};
                    if (fs.existsSync(path)) {
                        data = JSON.parse(fs.readFileSync(path).toString());
                    }
                    var str = require('./dist/parser.js').parseJson(String(file.contents), data);
                    if (!str) {
                        return callback();
                    }
                    file.contents = Buffer.from(str);
                    return callback(null, file);
                }
                if (file.extname === '.ts') {
                    if (tag !== 'ts') {
                        return callback(null, file);
                    }
                    if (!/(pages|components)/.test(file.path)) {
                        return callback(null, file);
                    }
                    file.contents = Buffer.from(require('./dist/parser.js').parsePage(String(file.contents)));
                    return callback(null, file);
                }
                var html = String(file.contents);
                var maps = {
                    js: '<script([\\s\\S]*?)>([\\s\\S]+?)</script>',
                    tpl: '<template([\\s\\S]*?)>([\\s\\S]+?)</template>',
                    css: '<style([\\s\\S]*?)>([\\s\\S]+?)</style>',
                    sass: '<style([\\s\\S]*?)>([\\s\\S]+?)</style>',
                    ts: '<script([\\s\\S]*?)>([\\s\\S]+?)</script>',
                };
                if (!maps.hasOwnProperty(tag)) {
                    return callback({stack: 'error ' + tag}, file);
                }
                var reg = new RegExp(maps[tag], 'gi');
                var result;
                var str = '';
                while ((result = reg.exec(html)) !== null) {
                    // 支持wxml子模版
                    if (tag === 'tpl' && result[1].indexOf('name=') > 0) {
                        str += result[0];
                        continue;
                    }
                    if (isLang(result[1], tag)) {
                        str += result[2];
                    }
                }
                if (tag === 'tpl') {
                    str = require('./dist/parser.js').htmlToWxml(str);
                } else if (tag === 'ts') {
                    str = require('./dist/parser.js').parsePage(str);
                }
                file.contents = Buffer.from(str);
                return callback(null, file);
            }
            doReplace();
        }
    });
};