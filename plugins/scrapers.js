/* Copyright (C) 2020 Yusuf Usta.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
WhatsJulie - Yusuf Usta
*/

const Julie = require('../events');
const {MessageType,Mimetype} = require('@adiwajshing/baileys');
const translatte = require('translatte');
const config = require('../config');
const LanguageDetect = require('languagedetect');
const lngDetector = new LanguageDetect();
const Heroku = require('heroku-client');
const heroku = new Heroku({
    token: config.HEROKU.API_KEY
});
let baseURI = '/apps/' + config.HEROKU.APP_NAME;
//============================== LYRICS =============================================
const axios = require('axios');
const { requestLyricsFor, requestAuthorFor, requestTitleFor, requestIconFor } = require("solenolyrics");
const solenolyrics= require("solenolyrics"); 
//============================== CURRENCY =============================================
const { exchangeRates } = require('exchange-rates-api');
const ExchangeRatesError = require('exchange-rates-api/src/exchange-rates-error.js')
//============================== TTS ==================================================
const fs = require('fs');
const https = require('https');
const googleTTS = require('google-translate-tts');
//=====================================================================================
//============================== YOUTUBE ==============================================
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const yts = require( 'yt-search' )
const got = require("got");
const ID3Writer = require('browser-id3-writer');
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: 'acc6302297e040aeb6e4ac1fbdfd62c3',
    clientSecret: '0e8439a1280a43aba9a5bc0a16f3f009'
});
//=====================================================================================
const Language = require('../language');
const Lang = Language.getString('scrapers');
const Glang = Language.getString('github');
const Slang = Language.getString('lyrics');
const Clang = Language.getString('covid');

const wiki = require('wikijs').default;
var gis = require('g-i-s');

var dlang_dsc = ''
var closer_res = ''
var dlang_lang = ''
var dlang_similarity = ''
var dlang_other = ''
var dlang_input = ''

if (config.LANG == 'TR') {
    dlang_dsc = 'Yan??tlanan mesaj??n dilini tahmin eder.'
    closer_res = 'En Yak??n Sonu??:'
    dlang_lang = 'Dil:'
    dlang_similarity = 'Benzerlik:'
    dlang_other = 'Di??er Diller'
    dlang_input = '????lenen Metin:'
}
if (config.LANG == 'EN') {
    dlang_dsc = 'Guess the language of the replied message.'
    closer_res = 'Closest Result:'
    dlang_lang = 'Language:'
    dlang_similarity = 'Similarity:'
    dlang_other = 'Other Languages'
    dlang_input = 'Processed Text:'
}
if (config.LANG == 'AZ') {
    dlang_dsc = 'Cavablanan mesaj??n dilini t??xmin edin.'
    closer_res = '??n yax??n n??tic??:'
    dlang_lang = 'Dil:'
    dlang_similarity = 'B??nz??rlik:'
    dlang_other = 'Ba??qa Dill??r'
    dlang_input = '????l??nmi?? M??tn:'
}
if (config.LANG == 'ML') {
    dlang_dsc = '?????????????????? ??????????????? ?????????????????????????????????????????? ????????? ess ?????????????????????.'
    closer_res = '????????????????????? ?????????????????? ?????????:'
    dlang_lang = '????????????:'
    dlang_similarity = '???????????????:'
    dlang_other = '??????????????? ???????????????'
    dlang_input = '??????????????????????????? ??????????????? ???????????????:'
}
if (config.LANG == 'HI') {
    dlang_dsc = '??????????????? ????????? ?????? ??????????????? ?????? ???????????? ?????? ?????????????????? ???????????????'
    closer_res = '?????????????????? ??????????????????:'
    dlang_lang = '???????????????:'
    dlang_similarity = '??????????????????:'
    dlang_other = '???????????? ??????????????????'
    dlang_input = '????????????????????? ?????????:'
}
if (config.LANG == 'ES') {
    dlang_dsc = 'Adivina el idioma del mensaje respondido.'
    closer_res = 'Resultado m??s cercano:'
    dlang_lang = 'Lengua:'
    dlang_similarity = 'Semejanza:'
    dlang_other = 'Otros idiomas:'
    dlang_input = 'Texto procesado:'
}
if (config.LANG == 'PT') {
    dlang_dsc = 'Adivinhe o idioma da mensagem respondida.'
    closer_res = 'Resultado mais pr??ximo:'
    dlang_lang = 'L??ngua:'
    dlang_similarity = 'Similaridade:'
    dlang_other = 'Outras l??nguas'
    dlang_input = 'Texto Processado:'
}
if (config.LANG == 'ID') {
    dlang_dsc = 'Tebak bahasa pesan yang dibalas.'
    closer_res = 'Hasil Terdekat:'
    dlang_lang = 'Lidah:'
    dlang_similarity = 'Kesamaan:'
    dlang_other = 'Bahasa Lainnya'
    dlang_input = 'Teks yang Diproses:'
}
if (config.LANG == 'RU') {
    dlang_dsc = '???????????? ???????? ?????????????????? ??????????????????.'
    closer_res = '?????????????????? ??????????????????:'
    dlang_lang = '????????:'
    dlang_similarity = '??????????????o:'
    dlang_other = '???????????? ??????????'
    dlang_input = '???????????????????????? ??????????:'
}


