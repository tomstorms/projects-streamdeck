/** 
 * 
 * https://www.npmjs.com/package/elgato-stream-deck
 * https://github.com/arvydas/blinkstick-node
 *
 */


const path = require('path')
const { openStreamDeck } = require('elgato-stream-deck')
global.myStreamDeck = openStreamDeck();

const blinkstick = require('./lib/blinkstick');
global.blinkstickDevice = blinkstick.findFirst();

const sharp = require('sharp');

// Prepare events

var lastKeyIndex = '';
var tapCount = 0;
var longTapTimer;
var isLongTap = false;


// Prepare Deck

var currentDeck = 0; // home
var decks = [];
// var homeTiles = [];

const plugins = [
    './plugins/blinkstick/blinkstick',
    './plugins/gmail/gmail',
];

function loadDecks() {

    plugins.forEach(function(pluginPath) {
        const plugin = require(pluginPath);
        decks.push(plugin.getDeck());
    });

    loadHomeDeck();

}
loadDecks();


function loadHomeDeck() {

    var homeDeck = {
        id: 'home',
        name: 'Home',
        tiles: [],
    };

    plugins.forEach(function(pluginPath) {
        const plugin = require(pluginPath);
        homeDeck.tiles.push(plugin.getHomeTile());
    });

    decks.unshift(homeDeck);
}



// return;

// // -----
// // LOAD PLUGINS

// //TODO: create an array of plugins, then assume those functions exist then load
// // This also need to be dynamic to update the screen every time!
// // Also need a loop to refresh the current deck after x seconds

// const pluginBlinkstick = require('./plugins/blinkstick/blinkstick');

// decks.push(pluginBlinkstick.getDeck());

// const pluginGmail = require('./plugins/gmail/gmail');

// decks.push(pluginGmail.getDeck());

// // -----





// ...


global.loadImageInKey = function(key, imagePath) {
    sharp(path.resolve(__dirname, imagePath))
        .flatten() // Eliminate alpha channel, if any.
        .resize(myStreamDeck.ICON_SIZE, myStreamDeck.ICON_SIZE) // Scale up/down to the right size, cropping if necessary.
        .raw() // Give us uncompressed RGB.
        .toBuffer()
        .then((buffer) => {
            myStreamDeck.fillImage(key, buffer)
        })
        .catch((err) => {
            console.error(err)
        })

}

global.loadImageInDeck = function(imagePath) {
    sharp(path.resolve(__dirname, imagePath))
        .flatten() // Eliminate alpha channel, if any.
        .resize(myStreamDeck.ICON_SIZE * myStreamDeck.KEY_COLUMNS, myStreamDeck.ICON_SIZE * myStreamDeck.KEY_ROWS) // Scale up/down to the right size, cropping if necessary.
        .raw() // Give us uncompressed RGB.
        .toBuffer()
        .then((buffer) => {
            myStreamDeck.fillPanel(buffer)
        })
        .catch((err) => {
            console.error(err)
        })

}

function reset() {

    // Turn off Blinkstick if available
    if (blinkstickDevice) {
        blinkstickDevice.turnOff();
    }

}


function cleanUp() {

    // Clear Deck
    myStreamDeck.clearAllKeys();

    // Reset intervals and tap events
    lastKeyIndex = '';
    tapCount = 0;
    longTapTimer;
    isLongTap = false;
    clearTimeout(longTapTimer);

}



global.loadDeck = function(key) {

    cleanUp();

    var currentDeck = 0;

    if (key == 'home') {

        loadDecks();

    }
    else {

        currentDeck = decks.findIndex((deck) => {
            return (deck.id == key);
        });

    }


    // if (key == 'home') {

    //     loadDecks();

    //     // decks = [];
    //     // loadPlugins();
    //     // plugins.forEach(function(pluginPath) {
    //     //     const plugin = require(pluginPath);
    //     //     homeDeck.tiles.push(plugin.getHomeTile());
    //     //     decks.push(plugin.getDeck());
    //     // });

    //     // decks.unshift(homeDeck);

    // }

    var deck = decks[currentDeck];

    console.log('currentDeck', currentDeck);
    console.log('deck', deck);

    deck.tiles.forEach(function(item, key) {

        loadImageInKey(key, item.icon);

    });

    // Show exit button if not home deck
    if (currentDeck > 0) {
        loadImageInKey(14, './images/exit.png');
    }
}


