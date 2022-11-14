import { Composer, Context, InlineKeyboard } from "../deps.ts";
import isPrivate from "../hooks/isPrivate.ts";

const composer = new Composer();

export const message = (ctx: Context) =>
  `<b>Hurmatli ${ctx.from!.first_name}!</b> \n` +
  `\n` +
  `\n` +
  `Xinux distributivi haqida o'z fikringizni yozib qoldiring... ` +
  `Bizga o'z fikringizni yozib qoldirganingiz uchun o'z ` +
  `minnatdorchiligimizni bildiramiz. Ushbu fikr va kamchiliklar ` +
  `tez orada muhokama qilib bo'lishimiz bilanoq kuchga kiritishga ` +
  `harakat qilami!`;

export const keyboard = new InlineKeyboard().url(
  `Disskussiyaga o'tish`,
  `https://github.com/orgs/uzinfocom-org/discussions`,
);

composer.command("feedback", isPrivate, async (ctx: Context): Promise<void> => {
  await ctx.reply(message(ctx), {
    parse_mode: "HTML",
    reply_markup: keyboard,
  });
});

export default composer;
