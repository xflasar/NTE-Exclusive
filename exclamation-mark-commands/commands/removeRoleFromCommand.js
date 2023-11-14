const BaseCommand = require('../index');

module.exports = class RemoveRoleFromCommand extends BaseCommand {
  constructor() {
    super({
      name: 'RemoveRoleFromCommand',
      description: 'Removes a role from a command',
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

    const role = msg.guild.roles.cache.find(role => role.name === roleName)

    if (!role) return msg.reply(`Role not found: ${roleName}`)

    
    this.removeFromRequiredRoles(command, roleName)
    
    return msg.reply(`Role "${roleName}" removed from command "${commandName}".`)
  }
  
  removeFromRequiredRoles(command, roleName) {
    command.requiredRoles = command.requiredRoles.filter(role => role !== roleName)
    command.overwritePermissions(command.requiredRoles)
  }
}