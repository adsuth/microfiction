#!/bin/bash
# Prompt for a password if not provided as an argument
if [ -z "$1" ]; then
  read -sp "Enter MongoDB password: " mongo_uri
  echo
else
  mongo_uri=$1
fi

# Determine the MongoDB URI based on the argument
if [ "$mongo_uri" == "local" ]; then
  mongo_uri="mongodb://127.0.0.1:27017/"
  printf "\e[32mUsing local MongoDB connection\e[0m\n"
else
  mongo_uri="mongodb+srv://adamsutherlandam:$mongo_uri@ewd.9mnis.mongodb.net/"
fi

# Write the mongo URI to a new .env file
cat <<EOL > .env
MONGO_URI=$mongo_uri
EOL

printf "\e[36m.env file created!\e[0m"
echo ""
