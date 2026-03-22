# opencode-notifier

macOS notifications for OpenCode when a task finishes, errors, or pauses to ask you a structured question.

## Highlights

- Notify when OpenCode becomes idle after finishing a response
- Notify when OpenCode pauses and asks you to choose or answer something
- Notify when a session errors
- Play different sounds for done, question, and error states
- Keep a debug log so you can tell whether the plugin loaded and which events fired

## Events handled

- `session.idle`
- `session.error`
- `question.asked`
- `permission.asked`

`question.asked` is the key event for the common "the agent paused and is waiting for my answer" flow.

## Delivery channels

- `osascript` for native macOS notifications
- `terminal-notifier` as a fallback/secondary path
- `afplay` for sound playback

## Requirements

- macOS
- OpenCode
- Homebrew
- `terminal-notifier`

Install `terminal-notifier`:

```bash
brew install terminal-notifier
```

## Quick install

```bash
mkdir -p ~/.config/opencode/plugins
cp notify.js ~/.config/opencode/plugins/notify.js
```

Then restart `opencode`.

Or use the included installer:

```bash
./scripts/install.sh
```

## Repository layout

- `notify.js` - the production plugin
- `scripts/install.sh` - convenience installer
- `examples/opencode.json` - optional config example
- `README.zh-CN.md` - Chinese guide

## How the plugin works

The plugin listens to OpenCode events and sends notifications with event-specific text and sounds:

- `session.idle` -> `Task complete` + `Glass`
- `question.asked` -> the first question text + `Ping`
- `permission.asked` -> `OpenCode needs your approval` + `Ping`
- `session.error` -> `Session error` + `Basso`

It also writes logs to help diagnose issues.

## Debugging

Log file:

```bash
/tmp/opencode-notify.log
```

Read it with:

```bash
cat /tmp/opencode-notify.log
```

Useful log lines:

- `plugin loaded`
- `event: question.asked`
- `event: session.idle`
- `osascript: ok`
- `terminal-notifier: ok`

## Verify your macOS notification setup

Test each channel directly:

```bash
osascript -e 'display notification "OpenCode test" with title "OpenCode" subtitle "macOS"'
terminal-notifier -title "OpenCode" -subtitle "Test" -message "terminal-notifier test" -sound Glass
afplay /System/Library/Sounds/Glass.aiff
```

If notifications still do not appear, check notification permissions for the terminal app that launches `opencode`.

## Screenshots / demo ideas

This repo does not include screenshots yet, but a useful demo setup is:

1. Start `opencode`
2. Ask it to perform a task that will take a few steps
3. Let it reach a `question.asked` pause
4. Watch the notification arrive while the terminal is in the background

## License

MIT
