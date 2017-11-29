# node.js开发指南读书笔记


参考资料：
- [W3CSchool](http://www.w3school.com.cn/js/)
- [Mozilla JavaScript指南](http://developer.mozilla.org/en/JavaScript/Guide)
- [本书源代码](http://www.byvoid.com/project/node)
- [NodeJS官方文档API](http://nodejs.org/api/)
- [CNodeJS 社区](http://cnodejs.org/)

## 第一章

### 什么是Node.js

Nodejs中使用的JS主要是CoreJS的部分，不包括浏览器特性的部分。它实现了诸如文件系统、模块、包、操作系统 API、网络通信等Core JavaScript没有或者不完善的功能。

Node.js不运行在浏览器中，所以也就不存在JavaScript的浏览器兼容性问题，你可以放心地使用JavaScript语言的所有特性。

Node.js 最大的特点就是采用异步式 I/O 与事件驱动的架构设计。避免了同步式、多线程带来的频繁上下文切换。

### CommonJS规范

CommonJS 的终极目标是制定一个像 C++ 标准库一样的规范，使得基于CommonJS API的应用程序可以在不同的环境下运行，就像用 C++ 编写的应用程序可以使用不同的编译器和运行时函数库一样。为了 保持中立，CommonJS不参与标准库实现，其实现交给像Node.js之类的项目来完成。图1-5 是 CommonJS 的各种实现。（包括NodeJS）

CommonJS 规范包括了模块(modules)、包(packages)、系统(system)、二进制(binary)、 控制台(console)、编码(encodings)、文件系统(filesystems)、套接字(sockets)、单元测 试(unit testing)等部分。

## 第二章

Node.js 与 Windows 的兼容性不如 POSIX 操作系统，这一点在 npm 提 供的第三方模块中体现得尤为突出。这主要是因为许多第三方的模块需要编译原生的 C/C++代码，其中编译框架和系统调用很多都是以 Linux 为范本的，与 Windows 不兼容。笔者不建 议在 Windows 上进行 Node.js 开发或部署，当然出于学习目的，这些影响也是无关紧要的。

### 多版本管理器

[多版本管理器：n（不支持windows）](https://github.com/visionmedia/n)

具体安装及使用方法见下：

`npm install -g n`

`n --help`可以看到使用说明。

运行`n (版本号)`可以安装任意已发布的nodejs，若版本已经安装，则是切换至此版本。

运行`n`可以列出所有已安装版本的nodejs 带有“*”的是默认版本。

若不想切换默认使用版本，`n use (版本号) script.js`也可以直接指定使用的nodejs实例版本。

>  n 无法管理通过其他方式安装的 Node.js 版本实例(如官方提供的安装 包、发行版软件源、手动编译)，你必须通过 n 安装 Node.js 才能管理多版 本的 Node.js。

## 第三章

快速入门篇

### nodejs命令行工具

`node -e "console.log("Hello world!");"`可以将要执行的语句作为`node -e`的参数直接执行。

`node`则可以进入REPL模式（Read-eval-print loop）可以测试一个包能 否正常使用，单独调用应用的某一个模块，执行简单的计算等。

### 建立HTTP服务器

app.js:
```
var http = require('http');

http.createServer(function(req, res){
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write('<h1>Node.js</h1>');
	res.end('<p>Hello World</p>');
}).listen(3000);
console.log("HTTP server is listening at port 3000...");
```

`listen`函数创建了事件监听器，使得进程不会退出事件循环。

> 关于nodejs不便于调试（第一次引用到某部份时才会去解析脚 本文件，以后都会直接访问内存，避免重复载入）的方面，可以使用supervisor。安装：`sudo npm install -g supervisor` 使用：`supervisor app.js` 当代码被改动时，运行的脚本会终止并被重新启动。

### 异步式I/O与事件式编程

为了处理异步式I/O，线程必须有事件循环来检查有没有未处理的事件。

> 异步式 I/O 就是少了多线程的开销。对操作系统来说，创建一个线程的代价是十分昂贵的， 需要给它分配内存、列入调度，同时在线程切换的时候还要执行内存换页，CPU 的缓存被 清空，切换回来的时候还要重新从内存中读取信息，破坏了数据的局部性。

### 回调函数

```
var fs = require('fs');
fs.readFile('file.txt', 'utf-8', function(err, data) {
    if (err) { 
        console.error(err);
    } else { 
        console.log(data);
    } 
});
console.log('end.');
```
运行结果：
```
 end.
Contents of the file.
```

> fs.readFile 调用时所做的工作只是将异步式 I/O 请求发送给了操作系统，然后立即 返回并执行后面的语句，执行完以后进入事件循环监听事件。当 fs 接收到 I/O 请求完成的 事件时，事件循环会主动调用回调函数以完成后续工作。因此我们会先看到 end.，再看到 file.txt 文件的内容。

### 事件

Node.js的事件循环对开发者不可见，由libev库实现。libev支持多种类型的事件，如 ev_io、ev_timer、ev_signal、ev_idle 等，在 Node.js 中均被 EventEmitter 封装。libev 事件循环的每一次迭代，在 Node.js 中就是一次 Tick，libev 不 断检查是否有活动的、可供检测的事件监听器，直到检测不到时才退出事件循环，进程结束。

### 模块

`module.js`:

```
var name;

exports.setName = function(thyName){
     name = thyName;
};

exports.sayHello = function() {
    console.log('Hello' + name);
};
```

`getmodule.js`:

```
var myModule = require('./module');
myModule.setName('Charlotte');
myModule.sayHello();
```

模块是单次加载的，后调用`require`获得的模块将覆盖掉先调用`require`获得的模块的对象的结果。

以下是可以稍微简化模块调用的方法：

简化前：
```
// singleobject.js
function Hello(){

    this.setName = function(){
        // ...
    }

    this.sayHello = function(){
        // ...
    }
}

exports.Hello = Hello;
```
调用方法：`require('./singleobject').Hello;`

简化后：
```
// hello.js
function Hello(){

    this.setName = function(){
        // ...
    }

    this.sayHello = function(){
        // ...
    }
}

module.exports = Hello;
```

然后就可以通过`require`的方式直接获得`setName`和`sayHello`对象了。调用方法`require('./hello');`。这样的方法使接口的`exports`对象直接变成了`Hello`对象本身。

### 包

CommonJS规范包的特征（Node.js对包要求没有这么严格）：
- **package.json在包的顶层目录下。**
- 二进制文件在bin目录下。
- JavaScript代码应该在lib目录下。
- 文档在doc目录下。
- 单元测试（Unit Test）在test目录下。

以下内容关于如何将文件夹作为一个模块：
关键是将入口文件命名为index.js
```
// somepackage/index.js

exports.hello = function(){
    console.log('Hello.');
};;
```

```
// ../../getpackage.js

var somePackage = require('./somepackage');

somePackage.hello();
```

若不将入口文件命名为`index.js`，也可以在文件夹下创建`package.json`文件并将文件命名为`interface.js`并放置于`lib`文件夹内：

```
{
    "main": "./lib/interface.js"
}
```

完整书内有package.json的内容规范。

`npm link`：使原本不可以在项目中通过`require`调用的全局安装的包可以直接在项目中使用。也支持将本地包链接到全局（在包目录中运行`npm link`命令）。
```
npm link express
./node_modules/express -> /usr/local/lib/node_modules/express
```

书上第44页有如何发布（`publish`）包。

### 调试

包含远程调试、Eclipse、node-inspector等调试工具的使用方法，这里不赘述。

## 第四章

Node.js核心模块。包括全局对象、常用工具、事件机制、文件系统访问、HTTP服务器与客户端。

### 全局对象

`global`为全局对象（JavaScript中`window`是全局对象），常用属性包括`console`、`process`等。

#### process

> pdf第67页有`process`对象常用的成员方法，包括`process.argv`、`process.stdout`、`process.stdin`、`process.nextTick(callback)`、`process.platform`、`process.pid`、`process.execPath`、`process.memoryUsage()`。详见[详细内容](http://nodejs.org/api/process.html)

由于node适合I/O密集的应用而非计算密集的应用，所以使用`process.nextTick(callback)`有利于提高效率：
将耗时的操作拆分为两个事件，减少每个事件的执行时间，且效率比`setTimeout()`高得多。

示例；

```
function doSomething(args, callback) {
    somethingComplicated(args);
    callback();
}

doSomething(function onEnd() {
    compute();
});
```

#### console

用于向标准输出流(stdout)或标准错误流(stderr)输出字符。

> pdf的68页，方法包括`console.log`、`console.error`、`console.trace`等

### 常用工具

util是nodejs的一个核心模块，提供常用函数的集合。

`util.inherits(constructor, superConstructor)`：实现对象间原型继承的函数。（具体细节在附录A中）

`util.inherits(Sub, Base);`仅仅会继承Base在`Base.prototype`中定义的函数，构造函数内部的函数和属性都不会被继承。同时，在原型中定义的属性不会被`console.log`作为对象的属性输出。（具体示例代码见pdf的70页。）

`util.inspect(object, [showHidden], [depth], [colors])`：一个将任何对象转换为字符串的方法，常用于调试和错误输出，并不会简单地把对象转换为字符串。

> 类型测试工具：`util.isArray()`、`util.isRegExp()`、`util.isData()`、`util.isError()`。其他工具：`util.format()`、`util.debug()`。详细：[详细内容](http://nodejs.org/api/util.html)

### 事件驱动

events是nodejs最重要的模块。它通过提供`events.EventEmitter`对象封装了事件发射与事件监听器功能。（具体使用位于pdf的72页）

常用API：
- EventEmitter.on(event, listener) 注册监听器
- EventEmitter.emit(event, [arg1], [arg2], [...]) 发射event事件
- EventEmitter.once(event, listener) 注册单次监听器
- EventEmitter.removeListener(event, listener) 移除单个监听器
- EventEmitter.removeAllListeners([event]) 移除所有监听器

> 详细：[详细的API文档](http://nodejs.org/api/events.html)

error事件：

当error被发时，EventEmitter规定如果没有响应的监听器，Node.js 会把它当作异常，退出程序并打印调用栈，所以通常需要为会发射error事件的对象设置监听器。

而且通常使用EventEmitter都是通过在fs、net、http等在内的对象中继承它的方式使用，只要支持事件响应的核心模块都是EventEmitter的子类。（原因pdf的73页）

### 文件系统

`fs`模块有关于文件操作：读取、写入、更名、删除、遍历目录、链接等POSIX文件系统操作。此模块中的所有的操作都提供了异步和同步的两个版本（例如异步的`fs.readFile()`和同步的`fs.readFileSync()`）。

`fs`常用的功能(pdf的74页)，后两个更加底层，但需要手动管理缓冲区和文件指针。：
- fs.readFile(filename, [encoding], [callback(err, data)]) 读取文件
- fs,readFileSync(filename, [encoding]) 读取文件的异步版本
- fs.open(path, flags, [mode], [callback(err, fd)]) 打开文件，类似`fopen()`
- fs.read(fd, buffer, offset, length, position, [callback(err, bytesRead, buffer)]) 比readFile更底层的读取文件

> pdf的76页提供了`fs`模块的函数表。

### HTTP服务器与客户端

`http`模块封装了HTTP服务器（`http.Server`，基于事件的HTTP服务器）和简易的HTTP客户端（`http.request`，HTTP客户端工具）。

#### HTTP服务器

**`http.Server`**

所有的请求都被封装为独立的事件，它继承自`EventEmitter`，它提供了以下几个事件：
- request 

客户端请求到来时
它提供两个参数：`req`、`res`，为`http.ServerRequest`和`http.ServerResponse` 的实例，表示请求和响应信息。
- connection 

TCP连接建立时
提供一个参数`socket`，为`net.Socket`的实例。
- close 

服务器关闭时

> 除此之外还有`checkContinue`、`upgrade`、`clientError` 事件。`http`为使用`request`提供了捷径`http.createServer([requestListener])`。

**`http.ServerRequest`**

是HTTP请求的信息，通常简称为`req`。

以下三个事件用于控制请求体传输。
- data 当请求体数据到来时
- end 当请求体数据传输完成时
- close 当前请求结束时

> 属性表见pdf第80页。

**获取GET请求内容**

可以通过手动解析URL完整请求路径`?`后的部分作为GET的参数。（`url`模块中的`parse`函数提供了解析功能）解析后原始`path`被解析为一个对象，`query`就是GET请求的内容，路径事`pathname`。

> 具体操作见pdf的80页

**获取POST请求内容**

由于POST请求内容都在请求体中，而等待请求体传输十分耗时，所以默认不会解析请求体，需要时可以手动操作。简述即为使用`querystring.parse`将`req`的`data`事件监听函数中累计保存的post变量解析为POST请求格式，见pdf81页。

> 发布版本应用中不应该这样操作，存在效率和安全方面的问题。

**`http.ServerResponse`**

是返回给客户端的信息，通称`res`。

三个成员函数，用于返回响应头、相应内容、结束请求。
- response.writeHead(statusCode, [headers]) 

发送HTTP状态码（200、404）与属性对象。
- response.write(data, [encoding]) 

发送内容与编码方式（默认utf-8）。
- response.end([data], [encoding])

返回内容发送完毕时必须被调用。意义和write相同。

#### HTTP客户端

客户端向HTTP服务器发起请求的两个函数`http.request`和`http.get`。

**介绍：**

`http.request(options, callback)`

可用于发送POST请求。

options的常用参数如下：
- host
- port
- method
- path
- headers

`callback`传递一个`http.ClientResponse`的实例。`http.request`返回一个`http.ClientRequest`的实例。请求结束需要手动调用`req.end()`。

> pdf第83页有发送POST的方法

`http.get(options, callback)`

可用于发送GET请求，是`request`的简化版。请求结束不需要手动调用`req.end()`。

**`http.ClientRequest`**

是上述两个函数返回产生的对象，提供`response`事件（客户端两函数第二个参数的绑定对象之一）。除了`write`、`end`，此对象还提供以下函数：
- request.abort()
终止正在发送的请求

- request.setTimeout(timeou, [callback])
设置请求超时时间，超时后调用回调函数。

- request.setNoDelay([noDelay])
- request.setSocketKeepAlive([enable], [initialDealy])
 
> 详细见Node.js文档

**`http.ClientResponse`**

和`http.ServerRequest`相似，提供`data`、`end`、`clise`，分别在数据到达、传输结束和连接结束时触发。

> 提供属性见pdf第85页

特殊函数：
- response.setEncoding([encoding])
设置当`data`事件触发后数据的编码方式（默认不编码，以`Buffer`形式存储。）

- response.pause()
暂停接受数据和发送事件。

- response.resume()
从暂停的状态恢复，结合上文方便实现下载。

## 第五章

5.1中有部分网页开发历程、Express框架提供的相对Node.js本身提供的更加高层的接口。

比起之前的复杂操作，用Express加载`express.bodyParser()`能够通过`req.body`获取POST的数据。

全局安装`express`解决方法：多加一句
`sudo npm install express-generator -g`

在书中所属步骤完成后附加一个函数
```
app.listen(3000, function(){
    console.log('Express started on 'http://localhost:3000;'');
});
```
即可看到Express欢迎页面。

> supervisor自动重启 3.1.3节 生产环境部署Node.js服务器 6.3节

关于工程结构，实际上因为版本的更新，工程结构已经和pdf内大有不同，但总体上来说还是`index.js`为网站总接口点，`routes/index.js`是网站路由，`layout.jade`是网站总视图。

该网站教程是使用jade模版的，会省去尖括号，如果用编辑器推荐安装jade语法包。

96-98页完整叙述了MVC架构在服务器接收到GET访问请求到返回页面内容之中发生了的事情，不熟悉的话可以仔细阅读。

### 创建新路由

express高于4的版本的写法：

于`app.js`中添加
```
var routes = require('./routes/index');

app.use('/', routes);
```

`./routes/index.js`:
```
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/hello', function(req, res, next) {
	res.send('The local time is: ' + new Date().toString());
});

router.get('/users', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
```

`node app.js`就可以在`http://localhost:3000/users`和`http://localhost:3000/hello`看到函数中对应的内容了。

next指的是将控制权转让给之后同样的规则，以免后者被屏蔽。这个工具可以用于实现中间件和提高代码复用性。

`index.js`:
```
var users = {
  'someone' : {
    name : 'phenan',
    website : 'https://github.com/Phenanth'
  }
}

app.all('/user/:username', function(req, res, next) {
  if (users[req.params.username]) {
    next();
  }  else {
    next(new Error(req.params.username + ' does not exist.'));
  }
});

app.get('/user/:username', function(req, res) {
  res.send(JSON.stringify(users[req.params.username]));
});

app.put('/user/:username', function(req, res) {
  res.send('Done');
});
```

### 路径匹配

实例：

于`app.js`中添加如下语句：
```
app.get('/user/:username', function(req, res) {
  res.send('user:' + req.params.username);
});
```

访问`http://localhost:3000/user/someone`即可得到页面内容。

访问规则会被编译为正则表达式，路径参数通过`req.params`访问，如果直接使用正则表达式匹配路径的话需要使用`req.params[1]`等方式访问参数。

express支持`表征状态转移(Representational State Transfer)`风格的请求方式，绑定以下函数：

- app.get(path, callback) （**获取**）
- app.post(path, callback)  （**新增**）
- app.put(path,callback)  （**更新**）
- app.delete(path,callback)  （**删除**）
- app.patch(path,callback)
- app.trace(path,callback)
- app.connect(path,callback)
- app.options(path,callback)
- app.all(path,callback)  （所有方法）

### 模版引擎（视图）

过去将逻辑集成到页面模版内部的做法由于难以维护、学习困难、功能划分不明显等问题后期显出有些疲软的态势，这里引入MVC架构中模版概念：在功能划分上它严格 于视图部分，因此功能以 生成 HTML 页面为核心，不会引入过多的编程语言的功能。

ejs模版引擎的标签系统：
- <% code %> js代码
- <%= code %> HTML代替特殊字符后的内容
- <%- code %> 原HTML内容

指定页面布局：

```
function(req, res) {
    res.render('userlist', {
        title: 'User List Page',
        layout: 'layout'
    });
};
```

`layout.ejs`:
```
<!DOCTYPE html>
<html>
<head>
  <h1><%= title %></h1>
  <link rel="stylesheet" href="/stylesheets/style.css" />
</head>

<body>
    <%- body %>
</body>

</html>
```

迭代显示：

`app.js`:
```
app.get('/list', function(req, res) {
  res.render('list', {
    title: 'List',
    items: [1998, 'phenan', 'express', 'Node.js']
  });
});
```

`/views/list.ejs`:
```
<ul><%- partial('listitem', items) %></ul>
```

`/views/listitem.ejs`:
```
<li><%= listitem %></li>
```

> 实际访问`http://localhost:3000/list`未得到应有显示内容，有待查询官方文档4.x版本以上的partial函数用法。

视图助手：动态用于`req`和`res`的访问，静态用于此外的任何类型对象

`app.js`:

```
var util = require('util');

app.helpers({ //错误用法
  inspect: function(obj) {
    return util.insepect(obj, true);
  }
});

app.dynamicHelpers({
  headers: function(req, res) {
    return req.headers;
  }
});

app.get('/helper', function(req, res) {
  res.render('helper', {
    title: 'Helpers'
  });
});
```

`helper.ejs`:
```
<%= inspect(headers) %>
```

> app.helpers()无此函数，有待更新版本新用法。视图助手将用于后文`session`部分

**有待修复版本原因引起的错误**

其后在`app.js`中增加了网站应有的路由关系，并使用`bootstrap`实现页面设计（CSS与HTML）部分。

> 存在因版本问题未成功引入`bootstrap`与`jquery`的问题，且并未使用`navbar`以及`footer`等ID与标签。

### NoSQL - MongoDB

讲述了关系型数据库与非关系型数据库的特点（p115），以及MongoDB中文档的属性。

```
{ "_id" : ObjectId( "4f7fe8432b4a1077a7c551e8" ), "uid" : 2004,
"username" : "byvoid",
"net9" : { "nickname" : "BYVoid",
          "surname" : "Kuo",
          "givenname" : "Carbo",
          "fullname" : "Carbo Kuo",
          "emails" : [ "byvoid@byvoid.com", "byvoid.kcp@gmail.com" ],
          "website" : "http://www.byvoid.com",
          "address" : "Zijing 2#, Tsinghua University" }
      }
```
MongoDB的数据格式是JSON

### 会话

由于Express与`session`中间件不再绑定，按照书上的用法首先需要`npm install express-session --save`

然后在`app.js`中添加:
```
var session = require('express-session')
var MongoStore = require('connect-mongo')(session)

app.use(session({
  secret: settings.cookieSecret,
  key: settings.db,
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30}, // 30 days
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    url: 'mongodb://localhost/microblog'
  })
}));
```

[版本移植参考网站](https://cnodejs.org/topic/567a1120222744630726b244)

> 今天深刻地体会到了使用过时的教程有多难受（就连参考网站都是两年前的了）

### 注册、登入

