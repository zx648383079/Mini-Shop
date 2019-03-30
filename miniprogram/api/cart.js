"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("../utils/http");
exports.getCart = function (params) { return http_1.fetch('shop/cart', params); };
exports.addGoods = function (goods, amount, properties) {
    if (amount === void 0) { amount = 1; }
    if (properties === void 0) { properties = []; }
    return http_1.post('shop/cart/add', {
        goods: goods,
        amount: amount,
        properties: properties,
    });
};
exports.updateItem = function (id, amount) {
    if (amount === void 0) { amount = 1; }
    return http_1.post('shop/cart/update', {
        id: id,
        amount: amount,
    });
};
exports.deleteItem = function (id) { return http_1.post('shop/cart/delete', {
    id: id,
}); };
exports.getPaymentList = function (goods, shipping) {
    return http_1.post('shop/cashier/payment', { goods: goods, shipping: shipping });
};
exports.getShippingList = function (goods, address, type) {
    if (type === void 0) { type = 0; }
    return http_1.post('shop/cashier/shipping', { goods: goods, address: address, type: type });
};
exports.previewOrder = function (goods, address, shipping, payment, type) {
    if (shipping === void 0) { shipping = 0; }
    if (payment === void 0) { payment = 0; }
    if (type === void 0) { type = 0; }
    return http_1.post('shop/cashier/preview', { goods: goods, address: address, shipping: shipping, payment: payment, type: type });
};
exports.checkoutOrder = function (goods, address, shipping, payment, type) {
    if (type === void 0) { type = 0; }
    return http_1.post('shop/cashier/checkout', { goods: goods, address: address, shipping: shipping, payment: payment, type: type });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNhcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMEM7QUFHN0IsUUFBQSxPQUFPLEdBQUcsVUFBQyxNQUFZLElBQUssT0FBQSxZQUFLLENBQWUsV0FBVyxFQUFFLE1BQU0sQ0FBQyxFQUF4QyxDQUF3QyxDQUFBO0FBRXBFLFFBQUEsUUFBUSxHQUFHLFVBQUMsS0FBYSxFQUFFLE1BQWtCLEVBQUUsVUFBZTtJQUFuQyx1QkFBQSxFQUFBLFVBQWtCO0lBQUUsMkJBQUEsRUFBQSxlQUFlO0lBQUssT0FBQSxXQUFJLENBQWUsZUFBZSxFQUFFO1FBQ2hILEtBQUssT0FBQTtRQUNMLE1BQU0sUUFBQTtRQUNOLFVBQVUsWUFBQTtLQUNiLENBQUM7QUFKOEUsQ0FJOUUsQ0FBQztBQUVVLFFBQUEsVUFBVSxHQUFHLFVBQUMsRUFBVSxFQUFFLE1BQWtCO0lBQWxCLHVCQUFBLEVBQUEsVUFBa0I7SUFBSyxPQUFBLFdBQUksQ0FBZSxrQkFBa0IsRUFBRTtRQUNqRyxFQUFFLElBQUE7UUFDRixNQUFNLFFBQUE7S0FDVCxDQUFDO0FBSDRELENBRzVELENBQUM7QUFFVSxRQUFBLFVBQVUsR0FBRyxVQUFDLEVBQVUsSUFBSyxPQUFBLFdBQUksQ0FBZSxrQkFBa0IsRUFBRTtJQUM3RSxFQUFFLElBQUE7Q0FDTCxDQUFDLEVBRndDLENBRXhDLENBQUM7QUFFVSxRQUFBLGNBQWMsR0FBRyxVQUFDLEtBQWdCLEVBQUUsUUFBaUI7SUFDOUQsT0FBQSxXQUFJLENBQWtCLHNCQUFzQixFQUFFLEVBQUMsS0FBSyxPQUFBLEVBQUUsUUFBUSxVQUFBLEVBQUMsQ0FBQztBQUFoRSxDQUFnRSxDQUFDO0FBQ3hELFFBQUEsZUFBZSxHQUFHLFVBQUMsS0FBNkIsRUFBRSxPQUFlLEVBQUUsSUFBZ0I7SUFBaEIscUJBQUEsRUFBQSxRQUFnQjtJQUM1RixPQUFBLFdBQUksQ0FBbUIsdUJBQXVCLEVBQUUsRUFBQyxLQUFLLE9BQUEsRUFBRSxPQUFPLFNBQUEsRUFBRSxJQUFJLE1BQUEsRUFBQyxDQUFDO0FBQXZFLENBQXVFLENBQUM7QUFFL0QsUUFBQSxZQUFZLEdBQUcsVUFBQyxLQUE2QixFQUM5QixPQUFlLEVBQUUsUUFBb0IsRUFBRSxPQUFtQixFQUFFLElBQWdCO0lBQTNELHlCQUFBLEVBQUEsWUFBb0I7SUFBRSx3QkFBQSxFQUFBLFdBQW1CO0lBQUUscUJBQUEsRUFBQSxRQUFnQjtJQUNwRyxPQUFBLFdBQUksQ0FBUyxzQkFBc0IsRUFBRSxFQUFDLEtBQUssT0FBQSxFQUFFLE9BQU8sU0FBQSxFQUFFLFFBQVEsVUFBQSxFQUFFLE9BQU8sU0FBQSxFQUFFLElBQUksTUFBQSxFQUFDLENBQUM7QUFBL0UsQ0FBK0UsQ0FBQztBQUV2RSxRQUFBLGFBQWEsR0FBRyxVQUFDLEtBQTZCLEVBQzNCLE9BQWUsRUFBRSxRQUFnQixFQUFFLE9BQWUsRUFBRSxJQUFnQjtJQUFoQixxQkFBQSxFQUFBLFFBQWdCO0lBQ2hHLE9BQUEsV0FBSSxDQUFTLHVCQUF1QixFQUFFLEVBQUMsS0FBSyxPQUFBLEVBQUUsT0FBTyxTQUFBLEVBQUUsUUFBUSxVQUFBLEVBQUUsT0FBTyxTQUFBLEVBQUUsSUFBSSxNQUFBLEVBQUMsQ0FBQztBQUFoRixDQUFnRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtmZXRjaCwgcG9zdH0gZnJvbSAnLi4vdXRpbHMvaHR0cCc7XHJcbmltcG9ydCB7IElEYXRhLCBJQ2FydCwgSVBheW1lbnQsIElTaGlwcGluZywgSUNhcnRJdGVtLCBJT3JkZXIgfSBmcm9tICcuL21vZGVsJztcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRDYXJ0ID0gKHBhcmFtcz86IGFueSkgPT4gZmV0Y2g8SURhdGE8SUNhcnQ+Pignc2hvcC9jYXJ0JywgcGFyYW1zKVxyXG5cclxuZXhwb3J0IGNvbnN0IGFkZEdvb2RzID0gKGdvb2RzOiBudW1iZXIsIGFtb3VudDogbnVtYmVyID0gMSwgcHJvcGVydGllcyA9IFtdKSA9PiBwb3N0PElEYXRhPElDYXJ0Pj4oJ3Nob3AvY2FydC9hZGQnLCB7XHJcbiAgICBnb29kcyxcclxuICAgIGFtb3VudCxcclxuICAgIHByb3BlcnRpZXMsXHJcbn0pO1xyXG5cclxuZXhwb3J0IGNvbnN0IHVwZGF0ZUl0ZW0gPSAoaWQ6IG51bWJlciwgYW1vdW50OiBudW1iZXIgPSAxKSA9PiBwb3N0PElEYXRhPElDYXJ0Pj4oJ3Nob3AvY2FydC91cGRhdGUnLCB7XHJcbiAgICBpZCxcclxuICAgIGFtb3VudCxcclxufSk7XHJcblxyXG5leHBvcnQgY29uc3QgZGVsZXRlSXRlbSA9IChpZDogbnVtYmVyKSA9PiBwb3N0PElEYXRhPElDYXJ0Pj4oJ3Nob3AvY2FydC9kZWxldGUnLCB7XHJcbiAgICBpZCxcclxufSk7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0UGF5bWVudExpc3QgPSAoZ29vZHM/OiBudW1iZXJbXSwgc2hpcHBpbmc/OiBudW1iZXIpID0+XHJcbiAgICBwb3N0PElEYXRhPElQYXltZW50Pj4oJ3Nob3AvY2FzaGllci9wYXltZW50Jywge2dvb2RzLCBzaGlwcGluZ30pO1xyXG5leHBvcnQgY29uc3QgZ2V0U2hpcHBpbmdMaXN0ID0gKGdvb2RzOiBudW1iZXJbXSB8IElDYXJ0SXRlbVtdLCBhZGRyZXNzOiBudW1iZXIsIHR5cGU6IG51bWJlciA9IDApID0+XHJcbiAgICBwb3N0PElEYXRhPElTaGlwcGluZz4+KCdzaG9wL2Nhc2hpZXIvc2hpcHBpbmcnLCB7Z29vZHMsIGFkZHJlc3MsIHR5cGV9KTtcclxuXHJcbmV4cG9ydCBjb25zdCBwcmV2aWV3T3JkZXIgPSAoZ29vZHM6IG51bWJlcltdIHwgSUNhcnRJdGVtW10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRyZXNzOiBudW1iZXIsIHNoaXBwaW5nOiBudW1iZXIgPSAwLCBwYXltZW50OiBudW1iZXIgPSAwLCB0eXBlOiBudW1iZXIgPSAwKSA9PlxyXG4gICAgcG9zdDxJT3JkZXI+KCdzaG9wL2Nhc2hpZXIvcHJldmlldycsIHtnb29kcywgYWRkcmVzcywgc2hpcHBpbmcsIHBheW1lbnQsIHR5cGV9KTtcclxuXHJcbmV4cG9ydCBjb25zdCBjaGVja291dE9yZGVyID0gKGdvb2RzOiBudW1iZXJbXSB8IElDYXJ0SXRlbVtdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZHJlc3M6IG51bWJlciwgc2hpcHBpbmc6IG51bWJlciwgcGF5bWVudDogbnVtYmVyLCB0eXBlOiBudW1iZXIgPSAwKSA9PlxyXG4gICAgcG9zdDxJT3JkZXI+KCdzaG9wL2Nhc2hpZXIvY2hlY2tvdXQnLCB7Z29vZHMsIGFkZHJlc3MsIHNoaXBwaW5nLCBwYXltZW50LCB0eXBlfSk7XHJcbiJdfQ==