let ran = false

export async function runStartup() {
    if (ran) return
    ran = true

    const { createAdminUser } = require("./create-admin")
    await createAdminUser()
}
