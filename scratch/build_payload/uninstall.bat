@echo off
setlocal
echo ========================================================
echo             Uninstalling Namustutam POS
echo ========================================================
call "%~dp0stop.bat"

echo Removing desktop and start menu shortcuts...
set "DESKTOP_LNK=%USERPROFILE%\Desktop\Namustutam POS.lnk"
if exist "%DESKTOP_LNK%" del /f /q "%DESKTOP_LNK%"

set "SM_DIR=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Namustutam POS"
if exist "%SM_DIR%" rmdir /s /q "%SM_DIR%"

echo Shortcuts successfully removed.
echo To completely remove files, delete this folder: %~dp0
echo.
pause
