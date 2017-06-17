
var magicBall = (function () {

    /////////////////
    /// Global var //
    /////////////////

    ///Type answers
    var TYPE_POSITIVE = 'positive';
    var TYPE_NEGATIVE = 'negative';
    var TYPE_NEUTRAL = 'neutral';

    ///Type languages
    var LANG_RU = 'ru';
    var LANG_EN = 'en';

    ///Language
    var lang = LANG_RU;

    ///Mas answers
    var answers = [];

    /////////////////
    ///  function  //
    /////////////////

    ///Add answers
    function addAnswer(text, type) {
        var answer = {
            text: text,
            type: type,
            isPositiveAnswer: function () { return isPositiveAnswer(this.type); },
            isNeutralAnswer: function () { return isNeutralAnswer(this.type); },
            isNegativeAnswer: function () { return isNegativeAnswer(this.type); }
        };
        answers.push(answer);
        sortAnswers();
        saveAnswers();
    }

    function addPositiveAnswer(text) {
        addAnswer(text, TYPE_POSITIVE);
    }

    function addNegativeAnswer(text) {
        addAnswer(text, TYPE_NEGATIVE);
    }

    function addNeutralAnswer(text) {
        addAnswer(text, TYPE_NEUTRAL);
    }

    ///Del answers
    function delAllAnswers() {
        answers.length = 0;
    }

    ///Del answer
    function delAnswer(value) {
        ///Value is number answer
        if (typeof value === 'number') {
            if (value > 0 || answers.length > 0) {
                answers.splice(value - 1, 1);
            }
        }
        ///Value is text answer
        if (typeof value === 'string') {
            for (var i = 0; i < answers.length; i++) {
                var answerText = answers[i].text;
                var del = (answerText === value);
                if (del) {
                    answers.splice(i, 1);
                    break;
                }
            }
        }
        ///Value is object answer
        if (typeof value === 'object') {
            for (var i = 0; i < answers.length; i++) {
                var answer = answers[i];
                var del = _.isEqual(answer, value);
                if (del) {
                    answers.splice(i, 1);
                    break;
                }
            }
        }
        saveAnswers();
    }

    ///Sort
    function sortAnswers() {
        answers.sort(sortAnswer);
    }

    function sortAnswer(answer1, answer2) {
        var sortObj = {
            num1: 0,
            num2: 0
        };
        for (var i = 0; i < arguments.length; i++) {
            var el = i + 1;
            if (arguments[i].type === TYPE_POSITIVE) {
                sortObj['num' + el] = 1;
            }
            if (arguments[i].type === TYPE_NEUTRAL) {
                sortObj['num' + el] = 2;
            }
            if (arguments[i].type === TYPE_NEGATIVE) {
                sortObj['num' + el] = 3;
            }
        }

        if (sortObj.num1 > sortObj.num2) {
            return 1;
        }
        if (sortObj.num1 < sortObj.num2) {
            return -1;
        }
        return 0;
    }

    ///Check type answer
    function isPositiveAnswer(type) {
        if (type === TYPE_POSITIVE) {
            return true;
        }
        return false;
    }

    function isNeutralAnswer(type) {
        if (type === TYPE_NEUTRAL) {
            return true;
        }
        return false;
    }

    function isNegativeAnswer(type) {
        if (type === TYPE_NEGATIVE) {
            return true;
        }
        return false;
    }

    ///Random answer
    function getAnswer() {
        var index = _.random(answers.length - 1);
        return answers[index];
    }

    ///Languages
    function setLanguage(strLang) {
        lang = strLang;
        setDefaults();
    }

    function setLangRU() {
        setLanguage(LANG_RU);
    }

    function setLangEN() {
        setLanguage(LANG_EN);
    }

    function isLangRU() {
        return (lang === LANG_RU);
    }

    function isLangEN() {
        return (lang === LANG_EN);
    }

    ///Set defaults answers
    function setDefaults() {
        delAllAnswers();

        var mas = [];

        ///Positive
        answer = {};
        answer[LANG_RU] = 'Бесспорно';
        answer[LANG_EN] = 'It is certain';
        answer.type = TYPE_POSITIVE;
        mas.push(answer);

        answer = {};
        answer[LANG_RU] = 'Предрешено';
        answer[LANG_EN] = 'It is decidedly so';
        answer.type = TYPE_POSITIVE;
        mas.push(answer);

        answer = {};
        answer[LANG_RU] = 'Никаких сомнений';
        answer[LANG_EN] = 'Without a doubt';
        answer.type = TYPE_POSITIVE;
        mas.push(answer);

        answer = {};
        answer[LANG_RU] = 'Определённо да';
        answer[LANG_EN] = 'Yes — definitely';
        answer.type = TYPE_POSITIVE;
        mas.push(answer);

        answer = {};
        answer[LANG_RU] = 'Можешь быть уверен в этом';
        answer[LANG_EN] = 'You may rely on it';
        answer.type = TYPE_POSITIVE;
        mas.push(answer);

        answer = {};
        answer[LANG_RU] = 'Мне кажется — «да»';
        answer[LANG_EN] = 'As I see it, yes';
        answer.type = TYPE_POSITIVE;
        mas.push(answer);

        answer = {};
        answer[LANG_RU] = 'Вероятнее всего';
        answer[LANG_EN] = 'Most likely';
        answer.type = TYPE_POSITIVE;
        mas.push(answer);

        answer = {};
        answer[LANG_RU] = 'Хорошие перспективы';
        answer[LANG_EN] = 'Outlook good';
        answer.type = TYPE_POSITIVE;
        mas.push(answer);

        answer = {};
        answer[LANG_RU] = 'Знаки говорят — «да»';
        answer[LANG_EN] = 'Signs point to yes';
        answer.type = TYPE_POSITIVE;
        mas.push(answer);

        answer = {};
        answer[LANG_RU] = 'Да';
        answer[LANG_EN] = 'Yes';
        answer.type = TYPE_POSITIVE;
        mas.push(answer);

        ///Neutral
        answer = {};
        answer[LANG_RU] = 'Пока не ясно, попробуй снова';
        answer[LANG_EN] = 'Reply hazy, try again';
        answer.type = TYPE_NEUTRAL;
        mas.push(answer);

        answer = {};
        answer[LANG_RU] = 'Спроси позже';
        answer[LANG_EN] = 'Ask again later';
        answer.type = TYPE_NEUTRAL;
        mas.push(answer);

        answer = {};
        answer[LANG_RU] = 'Лучше не рассказывать';
        answer[LANG_EN] = 'Better not tell you now';
        answer.type = TYPE_NEUTRAL;
        mas.push(answer);

        answer = {};
        answer[LANG_RU] = 'Сейчас нельзя предсказать';
        answer[LANG_EN] = 'Cannot predict now';
        answer.type = TYPE_NEUTRAL;
        mas.push(answer);

        answer = {};
        answer[LANG_RU] = 'Сконцентрируйся и спроси опять';
        answer[LANG_EN] = 'Concentrate and ask again';
        answer.type = TYPE_NEUTRAL;
        mas.push(answer);

        ///Negative
        answer = {};
        answer[LANG_RU] = 'Даже не думай';
        answer[LANG_EN] = 'Don’t count on it';
        answer.type = TYPE_NEGATIVE;
        mas.push(answer);

        answer = {};
        answer[LANG_RU] = 'Мой ответ — «нет»';
        answer[LANG_EN] = 'My reply is no';
        answer.type = TYPE_NEGATIVE;
        mas.push(answer);

        answer = {};
        answer[LANG_RU] = 'По моим данным — «нет»';
        answer[LANG_EN] = 'My sources say no';
        answer.type = TYPE_NEGATIVE;
        mas.push(answer);

        answer = {};
        answer[LANG_RU] = 'Перспективы не очень хорошие';
        answer[LANG_EN] = 'Outlook not so good';
        answer.type = TYPE_NEGATIVE;
        mas.push(answer);

        answer = {};
        answer[LANG_RU] = 'Весьма сомнительно';
        answer[LANG_EN] = 'Very doubtful';
        answer.type = TYPE_NEGATIVE;
        mas.push(answer);

        for (var i = 0; i < mas.length; i++) {
            answer = mas[i];
            addAnswer(answer[lang], answer.type);
        }

        sortAnswers();
        saveAnswers();
    }

    ///Local storage
    function saveAnswers() {
        localStorage.setItem('magicBallAnswers', JSON.stringify(answers));
        localStorage.setItem('magicBallLang', lang);
    }

    function loadAnswers() {
        var flSetDefaults = false;

        try {

            var mas = JSON.parse(localStorage.getItem('magicBallAnswers'));
            var loadLang = localStorage.getItem('magicBallLang');

            if (loadLang === null || mas === null) {
                setLangRU();
                flSetDefaults = true;
            }
            else {
                if (loadLang.length > 0) {
                    lang = loadLang;
                }

                if (mas.length > 0) {
                    if (!_.isEmpty(mas[0])) {
                        delAllAnswers();
                        for (var i = 0; i < mas.length; i++) {
                            addAnswer(mas[i].text, mas[i].type);
                        }
                    }
                    else {
                        flSetDefaults = true;
                    }
                }
                else {
                    flSetDefaults = true;
                }
            }
        } catch (err) {
            setLangRU();
            flSetDefaults = true;
        }
        if (flSetDefaults) {
            setDefaults();
        }
    }

    //////////////////
    /// Prop & Meth //
    //////////////////
    return {
        addPositiveAnswer: addPositiveAnswer,
        addNegativeAnswer: addNegativeAnswer,
        addNeutralAnswer: addNeutralAnswer,
        delAllAnswers: delAllAnswers,
        getAnswer: getAnswer,
        setLangRU: setLangRU,
        setLangEN: setLangEN,
        isLangRU: isLangRU,
        isLangEN: isLangEN,
        delAnswer: delAnswer,
        setDefaults: setDefaults,
        saveAnswers: saveAnswers,
        loadAnswers: loadAnswers,
        answers: answers
    };

})();

//magicBall.loadAnswers();
//alert('test');