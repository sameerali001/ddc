@echo off
echo ========================================================
echo DOON DEFENCE COLLEGE - PREMIUM WEBSITE STARTUP SCRIPT
echo ========================================================
echo.
echo [1/2] Launching Express Backend Server (Port 5000)...
start cmd /k "cd backend && npm install --legacy-peer-deps && npm run dev"

echo.
echo [2/2] Launching Next.js Frontend Server (Port 3000)...
start cmd /k "cd frontend && npm install --legacy-peer-deps && npm run dev"

echo.
echo ========================================================
echo Both processes launched. Check the separate command windows.
echo Front-end will be ready at: http://localhost:3000
echo Back-end is running at:    http://localhost:5000
echo ========================================================
pause
