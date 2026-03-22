import fs from "node:fs"
import path from "node:path"
import assert from "node:assert/strict"

const root = process.cwd()

const read = (relativePath) => {
  return fs.readFileSync(path.join(root, relativePath), "utf8")
}

const exists = (relativePath) => {
  return fs.existsSync(path.join(root, relativePath))
}

const notify = read("notify.js")
const install = read("scripts/install.sh")
const readme = read("README.md")
const readmeZh = read("README.zh-CN.md")
const banner = read("assets/banner.svg")

assert.ok(exists("notify.js"), "notify.js should exist")
assert.ok(exists("scripts/install.sh"), "install script should exist")
assert.ok(exists("assets/banner.svg"), "banner.svg should exist")

assert.match(notify, /export const NotifyPlugin = async/, "plugin export should exist")
assert.match(notify, /question\.asked/, "plugin should handle question.asked")
assert.match(notify, /session\.idle/, "plugin should handle session.idle")
assert.match(notify, /permission\.asked/, "plugin should handle permission.asked")
assert.match(notify, /session\.error/, "plugin should handle session.error")
assert.match(notify, /Task complete/, "plugin should use English notification copy")

assert.match(install, /REMOTE_SOURCE=/, "installer should support remote installation")
assert.match(install, /curl -fsSL/, "installer should fetch remote plugin when needed")
assert.match(install, /terminal-notifier/, "installer should install terminal-notifier")

assert.match(readme, /README\.zh-CN\.md/, "English README should link Chinese README")
assert.match(readmeZh, /README\.md/, "Chinese README should link English README")
assert.match(readme, /curl -fsSL https:\/\/raw\.githubusercontent\.com\/sicaboy\/opencode-notifier\/main\/scripts\/install\.sh \| bash/, "English README should document one-line install")
assert.match(readmeZh, /curl -fsSL https:\/\/raw\.githubusercontent\.com\/sicaboy\/opencode-notifier\/main\/scripts\/install\.sh \| bash/, "Chinese README should document one-line install")

assert.match(banner, /opencode-notifier/, "banner should include project title")
assert.doesNotMatch(banner, /Notify<\//, "banner should not include right-side label text")

console.log("All repository checks passed.")
