#!/usr/bin/env bash
set -Eeuo pipefail

# Gather Community Events Board setup helper.
# Run from the repository root: ./setup.sh

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

log() {
  printf '\n\033[1;32m[setup]\033[0m %s\n' "$1"
}

fail() {
  printf '\n\033[1;31m[setup] Error:\033[0m %s\n' "$1" >&2
  exit 1
}

command -v node >/dev/null 2>&1 || fail "Node.js is not installed. Install a Node.js version supported by this project, then rerun ./setup.sh."
command -v npm >/dev/null 2>&1 || fail "npm is not installed. Install npm, then rerun ./setup.sh."

log "Checking Node.js and npm versions"
node --version
npm --version

if [[ ! -f package.json ]]; then
  fail "package.json was not found in $ROOT_DIR. Run this script from the project repository."
fi

log "Installing dependencies"
if [[ -f package-lock.json ]]; then
  npm ci
else
  npm install
fi

if [[ -f env.example ]]; then
  if [[ -e .env.local ]]; then
    log ".env.local already exists; leaving it unchanged"
  else
    cp env.example .env.local
    log "Created .env.local from env.example"
  fi
else
  log "env.example not found; skipping environment-file creation"
fi

cat <<'EOF'

Setup dependencies are ready.

Next steps:
  1. Open .env.local and fill in any required values (for example, your database URL and JWT secret).
  2. Start the development server:
       npm run dev
  3. Open http://localhost:3000

This script does not generate database credentials or JWT secrets, and it never overwrites an existing .env.local.
EOF
