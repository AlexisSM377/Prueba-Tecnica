#!/usr/bin/env pwsh
# Script de desarrollo para Laravel con React
# Ejecuta el servidor de desarrollo, queue listener y Vite en paralelo

Write-Host "🚀 Iniciando entorno de desarrollo..." -ForegroundColor Green

# Función para manejar la limpieza al salir
function Cleanup {
    Write-Host "`n🛑 Deteniendo servicios..." -ForegroundColor Yellow
    Get-Job | Stop-Job
    Get-Job | Remove-Job
    Write-Host "✅ Servicios detenidos correctamente" -ForegroundColor Green
}

# Configurar manejo de Ctrl+C
Register-EngineEvent PowerShell.Exiting -Action { Cleanup }

try {
    # Iniciar Laravel server
    Write-Host "📋 Iniciando Laravel server..." -ForegroundColor Cyan
    $serverJob = Start-Job -ScriptBlock {
        Set-Location $using:PWD
        php artisan serve
    }

    # Iniciar Queue listener
    Write-Host "⚡ Iniciando Queue listener..." -ForegroundColor Magenta  
    $queueJob = Start-Job -ScriptBlock {
        Set-Location $using:PWD
        php artisan queue:listen --tries=1
    }

    # Iniciar Vite
    Write-Host "⚡ Iniciando Vite dev server..." -ForegroundColor Yellow
    $viteJob = Start-Job -ScriptBlock {
        Set-Location $using:PWD
        npm run dev
    }

    Write-Host "`n✅ Todos los servicios iniciados correctamente!" -ForegroundColor Green
    Write-Host "🌐 Laravel server: http://127.0.0.1:8000" -ForegroundColor White
    Write-Host "📦 Vite dev server: http://127.0.0.1:5173" -ForegroundColor White
    Write-Host "`nPresiona Ctrl+C para detener todos los servicios`n" -ForegroundColor Gray

    # Mostrar output de los jobs en tiempo real
    while ($true) {
        Start-Sleep -Seconds 1
        
        # Mostrar output del servidor
        Receive-Job $serverJob | ForEach-Object { Write-Host "[SERVER] $_" -ForegroundColor Blue }
        
        # Mostrar output de la cola
        Receive-Job $queueJob | ForEach-Object { Write-Host "[QUEUE] $_" -ForegroundColor Magenta }
        
        # Mostrar output de Vite
        Receive-Job $viteJob | ForEach-Object { Write-Host "[VITE] $_" -ForegroundColor Yellow }
        
        # Verificar si algún job ha fallado
        if ($serverJob.State -eq "Failed" -or $queueJob.State -eq "Failed" -or $viteJob.State -eq "Failed") {
            Write-Host "❌ Uno de los servicios ha fallado. Deteniendo..." -ForegroundColor Red
            break
        }
    }
}
catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
}
finally {
    Cleanup
}