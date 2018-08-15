#!/bin/sh
echo = ailbb = 
echo 请启动浏览器，输入地址《http://`ifconfig $1|sed -n 2p|awk  '{ print $2 }'|awk -F : '{ print $2 }'`:80》进行访问！
echo 正在启动服务...
echo 程序路径：`pwd`
echo 提示：（如需停止服务请按：ctrl+c）
`pwd`/program/linux/bin/node `pwd`/code/start.js
echo 服务结束！
