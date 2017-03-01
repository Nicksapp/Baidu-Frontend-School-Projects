/*
  探究早期Vue.js动态数据绑定技术原理
*/

// 创建观察者构造函数
function Observer(data) {
  this.data = data;
  this.walk(data);
}

let p = Observer.prototype;

p.walk = function (obj) {
  let val;
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      val = obj[key];

      if (typeof val === 'object') {
        new Observer(val);
      }

      this.convert(key, val);
    }
  }
}

p.convert = function (key, val) {
  Object.defineProperty(this.data, key, {
    enumerable: true,
    configurable: true,
    get: function () {
      console.log('你访问了' + key);
      return val;
    },
    set: function (newVal) {
      console.log('你设置了' + key);
      console.log('新的' + key + ' = ' + newVal);
      if (newVal === val) {
        return;
      }
      val = newVal;
    }
  })
}

let data = {
  user: {
    name: "张三",
    age: "33"
  },
  address: {
    city: "沈阳"
  }
}

let app = new Observer(data);
