var MagicBallz = MagicBallz || {};

MagicBallz.game = new Phaser.Game(
    750,
    1334,
    Phaser.AUTO,
    '#magicball'
);

magicBall.loadAnswers();
//magicBall.setDefaults();

Phaser.Device.whenReady(function () {
    MagicBallz.game.plugins.add(Fabrique.Plugins.InputField);
    //game.plugins.add(Fabrique.Plugins.NineSlice);
});

MagicBallz.game.state.add('stateBoot', MagicBallz.stateBoot);
MagicBallz.game.state.add('statePreload', MagicBallz.statePreload);
MagicBallz.game.state.add('stateMagicBall', MagicBallz.stateMagicBall);
MagicBallz.game.state.add('stateSettings', MagicBallz.stateSettings);
MagicBallz.game.state.start('stateBoot');