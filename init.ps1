# Prompt for a password if not provided as an argument
param (
  [switch]$prod
)

$entity = "microfiction"

function Create-Dotenv-File
{
  param (
    [string] $uri
  )

  $uri = Get-Mongo-Uri
  $access_token = Get-Auth0-Access-Token
  $build = "DEV"

  if ($prod)
  {
    $build = "PROD"
  }

  $env_content = @"
  MONGO_URI=$uri
  AUTH0_API_ACCESS_TOKEN=$access_token
  BUILD=$build
"@

  Set-Content -Path ".env" -Value $env_content

  # todo :: add more content here if needed


  Write-Host "Created .env file!" -ForegroundColor Green
}

function Get-Mongo-Uri
{
  if (-not $prod)
  {
    Write-Host "Using local database..." -ForegroundColor Yellow
    return "mongodb://localhost:27017/$entity"
  }
  else
  {
    Write-Host "Using Atlas database..." -ForegroundColor Yellow

    Write-Host "Enter password for the Atlas cluster:" -ForegroundColor Yellow
    $pass = Read-Host -AsSecureString
    $pass = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($pass))
    
    return "mongodb+srv://adamsutherlandam:$pass@ewd.9mnis.mongodb.net/$entity"
  }
}

function Get-Auth0-Access-Token
{
  Write-Host "Enter access token for the API (find here -> https://manage.auth0.com/dashboard/uk/adsuth/apis/management/explorer):" -ForegroundColor Yellow
  $access_token = Read-Host -AsSecureString
  $access_token = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($access_token))
  return "$access_token"
}


function Create-Auth0-Dotenv-File
{
  # Write-Host "Enter client id for Auth0 (find here -> https://manage.auth0.com/dashboard/uk/adsuth/applications/):" -ForegroundColor Yellow
  # $client_id = Read-Host -AsSecureString
  # $client_id = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($client_id))
  $client_id = "LxXErrlok0cP0DNFEkBqnKcMewY06nnt"

  Write-Host "Enter client secret for Auth0 (find here -> https://manage.auth0.com/dashboard/uk/adsuth/applications/):" -ForegroundColor Yellow
  $client_secret = Read-Host -AsSecureString
  $client_secret = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($client_secret))
  
  $secret = node -e "console.log(crypto.randomBytes(32).toString('hex'))" 

  # todo :: change base url when in production
  $envContent = @"
    AUTH0_SECRET=$secret
    AUTH0_BASE_URL="http://localhost:3000"
    AUTH0_ISSUER_BASE_URL="https://adsuth.uk.auth0.com"
    AUTH0_CLIENT_ID=$client_id
    AUTH0_CLIENT_SECRET=$client_secret
"@

  Set-Content -Path ".env.local" -Value $envContent
  Write-Host "Created .env.local file!" -ForegroundColor Green

}

# get packages
npm i --legacy-peer-deps

Create-Dotenv-File
Create-Auth0-Dotenv-File