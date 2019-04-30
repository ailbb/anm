@echo = AILBB = 
@echo 正在启动服务...
@echo 程序路径：%~dp0
@echo 提示：（如需停止服务请按：ctrl+c）
@echo 正在启动浏览器...
@start "" http://localhost:80
@%~dp0\program\windows\node %~dp0\code\start.js
@echo 启动浏览器完成！
@echo 服务结束！
@pause