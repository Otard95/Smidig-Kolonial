echo off
title Project Intallation
cls

call node -v >nul
if %errorlevel% NEQ 0 goto noNode

call npm -v >nul
if %errorlevel% NEQ 0 goto noNpm


npm install


:noNode
echo.
echo NodeJs NOT installed.
echo NodeJs is required.
echo Your browser will open and navigate to the NodaJS download page in 30 seconds.
echo If you want to find it yourself just close the installer now.
echo Press any key to open download page now.
timeout 35 >nul
start https://nodejs.org/en/download/
exit

:noNpm
echo.
echo There seems to be something wrong with your NodeJS install.
echo npm was not found. You may want to reinstall NodeJS.
echo.
pause
