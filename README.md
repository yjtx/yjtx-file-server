## 本地 server

### 安装

进入主目录
```[sudo] npm install -g```


### 使用

终端进入到需要展示的文件夹，执行  ```yjtx [--port 4020] [--root path] [--index path]```

* --port 指定自定义端口

* --root 指定此次打开的根目录。本地文件路径 如 /Users/yjtx/Sites 或者 ../../Sites。如果不加 --root 参数，则为当前目录。

* --index 此次打开直接打开的地址。相对 root 的路径。比如 Hello/index.html。真实路径就是 $root/Hello/index.html