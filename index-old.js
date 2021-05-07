/** 
 * 
 * https://www.npmjs.com/package/elgato-stream-deck
 * https://github.com/arvydas/blinkstick-node
 *
 */


const path = require('path')
const { openStreamDeck } = require('elgato-stream-deck')


var blinkstick = require('./lib/blinkstick'),
    device = blinkstick.findFirst();


const sharp = require('sharp');

// Automatically discovers connected Stream Decks, and attaches to the first one.
// Throws if there are no connected stream decks.
// You also have the option of providing the devicePath yourself as the first argument to the constructor.
// For example: const myStreamDeck = new StreamDeck('\\\\?\\hid#vid_05f3&pid_0405&mi_00#7&56cf813&0&0000#{4d1e55b2-f16f-11cf-88cb-001111000030}')
// On linux the equivalent would be: const myStreamDeck = new StreamDeck('0001:0021:00')
// Available devices can be found with listStreamDecks()
const myStreamDeck = openStreamDeck()


var keyStatus = [];

function loadAllKeys() {

    cleanUp();

    var keyIndex = 0;
    myStreamDeck.fillColor(keyIndex, 0, 0, 0);

    keyStatus[0] = 'off';
    keyStatus[1] = 'off';


    loadImageInKey(0, './plugins/blinkstick/images/blinkstick-off.png');


}
loadAllKeys();


function cleanUp() {

    myStreamDeck.clearAllKeys();

    if (device) {
        device.turnOff();
    }
}


myStreamDeck.on('down', (keyIndex) => {
	console.log('key %d down', keyIndex);


});

function toggleBlinkStickOn(keyIndexPressed) {

    var keyIndex = 0;

    if (keyIndexPressed !== keyIndex) return;

    if (keyStatus[keyIndex] == 'off') {
        keyStatus[keyIndex] = 'on';
        // myStreamDeck.fillColor(keyIndex, 255, 255, 255);


        loadImageInKey(0, './plugins/blinkstick/images/blinkstick-on.png');

        togglBlinkStickAvailableOn(1);
    }
    else {
        keyStatus[keyIndex] = 'off';
        // myStreamDeck.fillColor(keyIndex, 0, 0, 0);

        loadImageInKey(0, './plugins/blinkstick/images/blinkstick-off.png');

        keyStatus[1] = 'off';
        myStreamDeck.fillColor(1, 0, 0, 0);

        keyStatus[2] = 'off';
        myStreamDeck.fillColor(2, 0, 0, 0);

        offBlinkstickBusy();

        if (device) {
            device.turnOff();
        }
    }

}

function togglBlinkStickAvailableOn(keyIndexPressed) {

    var keyIndex = 1;

    if (keyIndexPressed !== keyIndex) return;
    if (keyStatus[0] == 'off') return;


    if (keyStatus[keyIndex] == 'available') {
        keyStatus[keyIndex] = 'busy';
        myStreamDeck.fillColor(keyIndex, 0, 255, 0);

        if (device) {
            device.setColor('green');
        }

    }
    else {
        keyStatus[keyIndex] = 'available';
        myStreamDeck.fillColor(keyIndex, 255, 0, 0);

        if (device) {
            device.setColor('red');
        }
    }


}

var blinkBlinkstick;
var blinkStateBlinkstick = true; // on
function toggleBlinkstickBusy(keyIndexPressed) {

    offBlinkstickBusy();

    var keyIndex = 2;

    if (keyIndexPressed !== keyIndex) return;
    if (keyStatus[0] == 'off') return;

    blinkBlinkstick = setInterval(function(){
        if (blinkStateBlinkstick) {
            blinkStateBlinkstick = false; // off
            myStreamDeck.fillColor(keyIndex, 0, 0, 0);
            device.turnOff();
        }
        else {
            blinkStateBlinkstick = true; // on
            myStreamDeck.fillColor(keyIndex, 255, 0, 0);
            device.setColor('red');
        }
    }, 500); // 1 sec  
}
function offBlinkstickBusy(keyIndex) {
    clearInterval(blinkBlinkstick);
}

myStreamDeck.on('up', (keyIndex) => {
	console.log('key %d up', keyIndex)


    // myStreamDeck.fillColor(keyIndex, 255, 0, 0);


    toggleBlinkStickOn(keyIndex);
    togglBlinkStickAvailableOn(keyIndex);
    toggleBlinkstickBusy(keyIndex);

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


    // if (device) {
    //     var finished = false;

    //     device.blink('red', {'delay':100, 'repeats': 5}, function() {
    //         device.blink('green', {'delay':50, 'repeats': 10}, function() {
    //             device.blink('blue', {'delay':25, 'repeats': 20}, function() {
    //                 finished = true;
    //             });
    //         });
    //     });

    //     var wait = function () { if (!finished) setTimeout(wait, 100)}
    //     wait();
    // }


})

// Fired whenever an error is detected by the `node-hid` library.
// Always add a listener for this event! If you don't, errors will be silently dropped.
myStreamDeck.on('error', (error) => {
	console.error(error)
})

// Fill the first button form the left in the first row with a solid red color. This is synchronous.
// myStreamDeck.fillColor(4, 255, 0, 0)
// console.log('Successfully wrote a red square to key 4.')







function loadImageInKey(key, imagePath) {
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


