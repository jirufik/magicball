var MagicBallz = MagicBallz || {};

MagicBallz.stateMagicBall = function () { };

MagicBallz.stateMagicBall.prototype = {

    create: function () {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        //this.game.physics.arcade.gravity.y = 200;
        this.background = this.game.add.sprite(0, 0, 'backgroundS');
        this.animationBall = false;
        this.CENTRE_X = this.game.world.centerX;
        this.CENTRE_Y = this.game.world.centerY;
        this.AUDIO_CNOCK = this.game.add.audio('knockA');
        this.AUDIO_CNOCK.loop = true;
        this.AUDIO_ANSWER = this.game.add.audio('answerA');
        this.showAbout = false;
        this.showCloud();
        this.showSkull();
        this.showSpider();
        this.createSettings();
        this.createAbout();
    },

    update: function () {
        if (this.game.input.activePointer.justPressed()) {
            if (!this.clickAbout() && !this.showAbout && !this.clickSettings()) {
                this.showBall();
                //this.showAnswer();
            }
        }
        this.skullGoToPoint();
        this.moveCloud();
        this.collideSpider();
    },

    ///BALL ANIMATION
    showBall: function () {

        if (!this.animationBall) {

            this.animationBall = true;

            this.wallS = this.game.add.sprite(this.CENTRE_X, this.CENTRE_Y, 'wallS');
            this.wallS.anchor.setTo(0.5, 0.5);
            this.wallS.scale.setTo(0.5);
            this.wallS.alpha = 0.5;

            this.answerS = this.game.add.sprite(this.CENTRE_X, this.CENTRE_Y, 'answerS');
            this.answerS.anchor.setTo(0.5, 0.27);
            this.answerS.scale.setTo(0.85);
            this.answerS.alpha = 0;

            this.magicBallS = this.game.add.sprite(this.CENTRE_X, this.CENTRE_Y, 'magicballS');
            this.magicBallS.anchor.setTo(0.5, 0.5);
            this.magicBallS.scale.setTo(0.5);
            this.magicBallS.alpha = 0.5;

            ///Scale and Alpha Ball
            var masSprites = [this.wallS, this.magicBallS];
            this.scaleSprites(masSprites, 1, 2000);
            this.alphaSprites(masSprites, 1, 1000);

            ///Move Ball
            masAnimation = [
                { moveByX: 40, moveByY: 0, duration: 200 },
                { moveByX: -40, moveByY: 0, duration: 100 },
                { moveByX: 38, moveByY: 12, duration: 200 },
                { moveByX: -35, moveByY: 8, duration: 100 },
                { moveByX: 18, moveByY: 40, duration: 200 },
                { moveByX: -20, moveByY: -40, duration: 200 },
                { moveByX: 14, moveByY: 40, duration: 200 },
                { moveByX: -10, moveByY: -40, duration: 100 },
                { moveByX: 0, moveByY: 0, duration: 100 }
            ];

            this.AUDIO_CNOCK.play();
            ///ANSWER ANIMATION
            var func = function () {
                this.AUDIO_CNOCK.stop();
                this.AUDIO_ANSWER.play();
                ///Scale, Rotate and Alpha Answer
                var angle = 12;
                var rnd = _.random(1);
                if (rnd === 0) {
                    angle = -12;
                }
                this.answerS.angle = angle;
                this.showAnswer();
                this.alphaSprites([this.answerS], 1, 3000);
                this.rotateSprites([this.answerS], 0, 3000);
                this.scaleSprites([this.answerS], 1.05, 3000);
                // this.scaleSprites([this.answerS], 1.05, 3000, function () {
                //     //this.scaleSprites([this.answerS], 1.05, 5000, this.stopAnimationBall);
                //     this.scaleSprites([this.answerS], 1.05, 000);
                // });

            };

            this.moveSprites(masSprites, masAnimation, func);
        }

    },

    ///SCALE
    scaleSprites: function (masSprites, sizeScale, timeTween, funcOnComplete) {
        sizeScale = sizeScale || 1;
        timeTween = timeTween || 3000;
        if (Array.isArray(masSprites)) {
            if (masSprites.length > 0) {
                for (var i = 0; i < masSprites.length; i++) {
                    var tmpSprite = masSprites[i];
                    if (tmpSprite.scale) {
                        var scaleTween = this.game.add.tween(tmpSprite.scale);
                        scaleTween.to({ x: sizeScale, y: sizeScale }, timeTween, Phaser.Easing.Linear.None, true);
                        if ((i === 0) && (typeof funcOnComplete === 'function')) {
                            scaleTween.onComplete.add(funcOnComplete, this);
                        }
                    }
                }
            }
        }
    },

    ///ROTATE
    rotateSprites: function (masSprites, rotateAngle, timeTween, funcOnComplete) {
        if (typeof rotateAngle !== 'number') {
            rotateAngle = 0;
        }
        timeTween = timeTween || 3000;
        if (Array.isArray(masSprites)) {
            if (masSprites.length > 0) {
                for (var i = 0; i < masSprites.length; i++) {
                    var tmpSprite = masSprites[i];
                    if (tmpSprite.angle) {
                        var rotateTween = this.game.add.tween(tmpSprite);
                        rotateTween.to({ angle: rotateAngle }, timeTween, Phaser.Easing.Linear.None, true);
                        if ((i === 0) && (typeof funcOnComplete === 'function')) {
                            rotateTween.onComplete.add(funcOnComplete, this);
                        }
                    }
                }
            }
        }
    },

    ///ALPHA
    alphaSprites: function (masSprites, alphaValue, timeTween, funcOnComplete) {
        alphaValue = alphaValue || 1;
        timeTween = timeTween || 3000;
        if (Array.isArray(masSprites)) {
            if (masSprites.length > 0) {
                for (var i = 0; i < masSprites.length; i++) {
                    var tmpSprite = masSprites[i];
                    if (tmpSprite.scale) {
                        var alphaTween = this.game.add.tween(tmpSprite);
                        alphaTween.to({ alpha: alphaValue }, timeTween, Phaser.Easing.Linear.None, true);
                        if ((i === 0) && (typeof funcOnComplete === 'function')) {
                            alphaTween.onComplete.add(funcOnComplete, this);
                        }
                    }
                }
            }
        }
    },

    ///MOVE
    moveSprites: function (masSprites, masAnimation, funcOnComplete) {
        if (Array.isArray(masSprites) && Array.isArray(masAnimation)) {
            if (masSprites.length > 0 && masAnimation.length > 0) {

                if (masAnimation.length > 0) {

                    var animationFrame = masAnimation[0];
                    var moveByX = animationFrame.moveByX;
                    var moveByY = animationFrame.moveByY;
                    var duration = animationFrame.duration;

                    for (var i = 0; i < masSprites.length; i++) {
                        var tmpSprite = masSprites[i];
                        var moveTween = this.game.add.tween(tmpSprite).to({
                            x: tmpSprite.x + moveByX,
                            y: tmpSprite.y + moveByY
                        }, duration, Phaser.Easing.Linear.None, true);
                        if ((masAnimation.length === 1) && (typeof funcOnComplete === 'function') && (i === masSprites.length - 1)) {
                            moveTween.onComplete.add(funcOnComplete, this);
                        }
                        else {
                            if (i === masSprites.length - 1) {
                                masAnimation.splice(0, 1);
                                moveTween.onComplete.add(function () { this.moveSprites(masSprites, masAnimation, funcOnComplete); }, this);
                            }
                        }
                    }

                }

            }
        }
    },

    stopAnimationBall: function () {
        this.answerS.destroy();
        this.magicBallS.destroy();
        this.wallS.destroy();
        // this.txtAnswer5.destroy();
        // this.txtAnswer1.destroy();
        // this.txtAnswer2.destroy();
        // this.txtAnswer3.destroy();
        // this.txtAnswer4.destroy();
        // this.animationBall = false;
    },
    ///END BALL ANIMATION

    ///ANIMATION ANSWER TEXT
    showAnswer: function () {

        var answer = magicBall.getAnswer();
        var style = { font: 'Sans', fontSize: '20px', fill: '#FFF' };
        var angle = this.answerS.angle;
        var x = this.CENTRE_X;
        var y = this.CENTRE_Y - 30;
        var offset = 27;
        var textLines = this.getAnswerText(answer.text);//'сконцентрируйся и спроси опять это длинное 12'
        var nameText = 'txtAnswer';
        var countText = 5;
        var masSprites = [];

        for (var i = 1; i <= countText; i++) {
            this[nameText + i] = this.game.add.text(x, y, textLines['text' + i], style);
            this[nameText + i].anchor.setTo(0.5, 0.5);
            this[nameText + i].angle = angle;
            this[nameText + i].scale.setTo(0.8);
            this[nameText + i].alpha = 0;
            masSprites.push(this[nameText + i]);
            y += offset;
        }

        this.alphaSprites(masSprites, 1, 3000);
        this.rotateSprites(masSprites, 0, 3000);
        this.scaleSprites(masSprites, 1, 3000, this.endShowText);
    },

    ///Answer text to triangle
    getAnswerText: function (textAnswer) {

        var text1 = {
            text: '',
            length: 15
        };
        var text2 = {
            text: '',
            length: 13
        };
        var text3 = {
            text: '',
            length: 11
        };
        var text4 = {
            text: '',
            length: 9
        };
        var text5 = {
            text: '',
            length: 6
        };

        ///Разбиваем ответ на массив слов
        var masWords = textAnswer.split(' ');
        ///Если ИСТИНА то продолжаем парсить, если ЛОЖЬ то все распарсили
        var flGo = true;
        ///Содержит объекты для решения проблемы:
        ///{ badWord: 'blablablablabla', length: 13, freeChars: 13}
        var problem = [];
        var countBreak = 0;
        ///Массив родительской проблемы, содержит елементы самого первого
        ///варианта массива проблема
        var parentProblem = [];
        var countIteration = 0;
        var firstIndex = 0;

        while (flGo) {

            if (countBreak >= 40) break;

            var lengthText = text3.length;
            if ((textAnswer.length <= lengthText) && (flGo)) {
                makeText(text3);
            }

            lengthText = text2.length;
            if ((textAnswer.length <= lengthText) && (flGo)) {
                makeText(text2);
            }

            lengthText = text2.length + text3.length;
            if ((textAnswer.length <= lengthText) && (flGo)) {
                makeText(text2, text3);
            }

            lengthText = text2.length + text3.length + text4.length;
            if ((textAnswer.length <= lengthText) && (flGo)) {
                makeText(text2, text3, text4);
            }

            lengthText = text1.length + text2.length + text3.length;
            if ((textAnswer.length <= lengthText) && (flGo)) {
                makeText(text1, text2, text3);
            }

            lengthText = text1.length + text2.length + text3.length + text4.length;
            if ((textAnswer.length <= lengthText) && (flGo)) {
                makeText(text1, text2, text3, text4);
            }

            lengthText = text1.length + text2.length + text3.length + text4.length + text5.length;
            if ((textAnswer.length <= lengthText) && (flGo)) {
                makeText(text1, text2, text3, text4, text5);
            }

            ///проблема необходимо решить
            if (flGo) {

                ///Если решаем проблему первый раз, то занесем все варианты решения в родительский 
                ///масив который не изменится в отличии от массива проблем
                if (parentProblem.length === 0) {
                    parentProblem = problem.slice(1);
                    countIteration = 0;
                }
                ///Если были попытки решить проблему с первым вариантом
                ///Но он оказался провальным, то вернем проблему в начальное состояние
                ///Удалим первый вариант который оказался провальным и начнем решать 
                ///со следующего варианта
                if ((countIteration >= 4) && (parentProblem.length)) {
                    masWords = textAnswer.split(' ');
                    countIteration = 0;
                    problem.length = 0;
                    parentProblem.splice(0, firstIndex + 1);
                    problem = parentProblem.slice(1);
                    firstIndex = 0;
                    //console.dir(problem);
                }


                //console.log(badWord + ' ' + freeLength);
                if (problem.length > 0) {
                    for (var i = 0; i < problem.length; i++) {
                        var objProblem = problem[i];
                        var indexBadWord = masWords.indexOf(objProblem.badWord);
                        var badWord = objProblem.badWord;
                        ///Если строка последовательности полностью пустая
                        if (objProblem.length === objProblem.freeChars) {
                            var newWord1 = badWord.substring(0, objProblem.length);
                            var newWord2 = badWord.substring(objProblem.length, badWord.length);
                            masWords.splice(indexBadWord, 1, newWord1, newWord2);
                            if (countIteration === 0) {
                                firstIndex = i;
                            }
                            break;
                        }
                        ///Если строка не пустая
                        else {
                            if (objProblem.freeChars >= 3) {
                                var newWord1 = badWord.substring(0, objProblem.freeChars - 1);
                                var newWord2 = badWord.substring(objProblem.freeChars - 1, badWord.length);
                                masWords.splice(indexBadWord, 1, newWord1, newWord2);
                                if (countIteration === 0) {
                                    firstIndex = i;
                                }
                                break;
                            }
                        }
                    }
                }
                problem.length = 0;
                countIteration++;
            }

            countBreak++;

        }

        return {
            text1: text1.text,
            text2: text2.text,
            text3: text3.text,
            text4: text4.text,
            text5: text5.text
        };

        function makeText() {
            var i = 0;
            ///Цикл по строкам 1 - 5
            for (var k = 0; k < arguments.length; k++) {

                ///Текущая строка
                var text = arguments[k];
                ///Цикл по словам ответа, слова начинаются с того места где остановилась предыдущая строчка
                ///т.е. слова вошедшие в предыдущую строку здесь больше не появятся
                for (; i < masWords.length; i++) {
                    ///если первое слово в строке то просто присваеваем его иначе слова в текущей строке
                    ///плюс пробел плюс текущее слово
                    var tmpText = (text.text.length === 0) ? masWords[i] : text.text + ' ' + masWords[i];
                    ///Если с текущим словом текст не длинее строки то добавим слово к строке
                    ///Иначе переходем к следующей строке
                    if (tmpText.length <= text.length) {
                        text.text = tmpText;
                        //console.log(text.text);
                        ///Если это слово в предыдущей строке последовательности было проблемным
                        ///А в текущую вошло, то удаляем все что связано с ним, т.к. проблема решена
                        if (problem.length > 0) {
                            for (var z = 0; z < problem.length; z++) {
                                if (problem[z].badWord === masWords[i]) {
                                    problem.splice(z, 1);
                                    z--;
                                }
                            }
                        }
                    }
                    else {
                        ///Предполагаем что слово плохое
                        var objProblem = {
                            badWord: masWords[i],
                            length: text.length,
                            freeChars: text.length - text.text.length
                        };
                        problem.push(objProblem);
                        ///Переходим к следующей строке последовательности
                        break;
                    }
                }
                //console.log(text);

            }

            //console.log((i + 1) + ' = ' + masWords.length);
            if (i + 1 >= masWords.length) {
                flGo = false;
                ///Если есть проблема необходимо ее решить
                if (problem.length > 0) {
                    flGo = true;
                    text1.text = '';
                    text2.text = '';
                    text3.text = '';
                    text4.text = '';
                    text5.text = '';
                }
            }
            else {
                text1.text = '';
                text2.text = '';
                text3.text = '';
                text4.text = '';
                text5.text = '';
            }

        }

    },

    endShowText: function () {
        var masText = [this.txtAnswer1, this.txtAnswer2, this.txtAnswer3, this.txtAnswer4, this.txtAnswer5];
        this.sizeFontTxt(masText, 80, 5000, this.destroyTextAnswer);

        var masSprites = [this.wallS, this.magicBallS, this.answerS];
        this.scaleSprites(masSprites, 4.20, 5000, this.stopAnimationBall);

        var tmpText = this.txtAnswer1;
        this.game.add.tween(tmpText).to({
            x: tmpText.x,
            y: tmpText.y - 110
        }, 5000, Phaser.Easing.Linear.None, true);

        tmpText = this.txtAnswer2;
        this.game.add.tween(tmpText).to({
            x: tmpText.x,
            y: tmpText.y - 40
        }, 5000, Phaser.Easing.Linear.None, true);

        tmpText = this.txtAnswer3;
        this.game.add.tween(tmpText).to({
            x: tmpText.x,
            y: tmpText.y + 20
        }, 5000, Phaser.Easing.Linear.None, true);

        tmpText = this.txtAnswer4;
        this.game.add.tween(tmpText).to({
            x: tmpText.x,
            y: tmpText.y + 80
        }, 5000, Phaser.Easing.Linear.None, true);

        tmpText = this.txtAnswer5;
        this.game.add.tween(tmpText).to({
            x: tmpText.x,
            y: tmpText.y + 160
        }, 5000, Phaser.Easing.Linear.None, true);
    },

    destroyTextAnswer: function () {
        this.txtAnswer5.destroy();
        this.txtAnswer1.destroy();
        this.txtAnswer2.destroy();
        this.txtAnswer3.destroy();
        this.txtAnswer4.destroy();
        this.animationBall = false;
    },

    ///SIZE FONT TEXT
    sizeFontTxt: function (masText, textSize, timeTween, funcOnComplete) {
        textSize = textSize || 20;
        timeTween = timeTween || 3000;
        if (Array.isArray(masText)) {
            if (masText.length > 0) {
                for (var i = 0; i < masText.length; i++) {
                    var tmpText = masText[i];
                    if (tmpText.fontSize) {
                        var sizeTween = this.game.add.tween(tmpText);
                        sizeTween.to({ fontSize: textSize }, timeTween, Phaser.Easing.Linear.None, true);
                        if ((i === 0) && (typeof funcOnComplete === 'function')) {
                            sizeTween.onComplete.add(funcOnComplete, this);
                        }
                    }
                }
            }
        }
    },
    ///END ANIMATION ANSWER TEXT

    ///ANIMATION SKULL
    showSkull: function () {
        //if (!this.game.device.touch) {
        //this.skullS = this.game.add.sprite(400, 300, 'skullS');
        this.skullS = this.game.add.sprite(400, 300, 'skullS');
        this.skullS.animations.add('skullAnimation', [0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1], 6, true);
        this.skullS.anchor.setTo(0.5, 0.1);
        this.game.physics.enable(this.skullS, Phaser.Physics.ARCADE);
        this.skullS.body.allowRotation = false;
        this.skullS.body.setCircle(80);
        this.skullS.animations.play('skullAnimation');
        this.positionX = 100;
        this.positionY = 1300;
        //}
    },

    skullGoToPoint: function () {
        if (this.skullS) {
            if (!this.game.device.touch) {
                this.skullS.rotation = this.game.physics.arcade.moveToPointer(this.skullS, 10, this.game.input.activePointer, 1200);
            }
            else {
                var speed = _.random(1200, 3000);
                //this.skullS.rotation = this.game.physics.arcade.moveToXY(this.skullS, this.positionX, this.positionY, 10, speed);
                this.game.physics.arcade.moveToXY(this.skullS, this.positionX, this.positionY, 10, speed);
                var distance = this.game.physics.arcade.distanceToXY(this.skullS, this.positionX, this.positionY);
                if (distance <= 100) {
                    this.positionX = _.random(10, 740);
                    this.positionY = _.random(10, 1320);
                }
            }
        }
    },
    ///END ANIMATION SKULL

    ///ANIMATION CLOUD
    showCloud: function () {

        this.cloud1Animation = false;
        this.cloud2Animation = false;
        this.cloud1 = this.game.add.sprite(1030, 100, 'cloud1S');
        this.cloud1.anchor.setTo(0.5, 0.5);

        this.cloud2 = this.game.add.sprite(960, 300, 'cloud2S');
        this.cloud2.anchor.setTo(0.5, 0.5);

    },

    moveCloud: function () {

        if (!this.cloud1Animation) {
            this.cloud1.scale.setTo(_.random(5, 12) / 10);
            this.cloud1.y = _.random(90, 300);
            this.cloud1.x = this.cloud1.width / 2 + 760;
            var setCloud = [{ moveByX: - (this.cloud1.width + 760), moveByY: 0, duration: _.random(25000, 40000) }];
            this.moveSprites([this.cloud1], setCloud, function () { this.cloud1Animation = false; });
            this.cloud1Animation = true;
        }

        if (!this.cloud2Animation) {
            this.cloud2.scale.setTo(_.random(5, 12) / 10);
            this.cloud2.y = _.random(130, 350);
            this.cloud2.x = this.cloud2.width / 2 + 760;
            var setCloud = [{ moveByX: - (this.cloud2.width + 760), moveByY: 0, duration: _.random(20000, 30000) }];
            this.moveSprites([this.cloud2], setCloud, function () { this.cloud2Animation = false; });
            this.cloud2Animation = true;
        }

    },
    ///END ANIMATION CLOUD

    ///ANIMATION SPIDER
    showSpider: function () {
        this.webS = this.game.add.sprite(160, 875, 'webS');
        this.webS.anchor.setTo(0.5, 0);
        this.spiderS = this.game.add.sprite(160, 1023, 'spiderS');
        this.spiderS.animations.add('spiderBlinking', [3, 2, 1, 0, 1, 2, 3, 3, 3, 3, 3, 3, 3], 5, true);
        this.spiderS.anchor.setTo(0.5, 0.5);
        this.spiderS.animations.play('spiderBlinking');
        this.game.physics.enable(this.spiderS, Phaser.Physics.ARCADE);
        ///Эластичность отскакивания координаты
        this.spiderS.body.bounce.y = 0.4;
        ///Гравитация относительно объекта координаты
        this.spiderS.body.gravity.y = 0;
        this.spiderS.body.setCircle(34);
        this.spiderS.body.allowRotation = false;
        this.spiderS.body.collideWorldBounds = true;
    },

    collideSpider: function () {
        if (this.spiderS && this.skullS) {
            this.game.physics.arcade.collide(this.spiderS, this.skullS, this.moveSpider, null, this);
        }
        if (this.spiderS.x <= 160 && this.spiderS.y >= 1298) {
            this.spiderS.animations.play('spiderBlinking');
            this.spiderS.body.velocity.x = 0;
            this.spiderS.body.velocity.y = 0;
            this.spiderS.body.gravity.y = -170;
            this.webS.x = this.spiderS.x;
            this.webS.scale.setTo(1, 3);
            this.webS.alpha = 1;
        }
        if (this.spiderS.body.gravity.y < 0) {
            var scaleY = 3;
            var posWebY = 875 + this.webS.height + 10;

            while (posWebY > this.spiderS.y) {
                this.webS.scale.setTo(1, scaleY);
                posWebY = 875 + this.webS.height + 10;
                scaleY -= 0.1;
            }
        }
        if (this.spiderS.body.gravity.y < 0 && this.spiderS.y <= 1023) {
            this.spiderS.body.gravity.y = 0;
            this.spiderS.body.velocity.x = 0;
            this.spiderS.body.velocity.y = 0;
            this.webS.scale.setTo(1, 1);
            this.skullS.body.checkCollision.none = false;
        }

    },

    moveSpider: function () {
        if (this.spiderS) {
            this.webS.alpha = 0;
            this.spiderS.animations.stop();
            this.spiderS.frame = 5;
            this.skullS.body.checkCollision.none = true;
            this.spiderS.body.gravity.y = 170;
            this.spiderS.body.bounce.y = 0.2;
            this.spiderS.body.velocity.x = 40;
            this.spiderS.body.velocity.y = -170;
            this.game.time.events.add(Phaser.Timer.SECOND * 4, this.upSpider, this);
        }
    },

    upSpider: function () {
        this.spiderS.body.bounce.y = 0;
        this.spiderS.body.velocity.x = 0;
        this.spiderS.body.velocity.y = 0;
        this.spiderS.body.bounce.y = 0;
        this.game.physics.arcade.moveToXY(this.spiderS, 160, 1300, 10, 2000);
    },
    ///END ANIMATION SPIDER

    ///ANIMATION ABOUT
    createAbout: function () {
        this.aboutS = this.game.add.sprite(0, -1334, 'aboutS');
        this.aboutS.inputEnabled = true;
        //события касания вызываются только для непрозрачных частей спрайта
        //this.aboutS.input.pixelPerfectClick = true;
        this.aboutS.events.onInputDown.add(this.showCloseAbout, this);
        this.game.physics.enable(this.aboutS, Phaser.Physics.ARCADE);
        ///Эластичность отскакивания координаты
        this.aboutS.body.bounce.y = 0.3;
        ///Гравитация относительно объекта координаты
        this.aboutS.body.gravity.y = 0;
        this.aboutS.body.setSize(1, 1, 690, 1335);
        this.aboutS.body.collideWorldBounds = false;
    },

    showCloseAbout: function () {
        if (this.aboutS.y < -1330) {
            if (this.clickAbout() && !this.animationBall) {
                this.aboutS.body.collideWorldBounds = true;
                this.showAbout = true;
                this.aboutS.body.gravity.y = 200;
            }
        }
        if (this.aboutS.y > -5) {
            this.aboutS.body.collideWorldBounds = false;
            this.aboutS.body.gravity.y = 0;
            var tweenMove = this.game.add.tween(this.aboutS).to({ y: -1334 }, 3000, Phaser.Easing.Linear.None, true);
            tweenMove.onComplete.add(function () { this.showAbout = false; }, this);
        }
    },

    clickAbout: function () {
        var activeX = this.game.input.x;
        var activeY = this.game.input.y;
        var yesX = (activeX >= 635);
        var yesY = (activeY < 145);
        if (yesX && yesY) {
            return true;
        }
        return false;
    },
    ///END ANIMATION ABOUT

    ///SETTINGS
    createSettings: function () {
        this.settingsS = this.game.add.sprite(655, 1230, 'settingsS');
        this.settingsS.inputEnabled = true;
        this.settingsS.events.onInputDown.add(this.goToSettings, this);
    },

    goToSettings: function () {
        if (this.clickSettings()) {
            this.game.state.start('stateSettings');
        }
    },

    clickSettings: function () {
        var activeX = this.game.input.x;
        var activeY = this.game.input.y;
        var yesX = (activeX >= 635);
        var yesY = (activeY > 1225);
        if (yesX && yesY && !this.showAbout && !this.animationBall) {
            return true;
        }
        return false;
    },
    ///END SETTINGS

    render: function () {
        // if (this.skullS) {
        //     //this.game.debug.spriteInputInfo(this.skullS, 32, 32);
        //     this.game.debug.spriteInfo(this.skullS, 30, 100);
        // }
        // //this.game.debug.geom(this.aboutS.input._tempPoint);
    }

};