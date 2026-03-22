# opencode-notifier

System notifications for OpenCode when a task completes, errors, or the agent pauses to ask you a question.

## What this gives you

- A global OpenCode plugin for macOS
- Notifications when OpenCode becomes idle after a response
- Notifications when OpenCode throws a session error
- Notifications when OpenCode asks a structured question and waits for your input
- Optional sounds for each event
- A log file for debugging plugin execution

## How it works

The plugin listens to OpenCode plugin events:

- `session.idle`
- `session.error`
- `question.asked`
- `permission.asked`

It then sends notifications through:

- `osascript` for macOS notifications
- `terminal-notifier` as a secondary notification channel
- `afplay` for sounds

## Requirements

- macOS
- OpenCode
- Homebrew
- `terminal-notifier`

Install `terminal-notifier`:

```bash
brew install terminal-notifier
```

## Install

Create the plugin directory if needed:

```bash
mkdir -p ~/.config/opencode/plugins
```

Copy the plugin into place:

```bash
cp notify.js ~/.config/opencode/plugins/notify.js
```

Then restart `opencode`.

## Plugin file

The plugin in this repo is:

- `notify.js`

## Debugging

The plugin writes diagnostic logs here:

```bash
/tmp/opencode-notify.log
```

View the log with:

```bash
cat /tmp/opencode-notify.log
```

Useful things to look for:

- `plugin loaded`
- `event: question.asked`
- `event: session.idle`
- `osascript: ok`
- `terminal-notifier: ok`

## Verify your system notification setup

Test notification delivery directly:

```bash
osascript -e 'display notification "OpenCode test" with title "OpenCode" subtitle "macOS"'
terminal-notifier -title "OpenCode" -subtitle "Test" -message "terminal-notifier test" -sound Glass
afplay /System/Library/Sounds/Glass.aiff
```

If you still do not see notifications, check macOS notification permissions for the terminal app that launches `opencode`.

## Notes about question notifications

OpenCode asking you to choose an option or answer a structured question is exposed as `question.asked`.

This is different from:

- `permission.asked` for tool approval
- ordinary assistant text replies that are not structured questions

## Files

- `notify.js` - production plugin
- `examples/opencode.json` - optional config example
- `scripts/install.sh` - convenience installer

## License

MIT
