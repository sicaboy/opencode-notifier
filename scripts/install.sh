#!/usr/bin/env bash
set -euo pipefail

CONFIG_DIR="${HOME}/.config/opencode"
PLUGIN_DIR="${CONFIG_DIR}/plugins"

mkdir -p "${PLUGIN_DIR}"
cp "$(dirname "$0")/../notify.js" "${PLUGIN_DIR}/notify.js"

if ! command -v terminal-notifier >/dev/null 2>&1; then
  echo "terminal-notifier not found; installing with Homebrew"
  brew install terminal-notifier
fi

echo "Installed plugin to ${PLUGIN_DIR}/notify.js"
echo "Restart opencode to load the plugin"
