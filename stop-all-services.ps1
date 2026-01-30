# Stop All Fitness Microservices
# This script stops all Java processes running Spring Boot applications

Write-Host "Stopping all Fitness Microservices..." -ForegroundColor Yellow

# Get all Java processes
$javaProcesses = Get-Process -Name java -ErrorAction SilentlyContinue

if ($javaProcesses) {
    Write-Host "Found $($javaProcesses.Count) Java process(es)" -ForegroundColor Cyan
    
    # Stop each Java process
    foreach ($process in $javaProcesses) {
        try {
            Write-Host "Stopping process ID: $($process.Id)" -ForegroundColor Yellow
            Stop-Process -Id $process.Id -Force
            Write-Host "Stopped process ID: $($process.Id)" -ForegroundColor Green
        } catch {
            Write-Host "Error stopping process ID: $($process.Id) - $_" -ForegroundColor Red
        }
    }
    
    Write-Host "`nAll services stopped." -ForegroundColor Green
} else {
    Write-Host "No Java processes found. Services may not be running." -ForegroundColor Yellow
}
