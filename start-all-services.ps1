# Start All Fitness Microservices
# Run this script from the project root directory

Write-Host "Starting Fitness Microservices..." -ForegroundColor Green

# Function to start a service
function Start-Service {
    param(
        [string]$ServiceName,
        [string]$ServicePath,
        [int]$Port
    )
    
    Write-Host "`nStarting $ServiceName on port $Port..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ServicePath'; mvn spring-boot:run" -WindowStyle Normal
    Start-Sleep -Seconds 3
}

# Start Eureka Server first (port 8761)
Write-Host "`n[1/4] Starting Eureka Server..." -ForegroundColor Cyan
Start-Service -ServiceName "Eureka Server" -ServicePath "$PSScriptRoot\eureka" -Port 8761
Start-Sleep -Seconds 10

# Start User Service (port 8081)
Write-Host "`n[2/4] Starting User Service..." -ForegroundColor Cyan
Start-Service -ServiceName "User Service" -ServicePath "$PSScriptRoot\userservice" -Port 8081
Start-Sleep -Seconds 5

# Start Activity Service (port 8082)
Write-Host "`n[3/4] Starting Activity Service..." -ForegroundColor Cyan
Start-Service -ServiceName "Activity Service" -ServicePath "$PSScriptRoot\activiyservice" -Port 8082
Start-Sleep -Seconds 5

# Start AI Service (port 8083)
Write-Host "`n[4/4] Starting AI Service..." -ForegroundColor Cyan
Start-Service -ServiceName "AI Service" -ServicePath "$PSScriptRoot\aiservice" -Port 8083

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "All services are starting..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "Eureka Dashboard: http://localhost:8761" -ForegroundColor Cyan
Write-Host "User Service: http://localhost:8081" -ForegroundColor Cyan
Write-Host "Activity Service: http://localhost:8082" -ForegroundColor Cyan
Write-Host "AI Service: http://localhost:8083" -ForegroundColor Cyan
Write-Host "`nNote: Each service will open in a separate window." -ForegroundColor Yellow
Write-Host "Wait for all services to fully start before testing." -ForegroundColor Yellow