if (config.WORKTYPE == 'private') {

    Julie.addCommand({pattern: 'trt(?: |$)(\\S*) ?(\\S*)', desc: Lang.TRANSLATE_DESC, usage: Lang.TRANSLATE_USAGE, fromMe: true}, (async (message, match) => {

        if (!message.reply_message) {
            return await message.client.sendMessage(message.jid,Lang.NEED_REPLY,MessageType.text);
        }

        ceviri = await translatte(message.reply_message.message, {from: match[1] === '' ? 'auto' : match[1], to: match[2] === '' ? config.LANG : match[2]});
        if ('text' in ceviri) {
            return await message.reply('*?????? ' + Lang.LANG + ':* ```' + (match[1] === '' ? 'auto' : match[1]) + '```\n'
            + '*?????? ' + Lang.FROM + '*: ```' + (match[2] === '' ? config.LANG : match[2]) + '```\n'
            + '*???? ' + Lang.RESULT + ':* ```' + ceviri.text + '```');
        } else {
            return await message.client.sendMessage(message.jid,Lang.TRANSLATE_ERROR,MessageType.text)
        }
    }));
    var l_dsc = ''
    var alr_on = ''
    var alr_off = ''
    var succ_on = ''
    var succ_off = ''
    if (config.LANG == 'TR') {
        l_dsc = 'Antilink arac??n?? etkinle??tirir.'
        alr_on = 'Antilink halihaz??rda a????k!'
        alr_off = 'Antilink halihaz??rda kapal??!'
        succ_on = 'Antilink Ba??ar??yla A????ld??!'
        succ_off = 'Antilink Ba??ar??yla Kapat??ld??!'
    }
    if (config.LANG == 'EN') {
        l_dsc = 'Activates the Antilink tool.'
        alr_on = 'Antilink is already open!'
        alr_off = 'Antilink is currently closed!'
        succ_on = 'Antilink Opened Successfully!'
        succ_off = 'Antilink Closed Successfully!'
    }
    if (config.LANG == 'AZ') {
        l_dsc = 'Antilink al??tini aktivl????dirir.'
        alr_on = 'Antilink haz??rda a????qd??r!'
        alr_off = 'Antilink haz??rda ba??l??d??r!'
        succ_on = 'Antilink U??urla A????ld??!'
        succ_off = 'Antilink U??urla Ba??land??!'
    }
    if (config.LANG == 'HI') {
        l_dsc = '???????????????????????? ????????? ?????? ?????????????????? ???????????? ?????????'
        alr_on = '???????????????????????? ???????????? ?????? ?????? ???????????? ??????!'
        alr_off = '???????????????????????? ????????????????????? ????????? ????????? ??????!'
        succ_on = '???????????????????????? ????????????????????????????????? ???????????? ?????????!'
        succ_off = '???????????????????????? ????????????????????????????????? ?????????!'
    }
    if (config.LANG == 'ML') {
        l_dsc = '????????????????????????????????? ?????????????????? ??????????????????????????????????????????.'
        alr_on = '????????????????????????????????? ?????????????????? ?????????????????????!'
        alr_off = '????????????????????????????????? ?????????????????? ????????????????????????????????????????????????!'
        succ_on = '????????????????????????????????? ?????????????????????????????? ?????????????????????!'
        succ_off = '????????????????????????????????? ?????????????????????????????? ??????????????????!'
    }
    if (config.LANG == 'PT') {
        l_dsc = 'Ativa a ferramenta Antilink.'
        alr_on = 'O Antilink j?? est?? aberto!'
        alr_off = 'Antilink est?? fechado no momento!'
        succ_on = 'Antilink aberto com sucesso!'
        succ_off = 'Antilink fechado com sucesso!'
    }
    if (config.LANG == 'RU') {
        l_dsc = '???????????????????? ???????????????????? Antilink.'
        alr_on = '???????????????? ?????? ????????????!'
        alr_off = '???????????????? ???????????? ????????????!'
        succ_on = '???????????????? ?????????????? ????????????!'
        succ_off = '???????????????? ?????????????? ????????????!'
    }
    if (config.LANG == 'ES') {
        l_dsc = 'Activa la herramienta Antilink.'
        alr_on = '??Antilink ya est?? abierto!'
        alr_off = '??Antilink est?? cerrado actualmente!'
        succ_on = '??Antilink se abri?? con ??xito!'
        succ_off = 'Antilink cerrado correctamente!'
    }
    if (config.LANG == 'ID') {
        l_dsc = 'Mengaktifkan alat Antilink.'
        alr_on = 'Antilink sudah terbuka!'
        alr_off = 'Antilink saat ini ditutup!'
        succ_on = 'Antilink Berhasil Dibuka!'
        succ_off = 'Antilink Berhasil Ditutup!'
    }
    Julie.addCommand({pattern: 'antilink ?(.*)', fromMe: true, desc: l_dsc, usage: '.antilink on / off' }, (async (message, match) => {
        const anti_status = `${config.ANT??L??NK}`
        if (match[1] == 'on') {
            if (anti_status == 'true') {
                return await message.client.sendMessage(message.jid, '*' + alr_on + '*', MessageType.text)
            }
            else {
                await heroku.patch(baseURI + '/config-vars', { 
                    body: { 
                        ['ANT??_L??NK']: 'true'
                    } 
                });
                await message.client.sendMessage(message.jid, '*' + succ_on + '*', MessageType.text)
            }
        }
        else if (match[1] == 'off') {
            if (anti_status !== 'true') {
                return await message.client.sendMessage(message.jid, '*' + alr_off + '*', MessageType.text)
            }
            else {
                await heroku.patch(baseURI + '/config-vars', { 
                    body: { 
                        ['ANT??_L??NK']: 'false'
                    } 
                });
                await message.client.sendMessage(message.jid, '*' + succ_off + '*', MessageType.text)
            }
        }
    }));
    var auto_dsc = ''
    var alr_on_bio = ''
    var alr_off_bio = ''
    var succ_on_bio = ''
    var succ_off_bio = ''
    if (config.LANG == 'TR') {
        auto_dsc = 'Biyografinize canl?? saat ekleyin!'
        alr_on_bio = 'Autobio halihaz??rda a????k!'
        alr_off_bio = 'Autobio halihaz??rda kapal??!'
        succ_on_bio = 'Autobio Ba??ar??yla A????ld??!'
        succ_off_bio = 'Autobio Ba??ar??yla Kapat??ld??!'
    }
    if (config.LANG == 'EN') {
        auto_dsc = 'Add live clock to your bio!'
        alr_on_bio = 'Autobio is already open!'
        alr_off_bio = 'Autobio is currently closed!'
        succ_on_bio = 'Autobio Opened Successfully!'
        succ_off_bio = 'Autobio Closed Successfully!'
    }
    if (config.LANG == 'AZ') {
        auto_dsc = 'Bio-ya canl?? saat ??lav?? et!'
        alr_on_bio = 'Autobio haz??rda a????qd??r!'
        alr_off_bio = 'Autobio haz??rda ba??l??d??r!'
        succ_on_bio = 'Autobio U??urla A????ld??!'
        succ_off_bio = 'Autobio U??urla Ba??land??!'
    }
    if (config.LANG == 'HI') {
        auto_dsc = '???????????? ???????????? ????????? ???????????? ???????????? ??????????????????!'
        alr_on_bio = 'Autobio ???????????? ?????? ?????? ???????????? ??????!'
        alr_off_bio = 'Autobio ????????????????????? ????????? ????????? ??????!'
        succ_on_bio = 'Autobio ????????????????????????????????? ???????????? ?????????!'
        succ_off_bio = 'Autobio ????????????????????????????????? ?????????!'
    }
    if (config.LANG == 'ML') {
        auto_dsc = '??????????????????????????? ????????????????????????????????? ?????????????????? ???????????????????????? ????????????????????????!'
        alr_on_bio = 'Autobio ?????????????????? ?????????????????????!'
        alr_off_bio = 'Autobio ?????????????????? ????????????????????????????????????????????????!'
        succ_on_bio = 'Autobio ?????????????????????????????? ?????????????????????!'
        succ_off_bio = 'Autobio ?????????????????????????????? ??????????????????!'
    }
    if (config.LANG == 'PT') {
        auto_dsc = 'Adicione um rel??gio ao vivo ?? sua biografia!'
        alr_on_bio = 'O Autobio j?? est?? aberto!'
        alr_off_bio = 'Autobio est?? fechado no momento!'
        succ_on_bio = 'Autobio aberto com sucesso!'
        succ_off_bio = 'Autobio fechado com sucesso!'
    }
    if (config.LANG == 'RU') {
        auto_dsc = '???????????????? ?????????? ???????? ?? ???????? ??????????????????!'
        alr_on_bio = 'Autobio ?????? ????????????!'
        alr_off_bio = 'Autobio ???????????? ????????????!'
        succ_on_bio = 'Autobio ?????????????? ????????????!'
        succ_off_bio = 'Autobio ?????????????? ????????????!'
    }
    if (config.LANG == 'ES') {
        auto_dsc = '??Agrega un reloj en vivo a tu biograf??a!'
        alr_on_bio = '??Autobio ya est?? abierto!'
        alr_off_bio = '??Autobio est?? cerrado actualmente!'
        succ_on_bio = '??Autobio se abri?? con ??xito!'
        succ_off_bio = 'Autobio cerrado correctamente!'
    }
    if (config.LANG == 'ID') {
        auto_dsc = 'Tambahkan jam langsung ke bio Anda!'
        alr_on_bio = 'Autobio sudah terbuka!'
        alr_off_bio = 'Autobio saat ini ditutup!'
        succ_on_bio = 'Autobio Berhasil Dibuka!'
        succ_off_bio = 'Autobio Berhasil Ditutup!'
    }
    Julie.addCommand({pattern: 'autobio ?(.*)', fromMe: true, desc: auto_dsc, usage: '.autobio on / off' }, (async (message, match) => {
        const bio_status = `${config.AUTOB??O}`
        if (match[1] == 'on') {
            if (bio_status == 'true') {
                return await message.client.sendMessage(message.jid, '*' + alr_on_bio + '*', MessageType.text)
            }
            else {
                await heroku.patch(baseURI + '/config-vars', { 
                    body: { 
                        ['AUTO_B??O']: 'true'
                    } 
                });
                await message.client.sendMessage(message.jid, '*' + succ_on_bio + '*', MessageType.text)
            }
        }
        else if (match[1] == 'off') {
            if (bio_status !== 'true') {
                return await message.client.sendMessage(message.jid, '*' + alr_off_bio + '*', MessageType.text)
            }
            else {
                await heroku.patch(baseURI + '/config-vars', { 
                    body: { 
                        ['AUTO_B??O']: 'false'
                    } 
                });
                await message.client.sendMessage(message.jid, '*' + succ_off_bio + '*', MessageType.text)
            }
        }
    }));
    Julie.addCommand({pattern: 'detectlang$', fromMe: true, desc: dlang_dsc}, (async (message, match) => {

        if (!message.reply_message) return await message.client.sendMessage(message.jid,Lang.NEED_REPLY, MessageType.text)
        const msg = message.reply_message.text
        var ldet = lngDetector.detect(msg)
        async function upperfirstLetter(letter) {
            return letter.charAt(0).toUpperCase() + letter.slice(1).toLowerCase();
        }
        var cls1 = await upperfirstLetter(ldet[0][0])
        var cls2 = ldet[0][1].toString()
        var cls3 = await upperfirstLetter(ldet[1][0])
        var cls4 = ldet[1][1].toString()
        var cls5 = await upperfirstLetter(ldet[2][0])
        var cls6 = ldet[2][1].toString()
        var cls7 = await upperfirstLetter(ldet[3][0])
        var cls8 = ldet[3][1].toString()
        const res_1 = '*' + dlang_input + '* ' + '_' + msg + '_ \n'
        const res_2 = '*' + closer_res + '* ' + '_' + cls1 + '_\n*' + dlang_similarity + '* ' + '_' + cls2 + '_ \n\n'
        const res_3 = '```[ ' + dlang_other + ' ]```\n\n'
        const res_4 = '#2 *' + dlang_lang + '* ' + '_' + cls3 + '_\n*' + dlang_similarity + '* ' + '_' + cls4 + '_ \n'
        const res_5 = '#3 *' + dlang_lang + '* ' + '_' + cls5 + '_\n*' + dlang_similarity + '* ' + '_' + cls6 + '_ \n'
        const res_6 = '#4 *' + dlang_lang + '* ' + '_' + cls7 + '_\n*' + dlang_similarity + '* ' + '_' + cls8 + '_'
        const rep_7 = res_1 + res_2 + res_3 + res_4 + res_5 + res_6
        await message.client.sendMessage(message.jid,rep_7,MessageType.text);
    }));
    Julie.addCommand({pattern: 'currency(?: ([0-9.]+) ([a-zA-Z]+) ([a-zA-Z]+)|$|(.*))', fromMe: true}, (async (message, match) => {

        if(match[1] === undefined || match[2] == undefined || match[3] == undefined) {
            return await message.client.sendMessage(message.jid,Lang.CURRENCY_ERROR,MessageType.text);
        }
        let opts = {
            amount: parseFloat(match[1]).toFixed(2).replace(/\.0+$/,''),
            from: match[2].toUpperCase(),
            to: match[3].toUpperCase()
        }
        try {
            result = await exchangeRates().latest().symbols([opts.to]).base(opts.from).fetch()
            result = parseFloat(result).toFixed(2).replace(/\.0+$/,'')
            await message.reply(`\`\`\`${opts.amount} ${opts.from} = ${result} ${opts.to}\`\`\``)
        }
        catch(err) {
            if (err instanceof ExchangeRatesError) 
                await message.client.sendMessage(message.jid,Lang.INVALID_CURRENCY,MessageType.text)
            else {
                await message.client.sendMessage(message.jid,Lang.UNKNOWN_ERROR,MessageType.text)
                console.log(err)
            }
        }
    }));

    if (config.LANG == 'TR' || config.LANG == 'AZ') {

        Julie.addCommand({pattern: 'tts (.*)', fromMe: true, desc: Lang.TTS_DESC}, (async (message, match) => {

            if(match[1] === undefined || match[1] == "")
                return;
    
            let 
                LANG = 'tr',
                ttsMessage = match[1],
                SPEED = 1.0

            if(langMatch = match[1].match("\\{([a-z]{2})\\}")) {
                LANG = langMatch[1]
                ttsMessage = ttsMessage.replace(langMatch[0], "")
            } 
            if(speedMatch = match[1].match("\\{([0].[0-9]+)\\}")) {
                SPEED = parseFloat(speedMatch[1])
                ttsMessage = ttsMessage.replace(speedMatch[0], "")
            }
    
            var buffer = await googleTTS.synthesize({
                text: ttsMessage,
                voice: LANG
            });
            await message.client.sendMessage(message.jid,buffer, MessageType.audio, {mimetype: Mimetype.mp4Audio, ptt: true});
        }));
    }
    else {
        Julie.addCommand({pattern: 'tts (.*)', fromMe: true, desc: Lang.TTS_DESC}, (async (message, match) => {

            if(match[1] === undefined || match[1] == "")
                return;
    
            let 
                LANG = 'ml',
                ttsMessage = match[1],
                SPEED = 1.0

            if(langMatch = match[1].match("\\{([a-z]{2})\\}")) {
                LANG = langMatch[1]
                ttsMessage = ttsMessage.replace(langMatch[0], "")
            } 
            if(speedMatch = match[1].match("\\{([0].[0-9]+)\\}")) {
                SPEED = parseFloat(speedMatch[1])
                ttsMessage = ttsMessage.replace(speedMatch[0], "")
            }
    
            var buffer = await googleTTS.synthesize({
                text: ttsMessage,
                voice: LANG
            });
            await message.client.sendMessage(message.jid,buffer, MessageType.audio, {mimetype: Mimetype.mp4Audio, ptt: true});
        }));
    }
    Julie.addCommand({pattern: 'song ?(.*)', fromMe: true, desc: Lang.SONG_DESC}, (async (message, match) => { 

        if (match[1] === '') return await message.client.sendMessage(message.jid,Lang.NEED_TEXT_SONG,MessageType.text);    
        let arama = await yts(match[1]);
        arama = arama.all;
        if(arama.length < 1) return await message.client.sendMessage(message.jid,Lang.NO_RESULT,MessageType.text);
        var reply = await message.client.sendMessage(message.jid,Lang.DOWNLOADING_SONG,MessageType.text);

        let title = arama[0].title.replace(' ', '+');
        let stream = ytdl(arama[0].videoId, {
            quality: 'highestaudio',
        });
    
        got.stream(arama[0].image).pipe(fs.createWriteStream(title + '.jpg'));
        ffmpeg(stream)
            .audioBitrate(320)
            .save('./' + title + '.mp3')
            .on('end', async () => {
                const writer = new ID3Writer(fs.readFileSync('./' + title + '.mp3'));
                writer.setFrame('TIT2', arama[0].title)
                    .setFrame('TPE1', [arama[0].author.name])
                    .setFrame('APIC', {
                        type: 3,
                        data: fs.readFileSync(title + '.jpg'),
                        description: arama[0].description
                    });
                writer.addTag();

                reply = await message.client.sendMessage(message.jid,Lang.UPLOADING_SONG,MessageType.text);
                await message.client.sendMessage(message.jid,Buffer.from(writer.arrayBuffer), MessageType.audio, {mimetype: Mimetype.mp4Audio, quoted: message.data, ptt: false});
            });
    }));
    Julie.addCommand({pattern: 'video ?(.*)', fromMe: true, desc: Lang.VIDEO_DESC}, (async (message, match) => { 

        if (match[1] === '') return await message.client.sendMessage(message.jid,Lang.NEED_VIDEO,MessageType.text);    
    
        var VID = '';
        try {
            if (match[1].includes('watch')) {
                var tsts = match[1].replace('watch?v=', '')
                var alal = tsts.split('/')[3]
                VID = alal
            } else {     
                VID = match[1].split('/')[3]
            }
        } catch {
            return await message.client.sendMessage(message.jid,Lang.NO_RESULT,MessageType.text);
        }
        var reply = await message.client.sendMessage(message.jid,Lang.DOWNLOADING_VIDEO,MessageType.text);

        var yt = ytdl(VID, {filter: format => format.container === 'mp4' && ['720p', '480p', '360p', '240p', '144p'].map(() => true)});
        yt.pipe(fs.createWriteStream('./' + VID + '.mp4'));

        yt.on('end', async () => {
            reply = await message.client.sendMessage(message.jid,Lang.UPLOADING_VIDEO,MessageType.text);
            await message.client.sendMessage(message.jid,fs.readFileSync('./' + VID + '.mp4'), MessageType.video, {mimetype: Mimetype.mp4});
        });
    }));

    Julie.addCommand({pattern: 'yt ?(.*)', fromMe: true, desc: Lang.YT_DESC}, (async (message, match) => { 

        if (match[1] === '') return await message.client.sendMessage(message.jid,Lang.NEED_WORDS,MessageType.text);    
        var reply = await message.client.sendMessage(message.jid,Lang.GETTING_VIDEOS,MessageType.text);

        try {
            var arama = await yts(match[1]);
        } catch {
            return await message.client.sendMessage(message.jid,Lang.NOT_FOUND,MessageType.text);
        }
    
        var mesaj = '';
        arama.all.map((video) => {
            mesaj += '*' + video.title + '* - ' + video.url + '\n'
        });

        await message.client.sendMessage(message.jid,mesaj,MessageType.text);
        await reply.delete();
    }));

    Julie.addCommand({pattern: 'wiki ?(.*)', fromMe: true, desc: Lang.WIKI_DESC}, (async (message, match) => { 

        if (match[1] === '') return await message.client.sendMessage(message.jid,Lang.NEED_WORDS,MessageType.text);    
        var reply = await message.client.sendMessage(message.jid,Lang.SEARCHING,MessageType.text);

        var arama = await wiki({ apiUrl: 'https://' + config.LANG + '.wikipedia.org/w/api.php' })
            .page(match[1]);

        var info = await arama.rawContent();
        await message.client.sendMessage(message.jid, info, MessageType.text);
        await reply.delete();
    }));

    Julie.addCommand({pattern: 'img ?(.*)', fromMe: true, desc: Lang.IMG_DESC}, (async (message, match) => { 

        if (match[1] === '') return await message.client.sendMessage(message.jid,Lang.NEED_WORDS,MessageType.text);
        gis(match[1], async (error, result) => {
            for (var i = 0; i < (result.length < 5 ? result.length : 5); i++) {
                var get = got(result[i].url, {https: {rejectUnauthorized: false}});
                var stream = get.buffer();
                
                stream.then(async (image) => {
                    await message.client.sendMessage(message.jid,image, MessageType.image);
                });
            }

            message.reply(Lang.IMG.format((result.length < 5 ? result.length : 5), match[1]));
        });
    }));

    Julie.addCommand({ pattern: 'github ?(.*)', fromMe: true, desc: Glang.G??THUB_DESC }, async (message, match) => {

        const userName = match[1]
 
        if (userName === '') return await message.client.sendMessage(message.jid, Glang.REPLY, MessageType.text)

        await axios
          .get(`https://videfikri.com/api/github/?username=${userName}`)
          .then(async (response) => {

            const {
              hireable,
              company,
              profile_pic,
              username,
              fullname, 
              blog, 
              location,
              email,
              public_repository,
              biografi,
              following,
              followers,
              public_gists,
              profile_url,
              last_updated,
              joined_on,
            } = response.data.result

            const githubscrap = await axios.get(profile_pic, 
              {responseType: 'arraybuffer',
            })

            const msg = `*${Glang.USERNAME}* ${username} \n*${Glang.NAME}* ${fullname} \n*${Glang.FOLLOWERS}* ${followers} \n*${Glang.FOLLOW??NG}* ${following} \n*${Glang.B??O}* ${biografi} \n*${Glang.REPO}* ${public_repository} \n*${Glang.G??ST}* ${public_gists} \n*${Glang.LOCAT??ON}* ${location} \n*${Glang.MA??L}* ${email} \n*${Glang.BLOG}* ${blog} \n*${Glang.COMPANY}* ${company} \n*${Glang.H??RE}* ${hireable === "true" ? Glang.H??RE_TRUE : Glang.H??RE_FALSE} \n*${Glang.JO??N}* ${joined_on} \n*${Glang.UPDATE}* ${last_updated} \n*${Glang.URL}* ${profile_url}`

            await message.sendMessage(Buffer.from(githubscrap.data), MessageType.image, { 
              caption: msg,
            })
          })
          .catch(
            async (err) => await message.client.sendMessage(message.jid, Glang.NOT, MessageType.text),
          )
      },
    )

    Julie.addCommand({pattern: 'lyric ?(.*)', fromMe: true, desc: Slang.LY_DESC }, (async (message, match) => { 

        if (match[1] === '') return await message.client.sendMessage(message.jid, Slang.NEED, MessageType.text);

        var aut = await solenolyrics.requestLyricsFor(`${match[1]}`); 
        var son = await solenolyrics.requestAuthorFor(`${match[1]}`);
        var cov = await solenolyrics.requestIconFor(`${match[1]}`);
        var tit = await solenolyrics.requestTitleFor(`${match[1]}`);

        var buffer = await axios.get(cov, {responseType: 'arraybuffer'});

        await message.client.sendMessage(message.jid, Buffer.from(buffer.data),  MessageType.image, {caption: `*${Slang.ARAT}* ` + '```' + `${match[1]}` + '```' + `\n*${Slang.BUL}* ` + '```' + tit + '```' + `\n*${Slang.AUT}* ` + '```' + son + '```' + `\n*${Slang.SLY}*\n\n` + aut });

    }));

    Julie.addCommand({pattern: "covid ?(.*)", fromMe: true, desc: Clang.COV_DESC}, (async (message, match) => {
        if (match[1] === "") {
            try{
                //const resp = await fetch("https://coronavirus-19-api.herokuapp.com/all").then(r => r.json());
                const respo = await got("https://coronavirus-19-api.herokuapp.com/all").then(async ok => {
                    const resp = JSON.parse(ok.body);
                    await message.reply(`???? *World-Wide Results:*\n???? *Total Cases:* ${resp.cases}\n?????? *Total Deaths:* ${resp.deaths}\n?????? *Total Recovered:* ${resp.recovered}`);
 
                });

            } catch (err) {
                await message.reply(`Error :\n${err.message}`, MessageType.text)
            }

        }
        else if (match[1] === "tr" || match[1] === "Tr" || match[1] === "TR" || match[1].includes('turkiye') || match[1].includes('t??rkiye') || match[1].includes('t??rk') ) {
            try{
                const respo = await got("https://coronavirus-19-api.herokuapp.com/countries/Turkey").then(async ok  => {
                    resp = JSON.parse(ok.body);
                    await message.reply(`???????? *T??rkiye ????in Sonu??lar:*\n???? *Toplam Vaka:* ${resp.cases}\n???? *G??nl??k Hasta:* ${resp.todayCases}\n?????? *Toplam ??l??:* ${resp.deaths}\n?????? *G??nl??k ??l??:* ${resp.todayDeaths}\n???? *Toplam ??yile??en:* ${resp.recovered}\n???? *Aktif Vaka:* ${resp.active}\n???? *A????r Hasta:* ${resp.critical}\n???? *Toplam Test:* ${resp.totalTests}`);
                });
            } catch (err) {
                await message.reply(`Bir Hata Olu??tu, ????te Hata : \n${err.message}`, MessageType.text)
            }

        }
        else if (match[1] === "usa" || match[1] === "Usa" || match[1] === "USA" || match[1] === "america" || match[1] === "America") {
            try{
                const respo = await got("https://coronavirus-19-api.herokuapp.com/countries/USA").then(async ok  => {
                    resp = JSON.parse(ok.body);
                    await message.reply(`???????? *Datas for USA:*\n???? *Total Cases:* ${resp.cases}\n???? *Daily Cases:* ${resp.todayCases}\n?????? *Total Deaths:* ${resp.deaths}\n?????? *Daily Deaths:* ${resp.todayDeaths}\n???? *Total Recovered:* ${resp.recovered}\n???? *Active Cases:* ${resp.active}\n???? *Critical Cases:* ${resp.critical}\n???? *Total Test:* ${resp.totalTests}`);

                });

            } catch (err) {
                await message.reply(`Error : \n${err.message}`, MessageType.text)
            }
        }
        else if (match[1] === "de" || match[1] === "De" || match[1] === "DE" || match[1] === "Germany" || match[1] === "germany" || match[1].includes('deutschland') ) {
            try{
                const respo = await got("https://coronavirus-19-api.herokuapp.com/countries/Germany").then(async ok  => {
                    resp = JSON.parse(ok.body);
                    await message.reply(`???????? *Daten f??r Deutschland:*\n???? *F??lle ??nsgesamt:* ${resp.cases}\n???? *T??gliche F??lle:* ${resp.todayCases}\n?????? *Totale Todesf??lle:* ${resp.deaths}\n?????? *T??gliche Todesf??lle:* ${resp.todayDeaths}\n???? *Insgesamt Wiederhergestellt:* ${resp.recovered}\n???? *Aktuelle F??lle:* ${resp.active}\n???? *Kritische F??lle:* ${resp.critical}\n???? *Gesamttests:* ${resp.totalTests}`);

                });

            } catch (err) {
                await message.reply(`Error : \n${err.message}`, MessageType.text)
            }
        }
        else if (match[1] === "az" || match[1] === "AZ" || match[1] === "Az" || match[1].includes('azerbaycan') || match[1].includes('azeri') ) {
            try{
                const respo = await got("https://coronavirus-19-api.herokuapp.com/countries/Azerbaijan").then(async ok  => {
                    resp = JSON.parse(ok.body);
                    await message.reply(`???????? *Az??rbaycan ??????n m??lumatlar:*\n???? *??mumi Ba?? Tutan Hadis??:* ${resp.cases}\n???? *G??nl??k X??st??:* ${resp.todayCases}\n?????? *??mumi ??l??m:* ${resp.deaths}\n?????? *G??nl??k ??l??m:* ${resp.todayDeaths}\n???? *??mumi Sa??alma:* ${resp.recovered}\n???? *Aktiv X??st?? Say??:* ${resp.active}\n???? *A????r X??st?? Say??:* ${resp.critical}\n???? *??mumi Test:* ${resp.totalTests}`);

                });

            } catch (err) {
                await message.reply(`Error : \n${err.message}`, MessageType.text)
            }
        }
        else if (match[1] === "uk" || match[1] === "Uk" || match[1] === "UK" || match[1] === "United" || match[1].includes('kingdom') ) {
            try{
                const respo = await got("https://coronavirus-19-api.herokuapp.com/countries/UK").then(async ok  => {
                    resp = JSON.parse(ok.body);
                    await message.reply(`???????? *Datas for UK:*\n???? *Total Cases:* ${resp.cases}\n???? *Daily Cases:* ${resp.todayCases}\n?????? *Total Deaths:* ${resp.deaths}\n?????? *Daily Deaths:* ${resp.todayDeaths}\n???? *Total Recovered:* ${resp.recovered}\n???? *Active Cases:* ${resp.active}\n???? *Critical Cases:* ${resp.critical}\n???? *Total Test:* ${resp.totalTests}`);

                });

            } catch (err) {
                await message.reply(`Error : \n${err.message}`, MessageType.text)
            }
        }
        else if (match[1] === "in" || match[1] === "??n" || match[1] === "In" || match[1] === "??n" || match[1] === "IN" ||  match[1] === "??N" || match[1] === "india" || match[1] === "India" || match[1].includes('indian') ) {
            try{
                const respo = await got("https://coronavirus-19-api.herokuapp.com/countries/India").then(async ok  => {
                    resp = JSON.parse(ok.body);
                    await message.reply(`???????? *???????????? ?????? ????????? ????????????:*\n???? *????????? ???????????????:* ${resp.cases}\n???? *??????????????? ???????????????:* ${resp.todayCases}\n?????? *????????? ???????????????:* ${resp.deaths}\n?????? *????????? ?????? ?????????:* ${resp.todayDeaths}\n???? *????????? ???????????????:* ${resp.recovered}\n???? *?????????????????? ?????????:* ${resp.active}\n???? *??????????????? ???????????????:* ${resp.critical}\n???? *????????? ???????????????:* ${resp.totalTests}`);

                });

            } catch (err) {
                await message.reply(`Error : \n${err.message}`, MessageType.text)
            }
        }
        else if (match[1] === "cn" || match[1] === "Cn" || match[1] === "CN" || match[1].includes('china') ) {
            try{
                const respo = await got("https://coronavirus-19-api.herokuapp.com/countries/China").then(async ok  => {
                    resp = JSON.parse(ok.body);
                    await message.reply(`???????? *Datas for China:*\n???? *Total Cases:* ${resp.cases}\n???? *Daily Cases:* ${resp.todayCases}\n?????? *Total Deaths:* ${resp.deaths}\n?????? *Daily Deaths:* ${resp.todayDeaths}\n???? *Total Recovered:* ${resp.recovered}\n???? *Active Cases:* ${resp.active}\n???? *Critical Cases:* ${resp.critical}\n???? *Total Test:* ${resp.totalTests}`);

                });

            } catch (err) {
                await message.reply(`Error : \n${err.message}`, MessageType.text)
            }
        }
        else if (match[1] === "gr" || match[1] === "Gr" || match[1] === "GR" || match[1].includes('greek') ) {
            try{
                const respo = await got("https://coronavirus-19-api.herokuapp.com/countries/Greece").then(async ok  => {
                    resp = JSON.parse(ok.body);
                    await message.reply(`???????? *Datas for Greece:*\n???? *Total Cases:* ${resp.cases}\n???? *Daily Cases:* ${resp.todayCases}\n?????? *Total Deaths:* ${resp.deaths}\n?????? *Daily Deaths:* ${resp.todayDeaths}\n???? *Total Recovered:* ${resp.recovered}\n???? *Active Cases:* ${resp.active}\n???? *Critical Cases:* ${resp.critical}\n???? *Total Test:* ${resp.totalTests}`);

                });

            } catch (err) {
                await message.reply(`Error : \n${err.message}`, MessageType.text)
            }
        }
        else if (match[1] === "fr" || match[1] === "Fr" || match[1] === "FR" || match[1].includes('france') ) {
            try{
                const respo = await got("https://coronavirus-19-api.herokuapp.com/countries/France").then(async ok  => {
                    resp = JSON.parse(ok.body);
                    await message.reply(`???????? *Datas for France:*\n???? *Total Cases:* ${resp.cases}\n???? *Daily Cases:* ${resp.todayCases}\n?????? *Total Deaths:* ${resp.deaths}\n?????? *Daily Deaths:* ${resp.todayDeaths}\n???? *Total Recovered:* ${resp.recovered}\n???? *Active Cases:* ${resp.active}\n???? *Critical Cases:* ${resp.critical}\n???? *Total Test:* ${resp.totalTests}`);

                });

            } catch (err) {
                await message.reply(`Error : \n${err.message}`, MessageType.text)
            }
        }
        else if (match[1] === "jp" || match[1] === "Jp" || match[1] === "JP" || match[1].includes('japan') ) {
            try{
                const respo = await got("https://coronavirus-19-api.herokuapp.com/countries/Japan").then(async ok  => {
                    resp = JSON.parse(ok.body);
                    await message.reply(`???????? *Datas for Japan:*\n???? *Total Cases:* ${resp.cases}\n???? *Daily Cases:* ${resp.todayCases}\n?????? *Total Deaths:* ${resp.deaths}\n?????? *Daily Deaths:* ${resp.todayDeaths}\n???? *Total Recovered:* ${resp.recovered}\n???? *Active Cases:* ${resp.active}\n???? *Critical Cases:* ${resp.critical}\n???? *Total Test:* ${resp.totalTests}`);

                });
 
            } catch (err) {
                await message.reply(`Error : \n${err.message}`, MessageType.text)
            }
        }
        else if (match[1] === "kz" || match[1] === "Kz" || match[1] === "KZ" || match[1].includes('kazakistan') ) {
            try{
                const respo = await got("https://coronavirus-19-api.herokuapp.com/countries/Kazakhstan").then(async ok  => {
                    resp = JSON.parse(ok.body);
                    await message.reply(`???????? *Datas for Kazakhstan:*\n???? *Total Cases:* ${resp.cases}\n???? *Daily Cases:* ${resp.todayCases}\n?????? *Total Deaths:* ${resp.deaths}\n?????? *Daily Deaths:* ${resp.todayDeaths}\n???? *Total Recovered:* ${resp.recovered}\n???? *Active Cases:* ${resp.active}\n???? *Critical Cases:* ${resp.critical}\n???? *Total Test:* ${resp.totalTests}`);

                });

            } catch (err) {
                await message.reply(`Error : \n${err.message}`, MessageType.text)
            }
        }
        else if (match[1] === "pk" || match[1] === "Pk" || match[1] === "PK" || match[1].includes('pakistan') ) {
            try{
                const respo = await got("https://coronavirus-19-api.herokuapp.com/countries/Pakistan").then(async ok  => {
                    resp = JSON.parse(ok.body);
                    await message.reply(`???????? *Datas for Pakistan:*\n???? *Total Cases:* ${resp.cases}\n???? *Daily Cases:* ${resp.todayCases}\n?????? *Total Deaths:* ${resp.deaths}\n?????? *Daily Deaths:* ${resp.todayDeaths}\n???? *Total Recovered:* ${resp.recovered}\n???? *Active Cases:* ${resp.active}\n???? *Critical Cases:* ${resp.critical}\n???? *Total Test:* ${resp.totalTests}`);

                });

            } catch (err) {
                await message.reply(`Error : \n${err.message}`, MessageType.text)
            }
        } 
        else if (match[1] === "ru" || match[1] === "Ru" || match[1] === "RU" || match[1].includes('russia') ) {
            try{
                const respo = await got("https://coronavirus-19-api.herokuapp.com/countries/Russia").then(async ok  => {
                    resp = JSON.parse(ok.body);
                    await message.reply(`???????? *Datas for Russia:*\n???? *Total Cases:* ${resp.cases}\n???? *Daily Cases:* ${resp.todayCases}\n?????? *Total Deaths:* ${resp.deaths}\n?????? *Daily Deaths:* ${resp.todayDeaths}\n???? *Total Recovered:* ${resp.recovered}\n???? *Active Cases:* ${resp.active}\n???? *Critical Cases:* ${resp.critical}\n???? *Total Test:* ${resp.totalTests}`);

                });

            } catch (err) {
                await message.reply(`Error : \n${err.message}`, MessageType.text)
            }
        } 
        else if (match[1] === "id" || match[1] === "??d" || match[1] === "??D" || match[1] === "??d" || match[1] === "Id" || match[1] === "ID" || match[1].includes('??ndonesia') ) {
            try{
                const respo = await got("https://coronavirus-19-api.herokuapp.com/countries/Indonesia").then(async ok  => {
                    resp = JSON.parse(ok.body);
                    await message.reply(`???????? *Datas for Indonesia:*\n???? *Total Cases:* ${resp.cases}\n???? *Daily Cases:* ${resp.todayCases}\n?????? *Total Deaths:* ${resp.deaths}\n?????? *Daily Deaths:* ${resp.todayDeaths}\n???? *Total Recovered:* ${resp.recovered}\n???? *Active Cases:* ${resp.active}\n???? *Critical Cases:* ${resp.critical}\n???? *Total Test:* ${resp.totalTests}`);

                });

            } catch (err) {
                await message.reply(`Error : \n${err.message}`, MessageType.text)
            }
        } 
        else if (match[1] === "nl" || match[1] === "Nl" || match[1] === "NL" || match[1].includes('netherland') ) {
            try{
                const respo = await got("https://coronavirus-19-api.herokuapp.com/countries/Netherlands").then(async ok  => {
                    resp = JSON.parse(ok.body);
                    await message.reply(`???????? *Datas for Netherlands:*\n???? *Total Cases:* ${resp.cases}\n???? *Daily Cases:* ${resp.todayCases}\n?????? *Total Deaths:* ${resp.deaths}\n?????? *Daily Deaths:* ${resp.todayDeaths}\n???? *Total Recovered:* ${resp.recovered}\n???? *Active Cases:* ${resp.active}\n???? *Critical Cases:* ${resp.critical}\n???? *Total Test:* ${resp.totalTests}`);

                });

            } catch (err) {
                await message.reply(`Error : \n${err.message}`, MessageType.text)
            }
        } 
        else {
            return await message.client.sendMessage(
                message.jid,
                Clang.NOT,
                MessageType.text
            );
        }
    }));

}
else if (config.WORKTYPE == 'public') {

    Julie.addCommand({pattern: 'trt(?: |$)(\\S*) ?(\\S*)', desc: Lang.TRANSLATE_DESC, usage: Lang.TRANSLATE_USAGE, fromMe: false}, (async (message, match) => {

        if (!message.reply_message) {
            return await message.client.sendMessage(message.jid,Lang.NEED_REPLY,MessageType.text);
        }

        ceviri = await translatte(message.reply_message.message, {from: match[1] === '' ? 'auto' : match[1], to: match[2] === '' ? config.LANG : match[2]});
        if ('text' in ceviri) {
            return await message.reply('*?????? ' + Lang.LANG + ':* ```' + (match[1] === '' ? 'auto' : match[1]) + '```\n'
            + '*?????? ' + Lang.FROM + '*: ```' + (match[2] === '' ? config.LANG : match[2]) + '```\n'
            + '*???? ' + Lang.RESULT + ':* ```' + ceviri.text + '```');
        } else {
            return await message.client.sendMessage(message.jid,Lang.TRANSLATE_ERROR,MessageType.text)
        }
    }));
    Julie.addCommand({pattern: 'detectlang$', fromMe: false, desc: dlang_dsc}, (async (message, match) => {

        if (!message.reply_message) return await message.client.sendMessage(message.jid,Lang.NEED_REPLY, MessageType.text)
        const msg = message.reply_message.text
        var ldet = lngDetector.detect(msg)
        async function upperfirstLetter(letter) {
            return letter.charAt(0).toUpperCase() + letter.slice(1).toLowerCase();
        }
        var cls1 = await upperfirstLetter(ldet[0][0])
        var cls2 = ldet[0][1].toString()
        var cls3 = await upperfirstLetter(ldet[1][0])
        var cls4 = ldet[1][1].toString()
        var cls5 = await upperfirstLetter(ldet[2][0])
        var cls6 = ldet[2][1].toString()
        var cls7 = await upperfirstLetter(ldet[3][0])
        var cls8 = ldet[3][1].toString()
        const res_1 = '*' + dlang_input + '* ' + '_' + msg + '_ \n'
        const res_2 = '*' + closer_res + '* ' + '_' + cls1 + '_\n*' + dlang_similarity + '* ' + '_' + cls2 + '_ \n\n'
        const res_3 = '```[ ' + dlang_other + ' ]```\n\n'
        const res_4 = '#2 *' + dlang_lang + '* ' + '_' + cls3 + '_\n*' + dlang_similarity + '* ' + '_' + cls4 + '_ \n'
        const res_5 = '#3 *' + dlang_lang + '* ' + '_' + cls5 + '_\n*' + dlang_similarity + '* ' + '_' + cls6 + '_ \n'
        const res_6 = '#4 *' + dlang_lang + '* ' + '_' + cls7 + '_\n*' + dlang_similarity + '* ' + '_' + cls8 + '_'
        const rep_7 = res_1 + res_2 + res_3 + res_4 + res_5 + res_6
        await message.client.sendMessage(message.jid,rep_7,MessageType.text, { quoted: message.data });
    }));
    Julie.addCommand({pattern: 'currency(?: ([0-9.]+) ([a-zA-Z]+) ([a-zA-Z]+)|$|(.*))', fromMe: true}, (async (message, match) => {

        if(match[1] === undefined || match[2] == undefined || match[3] == undefined) {
            return await message.client.sendMessage(message.jid,Lang.CURRENCY_ERROR,MessageType.text);
        }
        let opts = {
            amount: parseFloat(match[1]).toFixed(2).replace(/\.0+$/,''),
            from: match[2].toUpperCase(),
            to: match[3].toUpperCase()
        }
        try {
            result = await exchangeRates().latest().symbols([opts.to]).base(opts.from).fetch()
            result = parseFloat(result).toFixed(2).replace(/\.0+$/,'')
            await message.reply(`\`\`\`${opts.amount} ${opts.from} = ${result} ${opts.to}\`\`\``)
        }
        catch(err) {
            if (err instanceof ExchangeRatesError) 
                await message.client.sendMessage(message.jid,Lang.INVALID_CURRENCY,MessageType.text)
            else {
                await message.client.sendMessage(message.jid,Lang.UNKNOWN_ERROR,MessageType.text)
                console.log(err)
            }
        }
    }));

    
    Julie.addCommand({pattern: 'tts (.*)', fromMe: false, desc: Lang.TTS_DESC}, (async (message, match) => {

        if(match[1] === undefined || match[1] == "")
            return;
    
        let 
            LANG = 'ml',
            ttsMessage = match[1],
            SPEED = 1.0

        if(langMatch = match[1].match("\\{([a-z]{2})\\}")) {
            LANG = langMatch[1]
            ttsMessage = ttsMessage.replace(langMatch[0], "")
        } 
        if(speedMatch = match[1].match("\\{([0].[0-9]+)\\}")) {
            SPEED = parseFloat(speedMatch[1])
            ttsMessage = ttsMessage.replace(speedMatch[0], "")
        }
    
        var buffer = await googleTTS.synthesize({
            text: ttsMessage,
            voice: LANG
        });
        await message.client.sendMessage(message.jid,buffer, MessageType.audio, {mimetype: Mimetype.mp4Audio,quoted: message.data,  ptt: true});
    }));

    Julie.addCommand({pattern: 'song ?(.*)', fromMe: false, desc: Lang.SONG_DESC}, (async (message, match) => { 

        if (match[1] === '') return await message.client.sendMessage(message.jid,Lang.NEED_TEXT_SONG,MessageType.text);    
        let arama = await yts(match[1]);
        arama = arama.all;
        if(arama.length < 1) return await message.client.sendMessage(message.jid,Lang.NO_RESULT,MessageType.text);
        var reply = await message.client.sendMessage(message.jid,config.SONGD,MessageType.text);

        let title = arama[0].title.replace(' ', '+');
        let stream = ytdl(arama[0].videoId, {
            quality: 'highestaudio',
        });
    
        got.stream(arama[0].image).pipe(fs.createWriteStream(title + '.jpg'));
        ffmpeg(stream)
            .audioBitrate(320)
            .save('./' + title + '.mp3')
            .on('end', async () => {
                const writer = new ID3Writer(fs.readFileSync('./' + title + '.mp3'));
                writer.setFrame('TIT2', arama[0].title)
                    .setFrame('TPE1', [arama[0].author.name])
                    .setFrame('APIC', {
                        type: 3,
                        data: fs.readFileSync(title + '.jpg'),
                        description: arama[0].description
                    });
                writer.addTag();

                reply = await message.client.sendMessage(message.jid,config.SONGU,MessageType.text);
                await message.client.sendMessage(message.jid,Buffer.from(writer.arrayBuffer), MessageType.audio, {mimetype: Mimetype.mp4Audio, ptt: false, quoted: message.data});
            });
    }));


    Julie.addCommand({pattern: 'video ?(.*)', fromMe: false, desc: Lang.VIDEO_DESC}, (async (message, match) => { 

        if (match[1] === '') return await message.client.sendMessage(message.jid,Lang.NEED_VIDEO,MessageType.text);    
    
        var VID = '';
        try {
            if (match[1].includes('watch')) {
                var tsts = match[1].replace('watch?v=', '')
                var alal = tsts.split('/')[3]
                VID = alal
            } else {     
                VID = match[1].split('/')[3]
            }
        } catch {
            return await message.client.sendMessage(message.jid,Lang.NO_RESULT,MessageType.text);
        }
        var reply = await message.client.sendMessage(message.jid,Lang.DOWNLOADING_VIDEO,MessageType.text, {quoted : {
            key: {
              fromMe: true,
              participant: "0@s.whatsapp.net",
              remoteJid: "status@broadcast"
            },
            message: {
              "extendedTextMessage": {
                "text": "*Dowloading*"
              }
            }
        }
        });
        var yt = ytdl(VID, {filter: format => format.container === 'mp4' && ['720p', '480p', '360p', '240p', '144p'].map(() => true)});
        yt.pipe(fs.createWriteStream('./' + VID + '.mp4'));

        yt.on('end', async () => {
            reply = await message.client.sendMessage(message.jid,Lang.UPLOADING_VIDEO,MessageType.text);
            await message.client.sendMessage(message.jid,fs.readFileSync('./' + VID + '.mp4'), MessageType.video, {mimetype: Mimetype.mp4});
        });
    }));

    Julie.addCommand({pattern: 'sing ?(.*)', fromMe: false, desc: Lang.SING_DESC}, (async (message, match) => { 

        if (match[1] === '') return await message.client.sendMessage(message.jid,Lang.NEED_TEXT_SING,MessageType.text);    
        let arama = await yts(match[1]);
        arama = arama.all;
        if(arama.length < 1) return await message.client.sendMessage(message.jid,Lang.NO_RESULT,MessageType.text);

        let title = arama[0].title.replace(' ', '+');
        let stream = ytdl(arama[0].videoId, {
            quality: 'highestaudio',
        });
    
        got.stream(arama[0].image).pipe(fs.createWriteStream(title + '.jpg'));
        ffmpeg(stream)
            .audioBitrate(320)
            .save('./' + title + '.mp3')
            .on('end', async () => {
                const writer = new ID3Writer(fs.readFileSync('./' + title + '.mp3'));
                writer.setFrame('TIT2', arama[0].title)
                    .setFrame('TPE1', [arama[0].author.name])
                    .setFrame('APIC', {
                        type: 3,
                        data: fs.readFileSync(title + '.jpg'),
                        description: arama[0].description
                    });
                writer.addTag();

                
                await message.client.sendMessage(message.jid,Buffer.from(writer.arrayBuffer), MessageType.audio, {mimetype: Mimetype.mp4Audio, ptt: true, quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(message.jid ? { remoteJid: "status@broadcast" } : {}) }, message: { "imageMessage": { "url": "https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nM.enc", "mimetype": "image/jpeg", "caption": '??????????????????????????????' + Config.BOT + '... ?????????????????????????????????', "fileSha256": "+Ia+Dwib70Y1CWRMAP9QLJKjIJt54fKycOfB2OEZbTU=", "fileLength": "28777", "height": 1080, "width": 1079, "mediaKey": "vXmRR7ZUeDWjXy5iQk17TrowBzuwRya0errAFnXxbGc=", "fileEncSha256": "sR9D2RS5JSifw49HeBADguI23fWDz1aZu4faWG/CyRY=", "directPath": "/v/t62.7118-24/21427642_840952686474581_572788076332761430_n.enc?oh=3f57c1ba2fcab95f2c0bb475d72720ba&oe=602F3D69", "mediaKeyTimestamp": "1610993486"}}}});
            });
    }));

    
    
    Julie.addCommand({pattern: 'isong ?(.*)', fromMe: false, desc: Lang.ISONG_DESC}, (async (message, match) => { 

        if (match[1] === '') return await message.client.sendMessage(message.jid,Lang.NEED_TEXT_SONG,MessageType.text);    
        let arama = await yts(match[1]);
        arama = arama.all;
        if(arama.length < 1) return await message.client.sendMessage(message.jid,Lang.NO_RESULT,MessageType.text);

        let title = arama[0].title.replace(' ', '+');
        let stream = ytdl(arama[0].videoId, {
            quality: 'highestaudio',
        });
    
        got.stream(arama[0].image).pipe(fs.createWriteStream(title + '.jpg'));
        ffmpeg(stream)
            .audioBitrate(320)
            .save('./' + title + '.mp3')
            .on('end', async () => {
                const writer = new ID3Writer(fs.readFileSync('./' + title + '.mp3'));
                writer.setFrame('TIT2', arama[0].title)
                    .setFrame('TPE1', [arama[0].author.name])
                    .setFrame('APIC', {
                        type: 3,
                        data: fs.readFileSync(title + '.jpg'),
                        description: arama[0].description
                    });
                writer.addTag();

                
                await message.client.sendMessage(message.jid,Buffer.from(writer.arrayBuffer), MessageType.document, {filename: 'for iphone' + '.mp3', mimetype: 'audio/mpeg', quoted: message.data});
            });
    }));


    Julie.addCommand({pattern: 'wiki ?(.*)', fromMe: false, desc: Lang.WIKI_DESC}, (async (message, match) => { 

        if (match[1] === '') return await message.client.sendMessage(message.jid,Lang.NEED_WORDS,MessageType.text);    
        var reply = await message.client.sendMessage(message.jid,Lang.SEARCHING,MessageType.text);

        var arama = await wiki({ apiUrl: 'https://' + config.LANG + '.wikipedia.org/w/api.php' })
            .page(match[1]);

        var info = await arama.rawContent();
        await message.client.sendMessage(message.jid, info, MessageType.text);
        await reply.delete();
    }));

    Julie.addCommand({pattern: 'img ?(.*)', fromMe: false, desc: Lang.IMG_DESC}, (async (message, match) => { 

        if (match[1] === '') return await message.client.sendMessage(message.jid,Lang.NEED_WORDS,MessageType.text);
        gis(match[1], async (error, result) => {
            for (var i = 0; i < (result.length < 8 ? result.length : 8); i++) {
                var get = got(result[i].url, {https: {rejectUnauthorized: false}});
                var stream = get.buffer();
                
                stream.then(async (image) => {
                    await message.client.sendMessage(message.jid,image, MessageType.image);
                });
            }

            message.reply(Lang.IMG.format((result.length < 8 ? result.length : 8), match[1]));
        });
    }));

    Julie.addCommand({ pattern: 'github ?(.*)', fromMe: false, desc: Glang.G??THUB_DESC }, async (message, match) => {

        const userName = match[1]
 
        if (userName === '') return await message.client.sendMessage(message.jid, Glang.REPLY, MessageType.text)

        await axios
          .get(`https://videfikri.com/api/github/?username=${userName}`)
          .then(async (response) => {

            const {
              hireable,
              company,
              profile_pic,
              username,
              fullname, 
              blog, 
              location,
              email,
              public_repository,
              biografi,
              following,
              followers,
              public_gists,
              profile_url,
              last_updated,
              joined_on,
            } = response.data.result

            const githubscrap = await axios.get(profile_pic, 
              {responseType: 'arraybuffer',
            })

            const msg = `*${Glang.USERNAME}* ${username} \n*${Glang.NAME}* ${fullname} \n*${Glang.FOLLOWERS}* ${followers} \n*${Glang.FOLLOW??NG}* ${following} \n*${Glang.B??O}* ${biografi} \n*${Glang.REPO}* ${public_repository} \n*${Glang.G??ST}* ${public_gists} \n*${Glang.LOCAT??ON}* ${location} \n*${Glang.MA??L}* ${email} \n*${Glang.BLOG}* ${blog} \n*${Glang.COMPANY}* ${company} \n*${Glang.H??RE}* ${hireable === "true" ? Glang.H??RE_TRUE : Glang.H??RE_FALSE} \n*${Glang.JO??N}* ${joined_on} \n*${Glang.UPDATE}* ${last_updated} \n*${Glang.URL}* ${profile_url}`

            await message.sendMessage(Buffer.from(githubscrap.data), MessageType.image, { 
              caption: msg,
            })
          })
          .catch(
            async (err) => await message.client.sendMessage(message.jid, Glang.NOT, MessageType.text),
          )
      },
    )

    Julie.addCommand({pattern: 'lyric ?(.*)', fromMe: false, desc: Slang.LY_DESC }, (async (message, match) => {

        if (match[1] === '') return await message.client.sendMessage(message.jid, Slang.NEED, MessageType.text);

        var aut = await solenolyrics.requestLyricsFor(`${match[1]}`); 
        var son = await solenolyrics.requestAuthorFor(`${match[1]}`);
        var cov = await solenolyrics.requestIconFor(`${match[1]}`);
        var tit = await solenolyrics.requestTitleFor(`${match[1]}`);

        var buffer = await axios.get(cov, {responseType: 'arraybuffer'});

        await message.client.sendMessage(message.jid, Buffer.from(buffer.data),  MessageType.image, {caption: `*${Slang.ARAT}* ` + '```' + `${match[1]}` + '```' + `\n*${Slang.BUL}* ` + '```' + tit + '```' + `\n*${Slang.AUT}* ` + '```' + son + '```' + `\n*${Slang.SLY}*\n\n` + aut });

    }));

    Julie.addCommand({pattern: "covid ?(.*)", fromMe: false, desc: Clang.COV_DESC}, (async (message, match) => {
        if (match[1] === "") {
            try{
                //const resp = await fetch("https://coronavirus-19-api.herokuapp.com/all").then(r => r.json());
                const respo = await got("https://coronavirus-19-api.herokuapp.com/all").then(async ok => {
                    const resp = JSON.parse(ok.body);
                    await message.reply(`???? *World-Wide Results:*\n???? *Total Cases:* ${resp.cases}\n?????? *Total Deaths:* ${resp.deaths}\n?????? *Total Recovered:* ${resp.recovered}`);
 
                });

            } catch (err) {
                await message.reply(`Error :\n${err.message}`, MessageType.text)
            }

        }
        else if (match[1] === "tr" || match[1] === "Tr" || match[1] === "TR" || match[1].includes('turkiye') || match[1].includes('t??rkiye') || match[1].includes('t??rk') ) {
            try{
                const respo = await got("https://coronavirus-19-api.herokuapp.com/countries/Turkey").then(async ok  => {
                    resp = JSON.parse(ok.body);
                    await message.reply(`???????? *T??rkiye ????in Sonu??lar:*\n???? *Toplam Vaka:* ${resp.cases}\n???? *G??nl??k Hasta:* ${resp.todayCases}\n?????? *Toplam ??l??:* ${resp.deaths}\n?????? *G??nl??k ??l??:* ${resp.todayDeaths}\n???? *Toplam ??yile??en:* ${resp.recovered}\n???? *Aktif Vaka:* ${resp.active}\n???? *A????r Hasta:* ${resp.critical}\n???? *Toplam Test:* ${resp.totalTests}`);
                });
            } catch (err) {
                await message.reply(`Bir Hata Olu??tu, ????te Hata : \n${err.message}`, MessageType.text)
            }

        }
        else if (match[1] === "usa" || match[1] === "Usa" || match[1] === "USA" || match[1] === "america" || match[1] === "America") {
            try{
                const respo = await got("https://coronavirus-19-api.herokuapp.com/countries/USA").then(async ok  => {
                    resp = JSON.parse(ok.body);
                    await message.reply(`???????? *Datas for USA:*\n???? *Total Cases:* ${resp.cases}\n???? *Daily Cases:* ${resp.todayCases}\n?????? *Total Deaths:* ${resp.deaths}\n?????? *Daily Deaths:* ${resp.todayDeaths}\n???? *Total Recovered:* ${resp.recovered}\n???? *Active Cases:* ${resp.active}\n???? *Critical Cases:* ${resp.critical}\n???? *Total Test:* ${resp.totalTests}`);

                });

            } catch (err) {
                await message.reply(`Error : \n${err.message}`, MessageType.text)
            }
        }
        else if (match[1] === "de" || match[1] === "De" || match[1] === "DE" || match[1] === "Germany" || match[1] === "germany" || match[1].includes('deutschland') ) {
            try{
                const respo = await got("https://coronavirus-19-api.herokuapp.com/countries/Germany").then(async ok  => {
                    resp = JSON.parse(ok.body);
                    await message.reply(`???????? *Daten f??r Deutschland:*\n???? *F??lle ??nsgesamt:* ${resp.cases}\n???? *T??gliche F??lle:* ${resp.todayCases}\n?????? *Totale Todesf??lle:* ${resp.deaths}\n?????? *T??gliche Todesf??lle:* ${resp.todayDeaths}\n???? *Insgesamt Wiederhergestellt:* ${resp.recovered}\n???? *Aktuelle F??lle:* ${resp.active}\n???? *Kritische F??lle:* ${resp.critical}\n???? *Gesamttests:* ${resp.totalTests}`);

                });

            } catch (err) {
                await message.reply(`Error : \n${err.message}`, MessageType.text)
            }
        }
        else if (match[1] === "az" || match[1] === "AZ" || match[1] === "Az" || match[1].includes('azerbaycan') || match[1].includes('azeri') ) {
            try{
                const respo = await got("https://coronavirus-19-api.herokuapp.com/countries/Azerbaijan").then(async ok  => {
                    resp = JSON.parse(ok.body);
                    await message.reply(`???????? *Az??rbaycan ??????n m??lumatlar:*\n???? *??mumi Ba?? Tutan Hadis??:* ${resp.cases}\n???? *G??nl??k X??st??:* ${resp.todayCases}\n?????? *??mumi ??l??m:* ${resp.deaths}\n?????? *G??nl??k ??l??m:* ${resp.todayDeaths}\n???? *??mumi Sa??alma:* ${resp.recovered}\n???? *Aktiv X??st?? Say??:* ${resp.active}\n???? *A????r X??st?? Say??:* ${resp.critical}\n???? *??mumi Test:* ${resp.totalTests}`);

                });

            } catch (err) {
                await message.reply(`Error : \n${err.message}`, MessageType.text)
            }
        }
        else if (match[1] === "uk" || match[1] === "Uk" || match[1] === "UK" || match[1] === "United" || match[1].includes('kingdom') ) {
            try{
                const respo = await got("https://coronavirus-19-api.herokuapp.com/countries/UK").then(async ok  => {
                    resp = JSON.parse(ok.body);
                    await message.reply(`???????? *Datas for UK:*\n???? *Total Cases:* ${resp.cases}\n???? *Daily Cases:* ${resp.todayCases}\n?????? *Total Deaths:* ${resp.deaths}\n?????? *Daily Deaths:* ${resp.todayDeaths}\n???? *Total Recovered:* ${resp.recovered}\n???? *Active Cases:* ${resp.active}\n???? *Critical Cases:* ${resp.critical}\n???? *Total Test:* ${resp.totalTests}`);

                });

            } catch (err) {
                await message.reply(`Error : \n${err.message}`, MessageType.text)
            }
        }
        else if (match[1] === "in" || match[1] === "??n" || match[1] === "In" || match[1] === "??n" || match[1] === "??N" ||  match[1] === "IN" || match[1] === "india" || match[1] === "India" || match[1].includes('indian') ) {
            try{
                const respo = await got("https://coronavirus-19-api.herokuapp.com/countries/India").then(async ok  => {
                    resp = JSON.parse(ok.body);
                    await message.reply(`???????? *???????????? ?????? ????????? ????????????:*\n???? *????????? ???????????????:* ${resp.cases}\n???? *??????????????? ???????????????:* ${resp.todayCases}\n?????? *????????? ???????????????:* ${resp.deaths}\n?????? *????????? ?????? ?????????:* ${resp.todayDeaths}\n???? *????????? ???????????????:* ${resp.recovered}\n???? *?????????????????? ?????????:* ${resp.active}\n???? *??????????????? ???????????????:* ${resp.critical}\n???? *????????? ???????????????:* ${resp.totalTests}`);

                });

            } catch (err) {
                await message.reply(`Error : \n${err.message}`, MessageType.text)
            }
        }
        else if (match[1] === "cn" || match[1] === "Cn" || match[1] === "CN" || match[1].includes('china') ) {
            try{
                const respo = await got("https://coronavirus-19-api.herokuapp.com/countries/China").then(async ok  => {
                    resp = JSON.parse(ok.body);
                    await message.reply(`???????? *Datas for China:*\n???? *Total Cases:* ${resp.cases}\n???? *Daily Cases:* ${resp.todayCases}\n?????? *Total Deaths:* ${resp.deaths}\n?????? *Daily Deaths:* ${resp.todayDeaths}\n???? *Total Recovered:* ${resp.recovered}\n???? *Active Cases:* ${resp.active}\n???? *Critical Cases:* ${resp.critical}\n???? *Total Test:* ${resp.totalTests}`);

                });

            } catch (err) {
                await message.reply(`Error : \n${err.message}`, MessageType.text)
            }
        }
        else if (match[1] === "gr" || match[1] === "Gr" || match[1] === "GR" || match[1].includes('greek') ) {
            try{
                const respo = await got("https://coronavirus-19-api.herokuapp.com/countries/Greece").then(async ok  => {
                    resp = JSON.parse(ok.body);
                    await message.reply(`???????? *Datas for Greece:*\n???? *Total Cases:* ${resp.cases}\n???? *Daily Cases:* ${resp.todayCases}\n?????? *Total Deaths:* ${resp.deaths}\n?????? *Daily Deaths:* ${resp.todayDeaths}\n???? *Total Recovered:* ${resp.recovered}\n???? *Active Cases:* ${resp.active}\n???? *Critical Cases:* ${resp.critical}\n???? *Total Test:* ${resp.totalTests}`);

                });

            } catch (err) {
                await message.reply(`Error : \n${err.message}`, MessageType.text)
            }
        }
        else if (match[1] === "fr" || match[1] === "Fr" || match[1] === "FR" || match[1].includes('france') ) {
            try{
                const respo = await got("https://coronavirus-19-api.herokuapp.com/countries/France").then(async ok  => {
                    resp = JSON.parse(ok.body);
                    await message.reply(`???????? *Datas for France:*\n???? *Total Cases:* ${resp.cases}\n???? *Daily Cases:* ${resp.todayCases}\n?????? *Total Deaths:* ${resp.deaths}\n?????? *Daily Deaths:* ${resp.todayDeaths}\n???? *Total Recovered:* ${resp.recovered}\n???? *Active Cases:* ${resp.active}\n???? *Critical Cases:* ${resp.critical}\n???? *Total Test:* ${resp.totalTests}`);

                });

            } catch (err) {
                await message.reply(`Error : \n${err.message}`, MessageType.text)
            }
        }
        else if (match[1] === "jp" || match[1] === "Jp" || match[1] === "JP" || match[1].includes('japan') ) {
            try{
                const respo = await got("https://coronavirus-19-api.herokuapp.com/countries/Japan").then(async ok  => {
                    resp = JSON.parse(ok.body);
                    await message.reply(`???????? *Datas for Japan:*\n???? *Total Cases:* ${resp.cases}\n???? *Daily Cases:* ${resp.todayCases}\n?????? *Total Deaths:* ${resp.deaths}\n?????? *Daily Deaths:* ${resp.todayDeaths}\n???? *Total Recovered:* ${resp.recovered}\n???? *Active Cases:* ${resp.active}\n???? *Critical Cases:* ${resp.critical}\n???? *Total Test:* ${resp.totalTests}`);

                });
 
            } catch (err) {
                await message.reply(`Error : \n${err.message}`, MessageType.text)
            }
        }
        else if (match[1] === "kz" || match[1] === "Kz" || match[1] === "KZ" || match[1].includes('kazakistan') ) {
            try{
                const respo = await got("https://coronavirus-19-api.herokuapp.com/countries/Kazakhstan").then(async ok  => {
                    resp = JSON.parse(ok.body);
                    await message.reply(`???????? *Datas for Kazakhstan:*\n???? *Total Cases:* ${resp.cases}\n???? *Daily Cases:* ${resp.todayCases}\n?????? *Total Deaths:* ${resp.deaths}\n?????? *Daily Deaths:* ${resp.todayDeaths}\n???? *Total Recovered:* ${resp.recovered}\n???? *Active Cases:* ${resp.active}\n???? *Critical Cases:* ${resp.critical}\n???? *Total Test:* ${resp.totalTests}`);

                });

            } catch (err) {
                await message.reply(`Error : \n${err.message}`, MessageType.text)
            }
        }
        else if (match[1] === "pk" || match[1] === "Pk" || match[1] === "PK" || match[1].includes('pakistan') ) {
            try{
                const respo = await got("https://coronavirus-19-api.herokuapp.com/countries/Pakistan").then(async ok  => {
                    resp = JSON.parse(ok.body);
                    await message.reply(`???????? *Datas for Pakistan:*\n???? *Total Cases:* ${resp.cases}\n???? *Daily Cases:* ${resp.todayCases}\n?????? *Total Deaths:* ${resp.deaths}\n?????? *Daily Deaths:* ${resp.todayDeaths}\n???? *Total Recovered:* ${resp.recovered}\n???? *Active Cases:* ${resp.active}\n???? *Critical Cases:* ${resp.critical}\n???? *Total Test:* ${resp.totalTests}`);

                });

            } catch (err) {
                await message.reply(`Error : \n${err.message}`, MessageType.text)
            }
        } 
        else if (match[1] === "ru" || match[1] === "Ru" || match[1] === "RU" || match[1].includes('russia') ) {
            try{
                const respo = await got("https://coronavirus-19-api.herokuapp.com/countries/Russia").then(async ok  => {
                    resp = JSON.parse(ok.body);
                    await message.reply(`???????? *Datas for Russia:*\n???? *Total Cases:* ${resp.cases}\n???? *Daily Cases:* ${resp.todayCases}\n?????? *Total Deaths:* ${resp.deaths}\n?????? *Daily Deaths:* ${resp.todayDeaths}\n???? *Total Recovered:* ${resp.recovered}\n???? *Active Cases:* ${resp.active}\n???? *Critical Cases:* ${resp.critical}\n???? *Total Test:* ${resp.totalTests}`);

                });

            } catch (err) {
                await message.reply(`Error : \n${err.message}`, MessageType.text)
            }
        } 
        else if (match[1] === "id" || match[1] === "??d" || match[1] === "??D" || match[1] === "??d" || match[1] === "Id" || match[1] === "ID" || match[1].includes('??ndonesia') ) {
            try{
                const respo = await got("https://coronavirus-19-api.herokuapp.com/countries/Indonesia").then(async ok  => {
                    resp = JSON.parse(ok.body);
                    await message.reply(`???????? *Datas for Indonesia:*\n???? *Total Cases:* ${resp.cases}\n???? *Daily Cases:* ${resp.todayCases}\n?????? *Total Deaths:* ${resp.deaths}\n?????? *Daily Deaths:* ${resp.todayDeaths}\n???? *Total Recovered:* ${resp.recovered}\n???? *Active Cases:* ${resp.active}\n???? *Critical Cases:* ${resp.critical}\n???? *Total Test:* ${resp.totalTests}`);

                });

            } catch (err) {
                await message.reply(`Error : \n${err.message}`, MessageType.text)
            }
        } 
        else if (match[1] === "nl" || match[1] === "Nl" || match[1] === "NL" || match[1].includes('netherland') ) {
            try{
                const respo = await got("https://coronavirus-19-api.herokuapp.com/countries/Netherlands").then(async ok  => {
                    resp = JSON.parse(ok.body);
                    await message.reply(`???????? *Datas for Netherlands:*\n???? *Total Cases:* ${resp.cases}\n???? *Daily Cases:* ${resp.todayCases}\n?????? *Total Deaths:* ${resp.deaths}\n?????? *Daily Deaths:* ${resp.todayDeaths}\n???? *Total Recovered:* ${resp.recovered}\n???? *Active Cases:* ${resp.active}\n???? *Critical Cases:* ${resp.critical}\n???? *Total Test:* ${resp.totalTests}`);

                });

            } catch (err) {
                await message.reply(`Error : \n${err.message}`, MessageType.text)
            }
        } 
        else {
            return await message.client.sendMessage(
                message.jid,
                Clang.NOT,
                MessageType.text
            );
        }
    }));
    
}
