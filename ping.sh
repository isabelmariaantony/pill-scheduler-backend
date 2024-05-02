#!/bin/bash
URL="https://pill-scheduler-backend.onrender.com/pillsByTimeRange"  # Replace http://example.com with the URL you want to ping

while true
do
    echo "Pinging $URL..."
    curl  $URL  # Sends a HEAD request to the URL and logs the headers
    echo "Ping completed at $(date)"  # Logs the time of the ping
    echo "-----------------------------------" 
    sleep 600  # Waits for 30 seconds before the next ping
done

