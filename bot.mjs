import { setTimeout as delay } from 'node:timers/promises';
const url = process.env.STORE_URL || 'https://studio4vii-hub.github.io/-UGG-EN-STORE/';
const token = process.env.TELEGRAM_BOT_TOKEN;
const controller = new AbortController();
process.once('SIGTERM', () => controller.abort());
process.once('SIGINT', () => controller.abort());
class ApiError extends Error { constructor(code, retryAfter = 0) { super('Telegram API error ' + code); this.code = code; this.retryAfter = retryAfter; } }
async function api(method, body = {}) {
  const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(method === 'getUpdates' ? 65000 : 20000)]);
  let response;
  try { response = await fetch('https://api.telegram.org/bot' + token + '/' + method, { method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify(body), signal }); }
  catch { throw new Error('Telegram connection failed.'); }
  let data;
  try { data = await response.json(); } catch { throw new Error('Invalid Telegram response.'); }
  if (!response.ok || !data.ok) throw new ApiError(Number(data.error_code) || response.status, Number(data.parameters?.retry_after) || 0);
  return data.result;
}
function replyFor(update, since) {
  const m = update?.message;
  if (!m || m.chat?.type !== 'private' || m.from?.is_bot || typeof m.text !== 'string' || !Number.isSafeInteger(m.chat.id) || !Number.isFinite(m.date) || m.date < since) return null;
  if (!m.entities?.some(e => e.type === 'bot_command' && e.offset === 0)) return null;
  const command = /^\/(start|help|shop)(?:@([a-z0-9_]+))?(?:\s|$)/i.exec(m.text);
  if (!command || (command[2] && command[2].toLowerCase() !== 'ugg_store_bot')) return null;
  const welcome = 'Welcome to UGG Store!\n\nExplore boots, clogs and slippers, discover your favorite colors and save pairs to your bag.\n\nTap Shop to open the collection.\n\nPrices and availability require confirmation. Inquiries in the store are local drafts and are not sent automatically.';
  const help = 'Tap Shop to browse the collection, choose a color and size, and save pairs to your bag.\n\nUse /shop to open the store or /start for the welcome message.\n\nInquiries are local drafts only. Orders and payments are not connected yet.';
  return { chat_id: m.chat.id, text: command[1].toLowerCase() === 'help' ? help : welcome, reply_markup: {inline_keyboard: [[{text: 'Shop', web_app: {url}}]]} };
}
async function main() {
  if (!token || !/^\d+:[a-zA-Z0-9_-]+$/.test(token)) throw new Error('Set TELEGRAM_BOT_TOKEN in Railway Variables.');
  const parsed = new URL(url);
  if (parsed.protocol !== 'https:' || parsed.username || parsed.password) throw new Error('STORE_URL must be an HTTPS URL without credentials.');
  const since = Math.floor(Date.now() / 1000);
  const me = await api('getMe');
  if (me?.username?.toLowerCase() !== 'ugg_store_bot') throw new Error('This token belongs to a different bot.');
  if ((await api('getWebhookInfo'))?.url) throw new Error('An existing webhook is active. Review the previous service first.');
  console.log('UGG Store bot is running. Send a new /start in Telegram.');
  let offset = 0, failures = 0;
  while (!controller.signal.aborted) {
    try {
      const updates = await api('getUpdates', {offset, timeout: 50, allowed_updates: ['message']});
      if (!Array.isArray(updates)) throw new Error('Invalid update batch.');
      for (const update of updates) {
        if (controller.signal.aborted) break;
        if (!Number.isSafeInteger(update.update_id) || update.update_id < offset) continue;
        const reply = replyFor(update, since);
        if (reply) {
          try { await api('sendMessage', reply); }
          catch (error) { if (![400,403].includes(error.code)) throw error; console.log('A reply could not be delivered; continuing.'); }
        }
        offset = update.update_id + 1;
      }
      failures = 0;
    } catch (error) {
      if (controller.signal.aborted) break;
      if ([401,404,409].includes(error.code)) throw new Error(error.code === 409 ? 'Another bot instance is active. Run only one instance.' : 'Telegram rejected the bot credentials.');
      const seconds = Math.min(300, Math.max(error.retryAfter || 0, Math.min(30, 2 ** Math.min(++failures,5))));
      console.log('Telegram request failed. Retrying in ' + seconds + 's.');
      try { await delay(seconds * 1000, undefined, {signal: controller.signal}); } catch { break; }
    }
  }
}
main().catch(error => { if (!controller.signal.aborted) { console.error(error.message); process.exitCode = 1; } });
