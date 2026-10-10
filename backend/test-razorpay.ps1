$baseUrl = "https://awhile-venus-unlearned.ngrok-free.dev/api"

# 1. Register a test user
$registerBody = @{
    email = "testrazorpay@example.com"
    password = "password123"
    fullName = "Test Razorpay"
} | ConvertTo-Json

$registerRes = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $registerBody -ContentType "application/json" -ErrorAction SilentlyContinue

$token = $registerRes.token
if (-not $token) {
    # Try logging in if already registered
    $loginBody = @{
        email = "testrazorpay@example.com"
        password = "password123"
    } | ConvertTo-Json
    $loginRes = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginRes.token
}

Write-Host "Got Token: $token"

# 2. Create Order
$orderBody = @{
    plan = "STARTER"
    amount = 499
    currency = "INR"
    billingCycle = "monthly"
} | ConvertTo-Json

try {
    $orderRes = Invoke-RestMethod -Uri "$baseUrl/payments/create-order" -Method Post -Headers @{ Authorization = "Bearer $token" } -Body $orderBody -ContentType "application/json"
    Write-Host "Success!"
    $orderRes | ConvertTo-Json
} catch {
    Write-Host "Error creating order:"
    $streamReader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
    $errResp = $streamReader.ReadToEnd()
    Write-Host $errResp
}
