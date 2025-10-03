@echo off
echo 🚀 Iniciando entorno de desarrollo...

REM Iniciar todos los servicios usando concurrently con cmd.exe explícito
npx concurrently --kill-others-on-fail --prefix-colors "#93c5fd,#c4b5fd,#fdba74" --names "server,queue,vite" "php artisan serve" "php artisan queue:listen --tries=1" "npm run dev"

echo.
echo ✅ Servicios detenidos
pause