#!/usr/bin/env bash
set -euo pipefail

CONFIG_DIR="${HOME}/.config/opencode"
PLUGIN_DIR="${CONFIG_DIR}/plugins"
PLUGIN_FILE="${PLUGIN_DIR}/notify.js"
SCRIPT_DIR="$(CDPATH= cd -- "$(dirname "$0")" && pwd)"
LOCAL_SOURCE="${SCRIPT_DIR}/../notify.js"
REMOTE_SOURCE="https://raw.githubusercontent.com/sicaboy/opencode-notifier/main/notify.js"

mkdir -p "${PLUGIN_DIR}"

if [ -f "${LOCAL_SOURCE}" ]; then
  cp "${LOCAL_SOURCE}" "${PLUGIN_FILE}"
else
  curl -fsSL "${REMOTE_SOURCE}" -o "${PLUGIN_FILE}"
fi

if ! command -v terminal-notifier >/dev/null 2>&1; then
  echo "terminal-notifier not found; installing with Homebrew"
  brew install terminal-notifier
fi

echo "Installed plugin to ${PLUGIN_FILE}"
echo "Restart opencode to load the plugin"
