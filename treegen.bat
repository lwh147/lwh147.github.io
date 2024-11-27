@echo off
echo Generating resources directory structure into tree.txt...
tree dist\repo /f > tree.txt
echo done.
echo.
echo Press any key to exit...
pause > nul
exit