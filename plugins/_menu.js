const {
  addSpace,
  textToStylist,
  getUptime,
  getRam,
  getDate,
  getPlatform,
  bot,
  lang,
} = require('../lib/');

bot(
  {
    pattern: 'menu ?(.*)',
    dontAddCommandList: true,
  },
  async (message, match, ctx) => {
    const commands = {};

    // Group commands by their type
    ctx.commands.forEach((command) => {
      if (!command.dontAddCommandList && command.pattern !== undefined) {
        const type = command.type?.toLowerCase() || 'general';
        if (!commands[type]) commands[type] = [];

        const name = command.name?.trim();
        const isDisabled = command.active === false;
        commands[type].push(isDisabled ? `${name} [disabled]` : name);
      }
    });

    const sortedTypes = Object.keys(commands).sort();

    // Metadata
    const [date, time] = getDate();
    const weekday = date.toLocaleString('en', { weekday: 'long' });
    const dateStr = date.toLocaleDateString('hi');

    let msg = `╭━━━〔 *${ctx.PREFIX} MENU PANEL* 〕━━⬣
┃ 👤 *User:* ${message.pushName}
┃ 🕒 *Time:* ${time}
┃ 📅 *Date:* ${weekday}, ${dateStr}
┃ ⚙️ *Version:* ${ctx.VERSION}
┃ 🧩 *Plugins:* ${ctx.pluginsCount}
┃ 📦 *RAM:* ${getRam()}
┃ ⏱ *Uptime:* ${getUptime('t')}
┃ 💻 *Platform:* ${getPlatform()}
╰━━━━━━━━━━━━━━━━━━━━⬣\n`;

    // Show specific category if matched
    if (match && commands[match]) {
      msg += `\n╭─❏ *${textToStylist(match.toUpperCase(), 'smallcaps')}*\n`;
      commands[match]
        .sort((a, b) => a.localeCompare(b))
        .forEach((cmd) => {
          msg += `│ ✥ ${textToStylist(cmd.toUpperCase(), 'mono')}\n`;
        });
      msg += '╰────────────────────\n';
      return await message.send(msg);
    }

    // Display all categories
    for (const type of sortedTypes) {
      msg += `\n╭─❏ *${textToStylist(type.toUpperCase(), 'smallcaps')}*\n`;
      commands[type]
        .sort((a, b) => a.localeCompare(b))
        .forEach((cmd) => {
          msg += `│ ✥ ${textToStylist(cmd.toUpperCase(), 'mono')}\n`;
        });
      msg += '╰────────────────────\n';
    }

    msg += '\n🌟 Type `.menu groupname` to view only that category.\n'

    await message.send(msg.trim());
  }
);
