#!/bin/bash
# dump-postgres.sh using a provided .env file (mandatory)
SUCCESS='\033[0;32m'
ERROR='\033[0;31m'
NC='\033[0m'

# Ensure .env path is provided
if [ -z "$1" ]; then
  echo -e "${ERROR}Usage: $0 path/to/.env${NC}"
  exit 1
fi

ENV_FILE="$1"

# Check if .env exists at provided path
if [ ! -f "$ENV_FILE" ]; then
  echo -e "${ERROR}.env file not found at: $ENV_FILE${NC}"
  exit 1
fi

# Load .env variables into environment
export $(grep -v '^#' "$ENV_FILE" | xargs)

# Ensure required variables are set
if [ -z "$POSTGRES_DB" ]; then
  echo -e "${ERROR}Missing POSTGRES_DB value${NC}"
  exit 1
fi

if [ -z "$POSTGRES_USER" ]; then
  echo -e "${ERROR}Missing POSTGRES_USER value${NC}"
  exit 1
fi

if [ -z "$DB_PORT" ]; then
  echo -e "${ERROR}Missing DB_PORT value${NC}"
  exit 1
fi

# Ensure dumps directory exists
mkdir -p ./dumps

# Use current timestamp for backup file
BACKUP_FILE="./dumps/backup_$(date +%F_%H-%M-%S).dump"

# Run pg_dump (password can be provided via PGPASSWORD in .env)
pg_dump -h "$DB_ENV" -p "$DB_PORT" -U "$POSTGRES_USER" -F c -b -v -f "$BACKUP_FILE" "$POSTGRES_DB"

if [ $? -eq 0 ]; then
  echo -e "${SUCCESS}Db backup created: $BACKUP_FILE${NC}"
else
  echo -e "${ERROR}Backup failed${NC}"
  exit 1
fi
