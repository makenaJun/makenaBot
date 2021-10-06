const TelegramApi = require('node-telegram-bot-api');
const {keyForRestart, generateKeyForGame} = require("./modules/generatorsKeyboard/generateKeyForGame");

const token = '2051403434:AAGGYsqLduqYGkl078A7ERnQfsjrvud_UCQ';

const bot = new TelegramApi(token, {polling: true});

bot.setMyCommands([
    {command: '/start', description: 'Старт работы с ботом'},
    {command: '/info', description: 'Получить информацию о пользователе'},
    {command: '/game', description: 'Игра угадай число'}
])

const stateGame = {};

const startNewGame = async (chatId) => {
    await bot.sendMessage(chatId, "Я сейчас загадаю число от 0 до 9, а ты попробуй отгадать");
    const randomNum = Math.floor(Math.random() * 10);
    stateGame[chatId] = randomNum;
    await bot.sendMessage(chatId, 'Отгадывай', {
        reply_markup: {
            inline_keyboard: generateKeyForGame()
        }
    });
}

const start = () => {
    bot.on('message', async (msg) => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === "/start") {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.webp')
            return bot.sendMessage(chatId, `Добро пожаловать!`);
        }

        if (text === "/info") {
            return await bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}.`);
        }

        if (text === "/game") {
            return await startNewGame(chatId);
        }

        return await bot.sendMessage(chatId, "Я не понимаю, что ты хочешь!");
    })

    bot.on('callback_query', async (query) => {
            const chatId = query.message.chat.id;
            const {data} = query;

            if (data === "game_again") {
                return await startNewGame(chatId);
            }

            if (+data === stateGame[chatId]) {
                return await bot.sendMessage(chatId, `Ты отгадал я загадал число ${stateGame[chatId]}`, keyForRestart);
            } else {
                return await bot.sendMessage(chatId, `Неправильно! Я загадал число ${stateGame[chatId]}`, keyForRestart)
            }
        }
    )
}
start()
