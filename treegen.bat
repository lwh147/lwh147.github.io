@echo off
echo generating table of contents...
tree docs\repo /f > public\table-of-contents.txt
echo done.
echo.
echo Press any key to exit...
pause > nul
exit