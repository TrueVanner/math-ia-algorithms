@echo off
set /p "graphfilename=Enter the name of the file where the graph is stored (default: graph.txt): "
if "%graphfilename%"=="" set graphfilename=graph.txt

:loop1
set /p "start=Enter the ID of the starting vertex: "
if "%start%"=="" (
echo The ID can't be empty!
goto loop1
)

:loop2
set /p "end=Enter the ID of the target vertex: "

if "%end%"=="" (
echo The ID can't be empty!
goto loop2
)
if "%end%"=="%start%" (
echo The ID of the target vertex can't be the same as the name of the starting vertex!
goto loop2
)

set /p "logfilename=Enter the name of the file where the log of the process will be stored (default: log.txt): "
if "%logfilename%"=="" set logfilename=log.txt

node dijkstra.js %graphfilename% %start% %end% %logfilename%
pause