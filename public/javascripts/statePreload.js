var MagicBallz = MagicBallz || {};

MagicBallz.statePreload = function () { };

MagicBallz.statePreload.prototype = {

    preload: function () {
        //show logo in loading screen
        this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logoS');
        this.splash.anchor.setTo(0.5);

        this.load.image('backgroundS', 'images/background.png');
        this.load.image('magicballS', 'images/magicball.png');
        this.load.image('wallS', 'images/wall.png');
        this.load.image('answerS', 'images/answer.png');
        this.load.image('cloud1S', 'images/cloud1.png');
        this.load.image('cloud2S', 'images/cloud2.png');
        this.load.image('webS', 'images/web.png');
        this.load.image('aboutS', 'images/about.png');
        this.load.image('settingsS', 'images/settings.png');
        this.load.image('addanswerS', 'images/addanswer.png');
        this.load.image('upS', 'images/up.png');
        this.load.image('downS', 'images/down.png');
        this.load.image('resetS', 'images/reset.png');
        this.load.image('backS', 'images/back.png');
        this.load.image('btnpanelS', 'images/btnpanel.png');
        this.load.image('delS', 'images/del.png');
        this.load.image('inputS', 'images/input.png');
        this.load.image('cancelS', 'images/cancel.png');
        this.load.spritesheet('langS', 'images/lang.png', 150, 150);
        this.load.spritesheet('spiderS', 'images/spider.png', 111, 68);
        this.load.spritesheet('skullS', 'images/skullAnimation.png', 122, 304);
        this.load.spritesheet('answertxtS', 'images/answertxt.png', 710, 200);
        this.load.spritesheet('positiveS', 'images/positive.png', 170, 170);
        this.load.spritesheet('neutralS', 'images/neutral.png', 170, 170);
        this.load.spritesheet('negativeS', 'images/negative.png', 170, 170);
        this.load.audio('knockA', 'sounds/tuk.mp3');
        this.load.audio('answerA', 'sounds/sound.mp3');
    },

    create: function () {
        function nextState() {
            this.game.state.start('stateMagicBall');
        }
        setTimeout(nextState.bind(this), 2000);
    }

};