const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")
const archiver = require("archiver")

const BUILD_VERSION = process.env.BUILD_VERSION || "002"

const ROOT = path.resolve(__dirname, "..")

const TAURI_BUILD = path.join(
  ROOT,
  "desktop",
  "tauri",
  "src-tauri",
  "target",
  "release",
  "BC-SGM.exe"
)

const RELEASE_DIR = path.join(ROOT, "release")
const PACKAGE_DIR = path.join(RELEASE_DIR, `BC-SGM_BUILD_${BUILD_VERSION}`)

console.log("=== BC-SGM RELEASE PIPELINE ===")

console.log("Running Tauri build...")

execSync("npm run tauri build", { stdio: "inherit" })

if (fs.existsSync(PACKAGE_DIR)) {
  fs.rmSync(PACKAGE_DIR, { recursive: true })
}

fs.mkdirSync(PACKAGE_DIR, { recursive: true })

console.log("Copying executable...")

fs.copyFileSync(
  TAURI_BUILD,
  path.join(PACKAGE_DIR, "BC-SGM.exe")
)

console.log("Copying resources...")

const RESOURCES_SRC = path.join(ROOT, "resources")
const RESOURCES_DST = path.join(PACKAGE_DIR, "resources")

fs.cpSync(RESOURCES_SRC, RESOURCES_DST, { recursive: true })

fs.copyFileSync(
  path.join(ROOT, "README_RELEASE.txt"),
  path.join(PACKAGE_DIR, "README.txt")
)

console.log("Generating ZIP package...")

const output = fs.createWriteStream(
  path.join(RELEASE_DIR, `BC-SGM_BUILD_${BUILD_VERSION}.zip`)
)

const archive = archiver("zip")

archive.pipe(output)
archive.directory(PACKAGE_DIR, false)

archive.finalize()

output.on("close", () => {
  console.log("Build package created successfully.")
})
