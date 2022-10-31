@echo off
:start
set /p "graphfilename=Enter the name of the file where the graph is stored (default: graph.txt): "
if "%graphfilename%"=="" set graphfilename=graph.txt

:loop
set /p "mode=Enter the type of the algorithm (0 = Dijkstra's algorithm, 1 = A* algorithm): 
if "%mode%"=="" (goto loop)
if "%mode%"=="0" if "%mode%"=="1" else (goto loop)

set coordsfilename=coords.txt
if "%mode%"=="1" (
set /p "coordsfilename=Enter the name of the file where the relative coordinates of each vertex are stored (default: coords.txt): "
)

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

node algorithms.js %graphfilename% %mode% %coordsfilename% %start% %end% %logfilename%

set /p "loop=Continue working? (0 = yes, 1 = no): "
if "%loop%"=="0" (
set %graphfilename%=""
set %mode%=""
set %start%=""
set %end%=""
set %logfilename%=""
set %loop%=""
goto start
)