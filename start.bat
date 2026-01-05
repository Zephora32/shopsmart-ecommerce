@echo off
echo Starting E-handel Server...
echo.

REM Try different ports
set PORT=3000
node server.js 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Port 3000 is busy, trying 3001...
    set PORT=3001
    node server.js 2>nul
    if %ERRORLEVEL% NEQ 0 (
        echo Port 3001 is busy, trying 8080...
        set PORT=8080
        node server.js 2>nul
        if %ERRORLEVEL% NEQ 0 (
            echo Port 8080 is busy, trying 8081...
            set PORT=8081
            node server.js
        )
    )
)
