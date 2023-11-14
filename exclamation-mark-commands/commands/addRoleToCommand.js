const BaseCommand = require('../index')

class AddRoleToCommand extends BaseCommand {
  constructor() {
    super({
      name: 'AddRoleToCommand',
      description: 'Add a role to a command.',
      cooldown: 0
    })
  }

  execute(msg, args) {
    if (args.length < 2) {
      return msg.reply('Usage: !AddRoleToCommand <command> <role>')
    }

    const commandName = args[0].toLowerCase().replace('!', '')
    const roleName = args[1]

    const command = msg.client.commands.get(commandName)

    if (!command) {
      return msg.reply(`Command not found: ${commandName}.`)
    }

    if (command.requiredRoles.some((role) => role === roleName)) return msg.reply(`Role is present in !${commandName} permissions.`)

    const role = msg.guild.roles.cache.find(role => role.name === roleName)

    if (!role) return msg.reply(`Role not found: ${roleName}`)

    this.addToRequiredRoles(command, roleName)
    
    return msg.reply(`Role "${roleName}" added to command "${commandName}".`)
  }

  addToRequiredRoles(command, roleName) {
    command.requiredRoles.push(roleName)
    command.overwritePermissions(command.requiredRoles)
  }
}

module.exports = AddRoleToCommand