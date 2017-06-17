var MagicBallz = MagicBallz || {};

MagicBallz.stateSettings = function () {
};

MagicBallz.stateSettings.prototype = {

    create: function () {
        this.NAME_ANSWER = 'answertxtS';
        // addPositiveAnswer addNeutralAnswer addNegativeAnswer
        this.typeAnswer = 'addNeutralAnswer';  
        this.curAnswer = null;
        this.previousPos = 170;
        this.background = this.game.add.sprite(0, 0, 'backgroundS');
        this.flUpAnswers = false;
        this.flDownAnswers = false;
        this.posY = 170;
        this.showButtons();
        this.showAnswers();
    },

    update: function () {
        this.moveAnswers();
        this.answersToPlace();
    },

    ///SHOW BUTTONS
    showButtons: function () {

        this.btnpanelS = this.game.add.sprite(0, 0, 'btnpanelS');

        ///back
        this.backS = this.game.add.sprite(0, 1184, 'backS');
        this.backS.inputEnabled = true;
        this.backS.events.onInputDown.add(this.goToMagicBall, this);

        ///add answer
        this.addAnswerS = this.game.add.sprite(0, 0, 'addanswerS');
        this.addAnswerS.inputEnabled = true;
        this.addAnswerS.events.onInputDown.add(this.showInput, this);

        ///up
        this.upS = this.game.add.sprite(150, 0, 'upS');
        this.upS.inputEnabled = true;
        this.upS.events.onInputDown.add(this.moveUp, this);
        this.upS.events.onInputUp.add(this.moveUpStop, this);

        ///down
        this.downS = this.game.add.sprite(300, 0, 'downS');
        this.downS.inputEnabled = true;
        this.downS.events.onInputDown.add(this.moveDown, this);
        this.downS.events.onInputUp.add(this.moveDownStop, this);

        ///reset
        this.resetS = this.game.add.sprite(450, 0, 'resetS');
        this.resetS.inputEnabled = true;
        this.resetS.events.onInputDown.add(this.setDefault, this);

        ///language
        this.langS = this.game.add.sprite(600, 0, 'langS');
        this.langS.inputEnabled = true;
        this.langS.events.onInputDown.add(this.changeLang, this);
        if (magicBall.isLangEN()) this.langS.frame = 1;
        if (magicBall.isLangRU()) this.langS.frame = 0;

    },
    ///SHOW BUTTONS END

    spritesTop: function () {
        this.game.world.bringToTop(this.btnpanelS);
        this.game.world.bringToTop(this.backS);
        this.game.world.bringToTop(this.addAnswerS);
        this.game.world.bringToTop(this.upS);
        this.game.world.bringToTop(this.downS);
        this.game.world.bringToTop(this.resetS);
        this.game.world.bringToTop(this.langS);
    },

    changeLang: function () {

        this.posY = 170;
        this.clearAnswers();
        if (magicBall.isLangEN()) {
            magicBall.setLangRU();
            this.langS.frame = 0;
        }
        else if (magicBall.isLangRU()) {
            magicBall.setLangEN();
            this.langS.frame = 1;
        }
        this.showAnswers();
    },

    setDefault: function () {
        this.posY = 170;
        this.clearAnswers();
        magicBall.setDefaults();
        this.showAnswers();
    },

    goToMagicBall: function () {
        this.game.state.start('stateMagicBall');
    },

    ///SHOW ANSWERS
    showAnswers: function () {

        var posX = 20;
        var posY = this.posY;//170;
        var offset = 220;
        var answers = magicBall.answers;

        for (var i = 0; i < answers.length; i++) {

            var answer = answers[i];
            var typeAnswer = 0;
            if (answer.isPositiveAnswer()) typeAnswer = 0;
            if (answer.isNeutralAnswer()) typeAnswer = 1;
            if (answer.isNegativeAnswer()) typeAnswer = 2;

            this[this.NAME_ANSWER + i] = this.game.add.sprite(posX, posY, 'answertxtS', typeAnswer);
            this[this.NAME_ANSWER + i].inputEnabled = true;
            this[this.NAME_ANSWER + i].input.enableDrag();
            this[this.NAME_ANSWER + i].input.allowHorizontalDrag = false;
            this[this.NAME_ANSWER + i].input.allowVerticalDrag = true;
            this[this.NAME_ANSWER + i].events.onInputDown.add(this.dragStart, this);

            this[this.NAME_ANSWER + i].events.onDragStart.add(this.dragStart, this);
            this[this.NAME_ANSWER + i].events.onDragUpdate.add(this.dragUpdate, this);
            this[this.NAME_ANSWER + i].events.onDragStop.add(this.dragStop, this);

            ///text answer
            var style = {font: 'Sans', fontSize: '60px', fill: '#000'};
            var text = answer.text;
            var tmpText = this.game.make.text(10, 10, text, style);
            tmpText.wordWrap = true;
            tmpText.wordWrapWidth = 690;
            tmpText.align = 'center';
            tmpText.boundsAlignH = 'center';
            tmpText.boundsAlignV = 'middle';
            tmpText.setTextBounds(10, 10, 680, 170);
            this[this.NAME_ANSWER + i].addChild(tmpText);

            ///button del
            var tmpSprite = this.game.make.sprite(510, 0, 'delS');
            tmpSprite.inputEnabled = false;
            tmpSprite.alpha = 0;
            tmpSprite.events.onInputDown.add(this.delAnswer, this);
            this[this.NAME_ANSWER + i].addChild(tmpSprite);

            //this.curAnswer = this[this.NAME_ANSWER + i];
            posY += offset;

        }
        this.spritesTop();
    },

    dragStart: function (answerSprite) {
        if (this.curAnswer === null) {
            this.curAnswer = answerSprite;
            this.previousPos = answerSprite.y;
            this.disableDrag();
            ///btn del
            var btnDel = answerSprite.children[1];
            btnDel.inputEnabled = true;
            btnDel.alpha = 1;
        }
    },

    dragUpdate: function () {

        if (this.curAnswer != null) {

            var offset = this.previousPos - this.curAnswer.y;
            var answers = magicBall.answers;
            //console.log(offset);

            for (var i = 0; i < answers.length; i++) {

                if (this[this.NAME_ANSWER + i] != this.curAnswer) {
                    this[this.NAME_ANSWER + i].y -= offset;
                }

            }

            this.previousPos = this.curAnswer.y;
        }

    },

    dragStop: function () {
        this.curAnswer = null;
        this.enableDrag();
        //this.previousPos = answerSprite.y;
    },

    clearAnswers: function () {

        var answers = magicBall.answers;

        for (var i = 0; i < answers.length; i++) {
            this[this.NAME_ANSWER + i].destroy();
        }
    },

    answersToPlace: function () {

        if (this.curAnswer === null) {

            var offset = 0;
            if (this.firstAboard()) offset = -10;
            if (this.lastAboard()) offset = 10;
            if (this.firstAboard() && this.lastAboard()) offset = 0;

            if (offset != 0) {

                var answers = magicBall.answers;
                for (var i = 0; i < answers.length; i++) {
                    this[this.NAME_ANSWER + i].y += offset;
                }

            }
        }

    },

    disableDrag: function () {
        var answers = magicBall.answers;
        for (var i = 0; i < answers.length; i++) {
            var answer = this[this.NAME_ANSWER + i];
            if (this.curAnswer != answer) {
                answer.input.disableDrag();
                ///button del disable
                //console.log(answer.children[1].key);
                var btnDel = answer.children[1];
                btnDel.inputEnabled = false;
                btnDel.alpha = 0;
            }
        }
    },

    enableDrag: function () {
        var answers = magicBall.answers;
        for (var i = 0; i < answers.length; i++) {
            this[this.NAME_ANSWER + i].input.enableDrag();
        }
    },

    delAnswer: function (answerSprite) {
        var length = magicBall.answers.length;
        if (length > 1) {
            var txt = answerSprite.parent.children[0].text;
            this.posY = this[this.NAME_ANSWER + 0].y;
            //console.log(answerSprite.parent);
            this.clearAnswers();
            magicBall.delAnswer(txt);
            this.showAnswers();
        }
    },
    ///END SHOW ANSWERS

    ///SHOW INPUT

    showInput: function () {

        this.typeAnswer = 'addNeutralAnswer';
        
        this.inputBackgroundS = this.game.add.sprite(0, 0, 'backgroundS');

        this.cancelS = this.game.add.sprite(400, 900, 'cancelS');
        this.cancelS.inputEnabled = true;
        this.cancelS.events.onInputDown.add(this.closeInput, this);

        this.inputS = this.game.add.sprite(80, 900, 'inputS');
        this.inputS.inputEnabled = true;
        this.inputS.events.onInputDown.add(this.addAnswer, this);

        this.positiveS = this.game.add.sprite(80, 500, 'positiveS');
        this.positiveS.inputEnabled = true;
        this.positiveS.events.onInputDown.add(this.setPositiveAnswer, this);
        this.positiveS.frame = 1;

        this.neutralS = this.game.add.sprite(290, 500, 'neutralS');
        this.neutralS.inputEnabled = true;
        this.neutralS.events.onInputDown.add(this.setNeutralAnswer, this);
        this.neutralS.frame = 0;

        this.negativeS = this.game.add.sprite(500, 500, 'negativeS');
        this.negativeS.inputEnabled = true;
        this.negativeS.events.onInputDown.add(this.setNegativeAnswer, this);
        this.negativeS.frame = 1;

        var text = ' Input answer';
        if (magicBall.isLangRU()) text = ' Введите ответ';
        this.inputAnswerField = this.game.add.inputField(20, 200, {
            font: '64px Eras Bold ITC',
            fill: '#212121',
            //fill: '#FFFFFF',
            fillAlpha: 0.5,
            fontWeight: 'bold',
            width: 685,
            height: 70,
            max: 45,
            min: 1,
            padding: 8,
            borderWidth: 10,
            borderColor: '#FFFFFF',
            borderRadius: 0,
            placeHolder: text,
            textAlign: 'center',
            zoom: false
        });
        ///Привет думаю что может бы да но возможно и нет вся
        //this.inputAnswerField.setText('123456');
        ///Что бы неотрабатывали назначеные клавишам колбэки когда вводим имя
        this.inputAnswerField.blockInput = true;
        this.inputAnswerField.zoom = false;
        //Fabrique.Plugins.InputField.KeyboardOpen = true;

    },

    // addPositiveAnswer addNeutralAnswer addNegativeAnswer
    setPositiveAnswer: function () {
        this.typeAnswer = 'addPositiveAnswer';
        this.positiveS.frame = 0;
        this.neutralS.frame = 1;
        this.negativeS.frame = 1;
    },

    setNeutralAnswer: function () {
        this.typeAnswer = 'addNeutralAnswer';
        this.positiveS.frame = 1;
        this.neutralS.frame = 0;
        this.negativeS.frame = 1;
    },

    setNegativeAnswer: function () {
        this.typeAnswer = 'addNegativeAnswer';
        this.positiveS.frame = 1;
        this.neutralS.frame = 1;
        this.negativeS.frame = 0;
    },

    addAnswer: function () {
        
        this.posY = this[this.NAME_ANSWER + 0].y;

        this.clearAnswers();
        var text = this.inputAnswerField.text.text;
        if (text.length > 1) {
           magicBall[this.typeAnswer](text); 
        }
        this.closeInput();
        this.showAnswers();
    },

    closeInput: function () {
        this.inputBackgroundS.destroy();
        this.cancelS.destroy();
        this.inputS.destroy();
        this.positiveS.destroy();
        this.neutralS.destroy();
        this.negativeS.destroy();
        this.inputAnswerField.destroy();
    },

    ///END SHOW INPUT

    ///BUTTON UP DOWN
    moveDown: function () {
        this.flDownAnswers = true;
        this.flUpAnswers = false;
    },

    moveDownStop: function () {
        this.flDownAnswers = false;
    },

    moveUp: function () {
        this.flDownAnswers = false;
        this.flUpAnswers = true;
    },

    moveUpStop: function () {
        this.flUpAnswers = false;
    },

    moveAnswers: function () {

        this.firstAboard();
        this.lastAboard();

        if (this.flDownAnswers || this.flUpAnswers) {

            var answers = magicBall.answers;
            var offset = 0;

            if (this.flDownAnswers) offset = -10;
            if (this.flUpAnswers) offset = 10;
            if (this.flDownAnswers && this.flUpAnswers) offset = 10;
            for (var i = 0; i < answers.length; i++) {
                this[this.NAME_ANSWER + i].y += offset;
            }

        }

    },

    firstAboard: function () {

        var answers = magicBall.answers;
        var length = answers.length;

        if (length) {
            var firstPos = this[this.NAME_ANSWER + 0].y;
            if (firstPos >= 170) {
                this.flUpAnswers = false;
                return true;
            }
        }

        return false;
    },

    lastAboard: function () {

        var answers = magicBall.answers;
        var length = answers.length;

        if (length) {
            var firstPos = this[this.NAME_ANSWER + (length - 1)].y;
            if (firstPos <= 964) {
                this.flDownAnswers = false;
                return true;
            }
        }

        return false;
    },
    ///END BUTTON UP DOWN


    render: function () {
        //Phaser.DebugUtils.renderInputInfo(100, 100);
    }


};