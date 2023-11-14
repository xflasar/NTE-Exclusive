const fs = require('fs')

function overwritePermissionsFile(requiredRoles, fileName) {
  fs.writeFileSync(__dirname + `/commands/permissions/${fileName}.json`, JSON.stringify(requiredRoles))
}

function createPermissionsFile(fileName) {
  return fs.writeFileSync(__dirname + `/commands/permissions/${fileName}.json`, JSON.stringify([]))
}

function getPermissionsFile(fileName) {
  if (!fs.existsSync(__dirname + `/commands/permissions/${fileName}.json`)){
    const file = createPermissionsFile(fileName)
    if (!fs.existsSync(__dirname + `/commands/permissions/${fileName}.json`))
    {
      return JSON.parse(file)
    }
    return null
  }
  return JSON.parse(fs.readFileSync(__dirname + `/commands/permissions/${fileName}.json`))
}

module.exports = class BaseCommand {
  constructor(info) {
    this.name = info.name
    this.description = info.description
    this.examples = info.examples || []
    this.requiredRoles = getPermissionsFile(this.name)
    this.cooldown = info.cooldown || 0
    this.cooldowns = new Map()
  }

  execute(msg, args) {
    if (!this.checkRole(msg)) return
    if (this.isOnCooldown(msg.author.id)) {
      return msg.reply('Please wait before using this command again.')
    }
    
    this.setCooldown(msg.author.id)
  }

  setCooldown(userId) {
    this.cooldowns.set(userId, Date.now() + this.cooldown)
  }

  isOnCooldown(userId) {
    const cooldownExpiration = this.cooldowns.get(userId) || 0
    return Date.now() < cooldownExpiration
  }

  overwritePermissions(requiredRoles) {
    overwritePermissionsFile(requiredRoles, this.name)
  }
}