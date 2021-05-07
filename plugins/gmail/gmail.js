module.exports = {
    getHomeTile: function () {

        return {
            name: 'Gmail',
            icon: './plugins/gmail/images/gmail-off.png',
            actions: {
                singleTap: function(keyIndex) {
                    console.log('single tap on gmail');

                    loadDeck('gmail');
                },
                doubleTap: function(keyIndex) {
                    console.log('double tap on gmail');
                },
                longTap: function(keyIndex) {
                    console.log('long tap on gmail');
                },
            }
        }

    },

    getDeck: function () {

        var deck = {
            id: 'gmail',
            name: 'Gmail',
            tiles: [],
        };

        var tile = {
            name: 'Blinkstick',
            icon: './plugins/gmail/images/gmail-off.png',
            onload: function() {

                module.exports.turnOn();

            },
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

    }
};

