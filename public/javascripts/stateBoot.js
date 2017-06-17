var MagicBallz = MagicBallz || {};

MagicBallz.stateBoot = function () { };

MagicBallz.stateBoot.prototype = {

    preload: function () {
        this.load.image('logoS', 'images/logo.png');
    },

    create: function () {
        //loading screen will have a white background
        this.game.stage.backgroundColor = '#FFFFFF';

        //scaling options
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        //this.scale.minWidth = 240;
        //this.scale.minHeight = 170;
        //this.scale.maxWidth = 2880;
        //this.scale.maxHeight = 1920;
        
        //have the game centered horizontally
        this.scale.pageAlignHorizontally = true;

        this.game.state.start('statePreload');
    }

};