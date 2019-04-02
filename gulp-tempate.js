'use strict';

var Transform = require('readable-stream/transform');

module.exports = function (tag) {
    return new Transform({
        objectMode: true,
        transform: function (file, enc, callback) {
            if (file.isNull()) {
                return callback(null, file);
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
                    return callback({stack: 'error file'}, file);
                }
                var html = String(file.contents);
                var maps = {
                    js: '<script([\\s\\S]*?)>([\\s\\S]+)</script>',
                    tpl: '<template([\\s\\S]*?)>([\\s\\S]+)</template>',
                    css: '<style([\\s\\S]*?)>([\\s\\S]+)</style>',
                    sass: '<style([\\s\\S]*?)>([\\s\\S]+)</style>',
                    ts: '<script([\\s\\S]*?)>([\\s\\S]+)</script>',
                };
                if (!maps.hasOwnProperty(tag)) {
                    return callback({stack: 'error ' + tag}, file);
                }
                var reg = new RegExp(maps[tag], 'gi');
                var result;
                var str = '';
                while ((result = reg.exec(html)) !== null) {
                    // 支持wxml子模版
                    if (tag === 'tpl' && result[1].indexOf('name') > 0) {
                        str += result[0];
                        continue;
                    }
                    if (isLang(result[1], tag)) {
                        str += result[2];
                    }
                }
                if (tag === 'tpl') {
                    str = require('./dist/parser.js').htmlToWxml(str);
                }
                file.contents = Buffer.from(str);
                return callback(null, file);
            }
            doReplace();
        }
    });
};