function firstLoad() {

    reset();
    cleanUp();
    loadDeck('home');

}
firstLoad();


myStreamDeck.on('down', (keyIndex) => {
    console.log('key %d down', keyIndex)

    isLongTap = false;
    longTapTimer = setTimeout(function() {
        isLongTap = true;
    }, 500);

})

myStreamDeck.on('up', (keyIndex) => {
    console.log('key %d up', keyIndex)

    clearTimeout(longTapTimer);

    if (isLongTap) {

        longTapEvent(keyIndex);

        isLongTap = false;

    }
    else {

        tapCount++;

        if (keyIndex == 14) {
            // Go to home
            loadDeck('home');
        }
        else {
            if (keyIndex == lastKeyIndex) {
                if (tapCount == 1) {
                    setTimeout(function() {
                        if (tapCount == 1) {
                            // Single Tap Detected
                            singleTapEvent(keyIndex);
                        }
                        else {
                            // Double Tap Detected
                            doubleTapEvent(keyIndex);
                        }
                        tapCount = 0;
                    }, 250);
                }
                else {
                    tapCount = 0;
                }
            }
            else {
                // Different key detected. Single Tap Detected
                singleTapEvent(keyIndex);
                tapCount = 0;
            }
        }



    }

    lastKeyIndex = keyIndex;


    // myStreamDeck.fillColor(keyIndex, 255, 0, 0);


    // toggleBlinkStickOn(keyIndex);
    // togglBlinkStickAvailableOn(keyIndex);

    // if (keyIndex == 0) {
    //     // Blinkstick On


    //     if (keyStatus[keyIndex] == 'off') {

    //         keyStatus[keyIndex] = 'on';

    //         myStreamDeck.fillColor(keyIndex, 0, 255, 0);

    //     }
    //     else if (keyStatus[keyIndex] == 'busy') {

    //         keyStatus[keyIndex] = 'available';

    //         myStreamDeck.fillColor(keyIndex, 0, 255, 0);

    //     }

    // }


    // if (blinkstickDevice) {
    //     var finished = false;

    //     blinkstickDevice.blink('red', {'delay':100, 'repeats': 5}, function() {
    //         blinkstickDevice.blink('green', {'delay':50, 'repeats': 10}, function() {
    //             blinkstickDevice.blink('blue', {'delay':25, 'repeats': 20}, function() {
    //                 finished = true;
    //             });
    //         });
    //     });

    //     var wait = function () { if (!finished) setTimeout(wait, 100)}
    //     wait();
    // }






});

function singleTapEvent(keyIndex) {
    console.log('= single tap: ' + keyIndex);

    var deck = decks[currentDeck];
    var deckTile = deck.tiles[keyIndex];
    deckTile.actions.singleTap(keyIndex);
}

function doubleTapEvent(keyIndex) {
    console.log('= double tap: ' + keyIndex);

    var deck = decks[currentDeck];
    var deckTile = deck.tiles[keyIndex];
    deckTile.actions.doubleTap(keyIndex);
}

function longTapEvent(keyIndex) {
    console.log('= long tap: ' + keyIndex);

    var deck = decks[currentDeck];
    var deckTile = deck.tiles[keyIndex];
    deckTile.actions.longTap(keyIndex);
}





// Fired whenever an error is detected by the `node-hid` library.
// Always add a listener for this event! If you don't, errors will be silently dropped.
myStreamDeck.on('error', (error) => {
	console.error(error)
})

// Fill the first button form the left in the first row with a solid red color. This is synchronous.
// myStreamDeck.fillColor(4, 255, 0, 0)
// console.log('Successfully wrote a red square to key 4.')





process.stdin.resume();//so the program will not close instantly

function exitHandler(options, exitCode) {
    if (options.cleanup) {
        console.log('cleaning');
        cleanUp();
    }
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

