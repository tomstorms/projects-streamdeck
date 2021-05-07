var _state = 'off';

module.exports = {
    getHomeTile: function () {

        console.log('_state', _state);

        return {
            name: 'Blinkstick',
            icon: './plugins/blinkstick/images/blinkstick-' + _state + '.png',
            actions: {
                singleTap: function(keyIndex) {
                    console.log('single tap on blinkstick');

                    loadDeck('blinkstick');

                    setTimeout(function() {
                        module.exports.turnOn(keyIndex);
                    }, 200);


                    console.log('end');

                },
                doubleTap: function(keyIndex) {
                    console.log('double tap on blinkstick');
                },
                longTap: function(keyIndex) {
                    console.log('long tap on blinkstick');
                },
            }
        }

    },

    getDeck: function () {

        var deck = {
            id: 'blinkstick',
            name: 'BlinkStick',
            tiles: []
        };

        var tile = {
            name: 'Blinkstick',
            icon: './plugins/blinkstick/images/blinkstick-' + _state + '.png',
            actions: {
                singleTap: function() {
                    console.log('single tap on blinkstick');

                    console.log('ended');

                },
                doubleTap: function() {
                    console.log('double tap on blinkstick');
                },
                longTap: function() {
                    console.log('long tap on blinkstick');
                },
            }
        }
        deck.tiles.push(tile);

        return deck;

    },

    turnOn: function(keyIndex) {

        _state = 'available';

        loadImageInKey(keyIndex, './plugins/blinkstick/images/blinkstick-' + _state + '.png');

        // myStreamDeck.fillColor(0, 0, 255, 0);

        if (blinkstickDevice) {
            blinkstickDevice.setColor('green');
        }

    },


    toggleBlinkStickOn: function(keyIndexPressed) {

        // var keyIndex = 0;

        // if (keyIndexPressed !== keyIndex) return;

        // if (keyStatus[keyIndex] == 'off') {
        //     keyStatus[keyIndex] = 'on';
        //     // myStreamDeck.fillColor(keyIndex, 255, 255, 255);


        //     loadImageInKey(keyIndex, './plugins/blinkstick/images/blinkstick-on.png');

        //     togglBlinkStickAvailableOn(1);
        // }
        // else {
        //     keyStatus[keyIndex] = 'off';
        //     myStreamDeck.fillColor(keyIndex, 0, 0, 0);

        //     keyStatus[1] = 'off';
        //     myStreamDeck.fillColor(1, 0, 0, 0);


        //     loadImageInKey(keyIndex, './plugins/blinkstick/images/blinkstick-off.png');

        //     if (blinkstickDevice) {
        //         blinkstickDevice.turnOff();
        //     }
        // }

    }


};






// var blinkBlinkstick;
// var blinkStateBlinkstick = true; // on
// function toggleBlinkstickBusy(keyIndex) {
//     blinkBlinkstick = setInterval(function(){
//         if (blinkStateBlinkstick) {
//             blinkStateBlinkstick = false; // off
//             loadImageInKey(keyIndex, './plugins/blinkstick/images/blinkstick-blink.png');
//         }
//         else {
//             blinkStateBlinkstick = on; // on
//             loadImageInKey(keyIndex, './plugins/blinkstick/images/blinkstick-busy.png');
//         }
//     }, 1000); // 1 sec  
// }
// function offBlinkstickBusy(keyIndex) {
//     clearInterval(blinkBlinkstick);
// }

// var blinkBlinkstick;
// var blinkStateBlinkstick = true; // on
// function toggleBlinkstickBusy(keyIndex, fillOnly=false) {
//     blinkBlinkstick = setInterval(function(){
//         if (blinkStateBlinkstick) {
//             blinkStateBlinkstick = false; // off

//             if (fillOnly) {
//                 myStreamDeck.fillColor(keyIndex, 0, 0, 0);
//             }
//             else {
//                 loadImageInKey(keyIndex, './plugins/blinkstick/images/blinkstick-blink.png');                
//             }

//         }
//         else {
//             blinkStateBlinkstick = on; // on

//             if (fillOnly) {
//                 myStreamDeck.fillColor(keyIndex, 0, 255, 0);
//             }
//             else {
//                 loadImageInKey(keyIndex, './plugins/blinkstick/images/blinkstick-busy.png');            
//             }
//         }
//     }, 1000); // 1 sec  
// }
// function offBlinkstickBusy(keyIndex) {
//     clearInterval(blinkBlinkstick);
// }





// function toggleBlinkStickOn(keyIndexPressed) {

//     var keyIndex = 0;

//     if (keyIndexPressed !== keyIndex) return;

//     if (keyStatus[keyIndex] == 'off') {
//         keyStatus[keyIndex] = 'on';
//         // myStreamDeck.fillColor(keyIndex, 255, 255, 255);


//         loadImageInKey(keyIndex, './plugins/blinkstick/images/blinkstick-on.png');

//         togglBlinkStickAvailableOn(1);
//     }
//     else {
//         keyStatus[keyIndex] = 'off';
//         myStreamDeck.fillColor(keyIndex, 0, 0, 0);

//         keyStatus[1] = 'off';
//         myStreamDeck.fillColor(1, 0, 0, 0);


//         loadImageInKey(keyIndex, './plugins/blinkstick/images/blinkstick-off.png');

//         if (blinkstickDevice) {
//             blinkstickDevice.turnOff();
//         }
//     }

// }

// function togglBlinkStickAvailableOn(keyIndexPressed) {

//     var keyIndex = 1;

//     if (keyIndexPressed !== keyIndex) return;
//     if (keyStatus[0] == 'off') return;


//     if (keyStatus[keyIndex] == 'available') {
//         keyStatus[keyIndex] = 'busy';
//         myStreamDeck.fillColor(keyIndex, 0, 255, 0);

//         if (blinkstickDevice) {
//             blinkstickDevice.setColor('green');
//         }

//     }
//     else {
//         keyStatus[keyIndex] = 'available';
//         myStreamDeck.fillColor(keyIndex, 255, 0, 0);

//         if (blinkstickDevice) {
//             blinkstickDevice.setColor('red');
//         }
//     }


// }
