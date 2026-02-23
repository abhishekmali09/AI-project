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
    $mvnwCmd = Join-Path $ServicePath "mvnw.cmd"
    if (-not (Test-Path $mvnwCmd)) {
        Write-Host "mvnw.cmd not found for $ServiceName at $ServicePath" -ForegroundColor Red
        return
    }
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ServicePath'; .\\mvnw.cmd spring-boot:run" -WindowStyle Normal
    Start-Sleep -Seconds 3
}

# Start Config Server first (port 8333)
Write-Host "`n[1/6] Starting Config Server..." -ForegroundColor Cyan
Start-Service -ServiceName "Config Server" -ServicePath "$PSScriptRoot\configserver" -Port 8333
Start-Sleep -Seconds 8

# Start Eureka Server next (port 8761)
Write-Host "`n[2/6] Starting Eureka Server..." -ForegroundColor Cyan
Start-Service -ServiceName "Eureka Server" -ServicePath "$PSScriptRoot\eureka" -Port 8761
Start-Sleep -Seconds 10

# Start User Service (port 8081)
Write-Host "`n[3/6] Starting User Service..." -ForegroundColor Cyan
Start-Service -ServiceName "User Service" -ServicePath "$PSScriptRoot\userservice" -Port 8081
Start-Sleep -Seconds 5

# Start Activity Service (port 8082)
Write-Host "`n[4/6] Starting Activity Service..." -ForegroundColor Cyan
Start-Service -ServiceName "Activity Service" -ServicePath "$PSScriptRoot\activiyservice" -Port 8082
Start-Sleep -Seconds 5

# Start AI Service (port 8083)
Write-Host "`n[5/6] Starting AI Service..." -ForegroundColor Cyan
Start-Service -ServiceName "AI Service" -ServicePath "$PSScriptRoot\aiservice" -Port 8083
Start-Sleep -Seconds 5

# Start API Gateway last (port 8080)
Write-Host "`n[6/6] Starting API Gateway..." -ForegroundColor Cyan
Start-Service -ServiceName "API Gateway" -ServicePath "$PSScriptRoot\gateway" -Port 8080

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "All services are starting..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "Config Server: http://localhost:8333" -ForegroundColor Cyan
Write-Host "Eureka Dashboard: http://localhost:8761" -ForegroundColor Cyan
Write-Host "API Gateway: http://localhost:8080" -ForegroundColor Cyan
Write-Host "User Service: http://localhost:8081" -ForegroundColor Cyan
Write-Host "Activity Service: http://localhost:8082" -ForegroundColor Cyan
Write-Host "AI Service: http://localhost:8083" -ForegroundColor Cyan
Write-Host "`nNote: Each service will open in a separate window." -ForegroundColor Yellow
Write-Host "Wait for all services to fully start before testing." -ForegroundColor Yellow
