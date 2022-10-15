
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

const token = '5622031981:AAGMh__ve7y5LwoGt1wbT6DzVG9YdUUgIeE';

// const webAppUrl = 'https://djinni.co/my/inbox/'
const webAppUrl = 'https://reliable-sprinkles-880a82.netlify.app'

const bot = new TelegramBot(token, {polling: true});
const app = express();
app.use(express.json())
app.use(cors())

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  const text = msg.text;

  if (text === '/start') {
    await bot.sendMessage(chatId, 'Hi, there will be a button below. Fill in the form', {
      reply_markup: {
        keyboard: [
          [{text: 'Fill in the form',  web_app: {url: webAppUrl + '/form'}}]
        ]
      }
    });
    await bot.sendMessage(chatId, 'Go to the shop to make an order', {
      reply_markup: {
        inline_keyboard: [
          [{text: 'Make an order',  web_app: {url: webAppUrl}}]
        ]
      }
    });
  }
  if (msg) {
    console.log(msg);
    if (msg?.web_app_data?.data) {
      try {
        const data = JSON.parse(msg?.web_app_data?.data)
        await bot.sendMessage(chatId, 'Thanks for reply');
        await bot.sendMessage(chatId, 'Your country: ' + data?.country);
        await bot.sendMessage(chatId, 'Your street: ' + data?.street);

        setTimeout(async () => {
          await bot.sendMessage(chatId, 'All information you will get in this chat');
        }, 3000);
      } catch (error) {
          console.error(error);
      }

    }
  }

});

app.post('/web-data', async (req, res) => {
  const {queryId, products, totalPrice} = req.body;
  try {
    await bot.answerWebAppQuery(queryId, {
      type: 'article',
      id: queryId,
      title: 'Successful purchase',
      input_message_content: {
        message_text: 'Congratulation on successful purchase, you have bought products on sum' + totalPrice,
      }
    });
    return res.status(200).json({})
  } catch (error) {
    await bot.answerWebAppQuery(queryId, {
      type: 'article',
      id: queryId,
      title: 'Unsuccessful purchase(',
      input_message_content: {
        message_text: 'Unsuccessful purchase(',
      }
    });
    return res.status(500).json({})
  }

})


const PORT = 8000;
app.listen(PORT, () => console.log('server started on PORT ' + PORT))
