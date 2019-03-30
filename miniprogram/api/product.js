"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("../utils/http");
exports.getList = function (params) { return http_1.fetch('shop/goods', params); };
exports.getInfo = function (id) { return http_1.fetch('shop/goods', {
    id: id,
}); };
exports.getRecommend = function (id) { return http_1.fetch('shop/goods/recommend', {
    id: id,
}); };
exports.getHome = function () { return http_1.fetch('shop/goods/home'); };
exports.getHotKeywords = function () { return http_1.fetch('shop/search/keywords'); };
exports.getTips = function (keywords) { return http_1.fetch('shop/search/tips', {
    keywords: keywords,
}); };
exports.getSubtotal = function () { return http_1.fetch('shop/goods/count'); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInByb2R1Y3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBbUM7QUFHdEIsUUFBQSxPQUFPLEdBQUcsVUFBQyxNQUFXLElBQUssT0FBQSxZQUFLLENBQWtCLFlBQVksRUFBRSxNQUFNLENBQUMsRUFBNUMsQ0FBNEMsQ0FBQztBQUV4RSxRQUFBLE9BQU8sR0FBRyxVQUFDLEVBQVUsSUFBSyxPQUFBLFlBQUssQ0FBVyxZQUFZLEVBQUU7SUFDakUsRUFBRSxJQUFBO0NBQ0wsQ0FBQyxFQUZxQyxDQUVyQyxDQUFDO0FBRVUsUUFBQSxZQUFZLEdBQUcsVUFBQyxFQUFVLElBQUssT0FBQSxZQUFLLENBQWtCLHNCQUFzQixFQUFFO0lBQ3ZGLEVBQUUsSUFBQTtDQUNMLENBQUMsRUFGMEMsQ0FFMUMsQ0FBQztBQUVVLFFBQUEsT0FBTyxHQUFHLGNBQU0sT0FBQSxZQUFLLENBQWUsaUJBQWlCLENBQUMsRUFBdEMsQ0FBc0MsQ0FBQztBQUV2RCxRQUFBLGNBQWMsR0FBRyxjQUFNLE9BQUEsWUFBSyxDQUFnQixzQkFBc0IsQ0FBQyxFQUE1QyxDQUE0QyxDQUFDO0FBRXBFLFFBQUEsT0FBTyxHQUFHLFVBQUMsUUFBZ0IsSUFBSyxPQUFBLFlBQUssQ0FBZ0Isa0JBQWtCLEVBQUU7SUFDbEYsUUFBUSxVQUFBO0NBQ1gsQ0FBQyxFQUYyQyxDQUUzQyxDQUFDO0FBRVUsUUFBQSxXQUFXLEdBQUcsY0FBTSxPQUFBLFlBQUssQ0FBWSxrQkFBa0IsQ0FBQyxFQUFwQyxDQUFvQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtmZXRjaH0gZnJvbSAnLi4vdXRpbHMvaHR0cCdcclxuaW1wb3J0IHsgSVBhZ2UsIElQcm9kdWN0LCBJSG9tZVByb2R1Y3QsIElEYXRhLCBJU3VidG90YWwgfSBmcm9tICcuL21vZGVsJztcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRMaXN0ID0gKHBhcmFtczogYW55KSA9PiBmZXRjaDxJUGFnZTxJUHJvZHVjdD4+KCdzaG9wL2dvb2RzJywgcGFyYW1zKTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRJbmZvID0gKGlkOiBudW1iZXIpID0+IGZldGNoPElQcm9kdWN0Pignc2hvcC9nb29kcycsIHtcclxuICAgIGlkLFxyXG59KTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRSZWNvbW1lbmQgPSAoaWQ6IG51bWJlcikgPT4gZmV0Y2g8SURhdGE8SVByb2R1Y3Q+Pignc2hvcC9nb29kcy9yZWNvbW1lbmQnLCB7XHJcbiAgICBpZCxcclxufSk7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0SG9tZSA9ICgpID0+IGZldGNoPElIb21lUHJvZHVjdD4oJ3Nob3AvZ29vZHMvaG9tZScpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldEhvdEtleXdvcmRzID0gKCkgPT4gZmV0Y2g8SURhdGE8c3RyaW5nPj4oJ3Nob3Avc2VhcmNoL2tleXdvcmRzJyk7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0VGlwcyA9IChrZXl3b3Jkczogc3RyaW5nKSA9PiBmZXRjaDxJRGF0YTxzdHJpbmc+Pignc2hvcC9zZWFyY2gvdGlwcycsIHtcclxuICAgIGtleXdvcmRzLFxyXG59KTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRTdWJ0b3RhbCA9ICgpID0+IGZldGNoPElTdWJ0b3RhbD4oJ3Nob3AvZ29vZHMvY291bnQnKTtcclxuIl19