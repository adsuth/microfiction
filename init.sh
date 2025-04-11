#!/bin/bash

# Variables
entity="microfiction"
local=false

# Functions
create_dotenv_file() {
  local uri=$(get_mongo_uri)
  local access_token=$(get_auth0_access_token)

  cat <<EOF > .env
MONGO_URI=$uri
AUTH0_API_ACCESS_TOKEN=$access_token
EOF

  # TODO: Add more content here if needed

  echo -e "\e[32mCreated .env file!\e[0m"
}

get_mongo_uri() {
  if [ "$local" = true ]; then
    echo -e "\e[33mUsing local database...\e[0m"
    echo "mongodb://localhost:27017/$entity"
  else
    echo -e "\e[33mUsing Atlas database...\e[0m"
    echo -e "\e[33mEnter password for the Atlas cluster:\e[0m"
    read -s pass
    echo "mongodb+srv://adamsutherlandam:$pass@ewd.9mnis.mongodb.net/$entity"
  fi
}

get_auth0_access_token() {
  echo -e "\e[33mEnter access token for the API (find here -> https://manage.auth0.com/dashboard/uk/adsuth/apis/management/explorer):\e[0m"
  read -s access_token
  echo "$access_token"
}

create_auth0_dotenv_file() {
  # Uncomment the following lines if you want to prompt for client_id
  # echo -e "\e[33mEnter client id for Auth0 (find here -> https://manage.auth0.com/dashboard/uk/adsuth/applications/):\e[0m"
  # read -s client_id
  client_id="LxXErrlok0cP0DNFEkBqnKcMewY06nnt"

  echo -e "\e[33mEnter client secret for Auth0 (find here -> https://manage.auth0.com/dashboard/uk/adsuth/applications/):\e[0m"
  read -s client_secret

  secret=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

  # TODO: Change base URL when in production
  cat <<EOF > .env.local
AUTH0_SECRET=$secret
AUTH0_BASE_URL="http://localhost:3000"
AUTH0_ISSUER_BASE_URL="https://adsuth.uk.auth0.com"
AUTH0_CLIENT_ID=$client_id
AUTH0_CLIENT_SECRET=$client_secret
EOF

  echo -e "\e[32mCreated .env.local file!\e[0m"
}

# Main Execution
create_dotenv_file
create_auth0_dotenv_file