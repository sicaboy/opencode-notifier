const LOG_FILE = "/tmp/opencode-notify.log"

export const NotifyPlugin = async ({ $, directory }) => {
  let lastNotificationAt = 0

  const projectName = () => {
    const parts = directory.split("/").filter(Boolean)
    return parts.length ? parts[parts.length - 1] : "OpenCode"
  }

  const appendLog = async (line) => {
    const stamp = new Date().toISOString()
    await Bun.write(LOG_FILE, `[${stamp}] ${line}\n`, { append: true })
  }

  const push = async ({ message, subtitle, sound }) => {
    const now = Date.now()
    if (now - lastNotificationAt < 1500) {
      await appendLog(`throttled: ${subtitle} | ${message}`)
      return
    }
    lastNotificationAt = now

    const title = `OpenCode - ${projectName()}`
    await appendLog(`notify: ${subtitle} | ${message}`)

    try {
      await $`osascript -e ${`display notification ${JSON.stringify(message)} with title ${JSON.stringify(title)} subtitle ${JSON.stringify(subtitle)}`}`
      await appendLog("osascript: ok")
    } catch (error) {
      await appendLog(`osascript: failed | ${error}`)
    }

    try {
      if (sound === "Glass") await $`afplay /System/Library/Sounds/Glass.aiff`
      if (sound === "Basso") await $`afplay /System/Library/Sounds/Basso.aiff`
      if (sound === "Ping") await $`afplay /System/Library/Sounds/Ping.aiff`
      await appendLog(`sound: ok | ${sound}`)
    } catch (error) {
      await appendLog(`sound: failed | ${sound} | ${error}`)
    }

    try {
      await $`terminal-notifier -title ${title} -subtitle ${subtitle} -message ${message} -sound ${sound}`
      await appendLog("terminal-notifier: ok")
    } catch (error) {
      await appendLog(`terminal-notifier: failed | ${error}`)
    }
  }

  await appendLog(`plugin loaded for ${projectName()}`)

  return {
    event: async ({ event }) => {
      await appendLog(`event: ${event.type}`)

      if (event.type === "session.idle") {
        await push({
          message: "任务已完成",
          subtitle: "Session idle",
          sound: "Glass",
        })
      }

      if (event.type === "session.error") {
        await push({
          message: "任务出错了",
          subtitle: "Session error",
          sound: "Basso",
        })
      }

      if (event.type === "permission.asked") {
        await push({
          message: "OpenCode 需要你的确认",
          subtitle: "Permission required",
          sound: "Ping",
        })
      }

      if (event.type === "question.asked") {
        const first = event.properties.questions?.[0]
        const text = first?.question || first?.header || "OpenCode 正在等你回答"
        await push({
          message: text,
          subtitle: "Question asked",
          sound: "Ping",
        })
      }
    },
  }
}
