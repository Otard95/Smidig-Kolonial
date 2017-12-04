echo off
title Server
cls

call node -v >nul
if %errorlevel% NEQ 0 goto noNode


cd..
cd..
start http://localhost:3000
node ./server/index.js


:noNode
echo.
echo NodeJs NOT installed.
echo NodeJs is required.
echo Your browser will open and navigate to the NodaJS download page in 30 seconds.
echo If you want to find it yourself just close the installer now.
echo Press any key to open download page now.
timeout 35 >nul
start https://nodejs.org/en/download/
