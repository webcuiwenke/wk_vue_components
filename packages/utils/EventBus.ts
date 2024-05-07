class EventBus {

  private events: { [key: string]: Array<Function> };


  constructor() {

    this.events = {};

  }


  // 订阅事件

  $on(eventName: string, callback: Function): void {

    if (!this.events[eventName]) {

      this.events[eventName] = [];

    }

    this.events[eventName].push(callback);

  }


  // 发布事件

  $emit(eventName: string, data?: any): void {

    const callbacks = this.events[eventName];

    if (!callbacks) {

      return;

    }

    callbacks.forEach((callback: Function) => {

      callback(data);

    });

  }


  // 取消订阅事件

  $off(eventName: string, callback?: Function): void {

    const callbacks = this.events[eventName];

    if (!callbacks) {

      return;

    }

    if (callback) {

      this.events[eventName] = callbacks.filter((cb: Function) => cb !== callback);

    } else {

      delete this.events[eventName];

    }

  }

}


export default EventBus;