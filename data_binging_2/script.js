// // var proxy = new Proxy(target, handler);// target表示所要拦截的目标对象，handler用来定制拦截行为
//
// function Observer(data) {
//   return new Proxy(data, {
//     get: function(target, key) {
//       if (key in target) {
//         console.log('你访问了' + key);
//         return target[key];
//       } else {
//         throw new Error('key does not exist')
//       }
//     },
//     set: function(target, key, newVal) {
//       console.log('你设置了' + key);
//       console.log('新的' + key + ' = ' + newVal);
//       target[key] = newVal;
//     }
//   })
// }
//
// let app = new Observer({
//   name: 'nick',
//   company: 'apple',
//   address: 'NewYork'
// })

// 实现一个监听事件
function Event() {
  this.events = {}
}
Event.prototype.on = function(attr, callback) {
  if (this.events[attr]) {
    this.events[attr].push(callback);
  } else {
    this.events[attr] = [callback];
  }
}
Event.prototype.off = function(attr) {
  for (let key in this.events) {
    if (this.events.hasOwnProperty(key) && key === attr) {
      delete this.events[key];
    }
  }
}
Event.prototype.emit = function(attr, ...arg) {
  this.events[attr] && this.events[attr].forEach(function(item) {
    item(...arg);
  })
}

function Observer (data) {
  this.data = data;
  this.makeObserver(data);
  this.eventsBus = new Event();
}
Observer.prototype.setterAndGetter = function (key, val) {
  let self = this;
  Object.defineProperty(this.data, key, {
    enumerable: true,
    configurable: true,
    get: function(){
      console.log('你访问了 '+ key);
      return val;
    },
    set: function(newVal) {
      console.log('你设置了 ' + key);
      console.log('新的 ' + key + ' = ' + newVal);
      // 出发$watch
      self.eventsBus.emit(key, val, newVal);
      val = newVal;
      if (typeof newVal === 'object') {
        new Observer(val);
      }
    }
  })
};

Observer.prototype.makeObserver = function(obj) {
  let val;
  for(let key in obj) {
    if (obj.hasOwnProperty(key)) {
      val = obj[key];

      if (typeof val === 'object') {
        new Observer(val);
      }
    }
    this.setterAndGetter(key, val);
  }
}

Observer.prototype.$watch = function (attr, callback) {
  this.eventsBus.on(attr, callback);
}
let app = new Observer({
  basicInfo: {
    name: 'nick',
    age: 12
  },
  name: 'youngwind',
  age: 25,
  company: 'apple',
  address: 'China'
})
app.$watch('name', function(oldVal, newVal) {
  console.log(`name has changed! From ${oldVal} to ${newVal}`);
})
app.$watch('age', function(oldVal, newVal) {
  console.log(`age has changed! From ${oldVal} to ${newVal}`);
})
app.$watch('company', function(oldVal, newVal) {
  console.log(`company has changed! From ${oldVal} to ${newVal}`);
})
app.$watch('address', function(oldVal, newVal) {
  console.log(`address has changed! From ${oldVal} to ${newVal}`);
})
