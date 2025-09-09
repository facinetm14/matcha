#!/bin/bash
# restore-postgres.sh using .env variables (mandatory)
SUCCESS='\033[0;32m'
ERROR='\033[0;31m'
NC='\033[0m'

# Ensure .env path is provided
if [ -z "$1" ]; then
  echo -e "${ERROR}Usage: $0 path/to/.env${NC}"
  exit 1
fi

if [ -z "$2" ]; then
  echo -e "${ERROR}Usage: $0 path to .dump${NC}"
  exit 1
fi

ENV_FILE="$1"
DUMP_FILE="$2"

# Check if .env exists at provided path
if [ ! -f "$ENV_FILE" ]; then
  echo -e "${ERROR}.env file not found at: $ENV_FILE${NC}"
  exit 1
fi

# Load .env variables into environment
export $(grep -v '^#' "$ENV_FILE" | xargs)

# Ensure required variables are set
if [ -z "$POSTGRES_DB" ] ; then
  echo -e "${ERROR}Missing POSTGRES_DB value${NC}"
  exit 1
fi

if [ -z "$POSTGRES_USER" ] ; then
  echo -e "${ERROR}Missing POSTGRES_USER value${NC}"
  exit 1
fi

if [ -z "$DB_PORT" ] ; then
  echo -e "${ERROR}Missing DB_PORT value${NC}"
  exit 1
fi

if [ ! -f "$DUMP_FILE" ]; then
  echo -e "${ERROR}Dump file not found: $DUMP_FILE${NC}"
  exit 1
fi

pg_restore -h "$DB_ENV" -p "$DB_PORT" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -v "$DUMP_FILE"

if [ $? -eq 0 ]; then
  echo -e "${SUCCESS}Database restored successfully from: $DUMP_FILE${NC}"
else
  echo -e "${ERROR}Restore failed!${NC}"
  exit 1
fi
