// deno-lint-ignore-file no-explicit-any
import { reply } from "../utils/sender.ts";
import isReply from "../hooks/isReply.ts";
import topics from "../topics.json" assert { type: "json" };
import { Composer, Context, InlineKeyboard } from "../deps.ts";

const composer = new Composer();

type Topics = { [key: string]: number };

composer.command(
  "warn",
  isReply,
  async (ctx: Context): Promise<any> => {
    const registeredTopics: Topics = topics;
    const requestedTopic: string = typeof ctx.match === "string"
      ? ctx.match
      : ctx.match!.join(" ");

    console.log("Chosen topic:", requestedTopic);

    await ctx.api.deleteMessage(
      ctx.message!.chat!.id,
      ctx.message!.reply_to_message!.message_id,
    ).catch(() => {
      console.warn("Oh no... I couldn't delete the message!");
    });

    await ctx.api.deleteMessage(
      ctx.message!.chat!.id,
      ctx.message!.message_id,
    ).catch(() => {
      console.warn("Oh no... I couldn't delete the message!");
    });

    if (!Object.keys(topics).includes(requestedTopic)) {
      return await reply(
        ctx,
        `<b>Bunaqangi topic bizda borga o'xshamaydiyov... Bizda faqat ushbu topiclar mavjud:</b>` +
          `\n` + `<i>${Object.keys(registeredTopics).join(" | ")}</i>`,
      );
    }

    if (ctx?.message?.reply_to_message?.from?.id === ctx.me.id) {
      if (ctx.message) {
        return await reply(ctx, `Ha-ha... yaxshi urinish!`);
      }
    }

    const requestedTopicURL = registeredTopics[requestedTopic];

    const text =
      `<b>Hurmatli <a href="tg://user?id=${ctx?.message?.reply_to_message?.from?.id}">${ctx?.message?.reply_to_message?.from?.first_name}</a>,</b>` +
      `\n` +
      `\n` +
      `Tushunishim bo'yicha siz mavzudan chetlayashayabsiz. Iltimos, ` +
      `quyidagi tugmachani bosish orqali bizning ${requestedTopic} guruhga o'tib oling! ` +
      `${requestedTopic} guruhimizda ushbu mavzuda suhbatlashish ruxsat etiladi. Boshqalarga halaqit qilmayliga 😉` +
      `\n` +
      `\n` +
      `<b>Hurmat ila, Xeonitte (Kseyonita)</b>`;

    if (ctx.message!.is_topic_message) {
      await ctx.reply(text, {
        message_thread_id: ctx.message!.message_thread_id,
        parse_mode: "HTML",
        reply_markup: new InlineKeyboard().url(
          `${requestedTopic} Chat`,
          `https://t.me/xinuxuz/${requestedTopicURL}`,
        ),
      });
    } else {
      await ctx.reply(text, {
        parse_mode: "HTML",
        reply_markup: new InlineKeyboard().url(
          `${requestedTopic} Chat`,
          `https://t.me/xinuxuz/${requestedTopicURL}`,
        ),
      });
    }
  },
);

composer.command("doc", isReply, async (ctx: Context): Promise<void> => {
  if (ctx?.message?.reply_to_message?.from?.id === ctx.me.id) {
    await ctx.reply(`Ha-ha... yaxshi urinish!`, {
      parse_mode: "HTML",
    });
  } else {
    const text =
      `<b>Demak, <a href="tg://user?id=${ctx?.message?.reply_to_message?.from?.id}">${ctx?.message?.reply_to_message?.from?.first_name}</a>,</b>` +
      `\n` +
      `\n` +
      `<i>Bir bor ekan, bir yo'q ekan... Qadim o'tgan zamonlarda dokumentatsiya ` +
      `bo'lgan ekan. Aytishlariga qaraganda, undan deyarli hamma savollarga ` +
      `javob olsa bo'larkanda. Yanachi, unga avtorlar shunchalik ko'p vaqt ajratishar ` +
      `ekanu, lekin uni sanoqligina odam o'qisharkan. Attang...</i>`;

    if (ctx.message!.is_topic_message) {
      await ctx.reply(text, {
        message_thread_id: ctx.message!.message_thread_id,
        parse_mode: "HTML",
      });
    } else {
      await ctx.reply(text, {
        parse_mode: "HTML",
      });
    }
  }
});

export default composer;
