# taogin_app
大球-掏金網 電腦版前端

npm run start

npm run build

run css command: 

       在command 打 gulp(gulp default) 的指令 就可以自動編輯scss壓縮成一隻css 
         C:\code\jyufu\taogin_app\gulpfile.js     do   watch

更新19/02/20

說明補釘安裝*canvas

如果您使用的是Windows，則可以node-gyp使用單個命令安裝所有依賴項（注意：在Windows PowerShell中運行為管理員)

執行
```bash
  $ npm install --global --production windows-build-tools  
```
And then install the package
```bash
  $ npm install --global node-gyp  
```
您將需要捆綁在GTK中的cairo庫。下載適用於Win32或Win64的GTK 2軟件包。解壓縮內容C:\GTK。
http://ftp.gnome.org/pub/GNOME/binaries/win64/gtk+/2.22/gtk+-bundle_2.22.1-20101229_win64.zip


And then install the package(在專案內)
```bash
  npm install canvas  
```
***   "@types/node": "7.0.7"   ****

改node版本
  
https://nodejs.org/download/release/v7.0.0/

下載node-v7.0.0-win-x64.7z  壓C:\Program Files\nodejs

再依序 
```bash
  npm i  
```
```bash
  npm run build  
```

## 相關連結
https://stackoverflow.com/questions/21365714/nodejs-error-installing-with-npm

https://github.com/Automattic/node-canvas/wiki/Installation:-Windows
