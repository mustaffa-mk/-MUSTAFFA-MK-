/**
 * 𒋲⍟ᬼ⃟M💀⃝⃪U⛓ST۞༒A༒ FF⛓⍟ᬼ⃟A𒋲⍟ᬼ⃟MD💀⃝⃪V2🕷️™ Command Registry
 * All commands are registered here via addCommand()
 */

const commands = []

/**
 * Register a command
 * @param {object} options
 * @param {string}   options.pattern   - command name e.g. 'menu'
 * @param {string[]} options.alias     - aliases e.g. ['help','start']
 * @param {string}   options.desc      - description shown in menu
 * @param {string}   options.category  - category shown in menu
 * @param {string}   options.react     - emoji to react with when triggered
 * @param {boolean}  options.owner     - owner only
 * @param {boolean}  options.group     - group only
 * @param {function} options.function  - async (conn, mek, m, extras) => {}
 */
function addCommand(options) {
  commands.push(options)
}

module.exports = { commands, addCommand }
