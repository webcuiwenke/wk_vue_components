var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class EventBus {
  constructor() {
    __publicField(this, "events");
    this.events = {};
  }
  // 订阅事件
  $on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }
  // 发布事件
  $emit(eventName, data) {
    const callbacks = this.events[eventName];
    if (!callbacks) {
      return;
    }
    callbacks.forEach((callback) => {
      callback(data);
    });
  }
  // 取消订阅事件
  $off(eventName, callback) {
    const callbacks = this.events[eventName];
    if (!callbacks) {
      return;
    }
    if (callback) {
      this.events[eventName] = callbacks.filter((cb) => cb !== callback);
    } else {
      delete this.events[eventName];
    }
  }
}
export {
  EventBus as default
};
