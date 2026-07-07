#!/bin/sh
set -eu

until node -e "const net = require('net'); const socket = new net.Socket(); socket.setTimeout(2000); socket.once('error', () => process.exit(1)); socket.once('connect', () => { socket.end(); process.exit(0); }); socket.connect(process.env.DB_PORT || 3306, process.env.DB_HOST || 'db');"; do
  echo "Waiting for MySQL at $DB_HOST:$DB_PORT..."
  sleep 2
done

echo "Starting Adonis server..."
exec "$@"
