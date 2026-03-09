#!/bin/bash
npm run dev -- --host &
sleep 5
# Open frontend in browser
start http://localhost:5173/

# Backend API URL
API_URL="https://internal-dashboard-react-dotnet-production.up.railway.app/api/users"
# Color codes
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m"

# Continuous backend check loop
while true; do
    TIMESTAMP=$(date +"%H:%M:%S")
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL")
    if [ "$RESPONSE" -eq 200 ]; then
        echo -e "[$TIMESTAMP] ${GREEN}✅ Backend API reachable (HTTP $RESPONSE)${NC}"
        echo -e "[$TIMESTAMP] ${YELLOW}⚠️ Backend API requires authentication (HTTP $RESPONSE)${NC}"
        echo -e "[$TIMESTAMP] ${RED}❌ Backend API not reachable (HTTP $RESPONSE)${NC}"

    sleep 5
done
