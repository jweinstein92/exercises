function toBinaryChar(character, codes) {
    var binaryCharacter = '';
    var codeValues = codes[character].split('');
    for (var [index, val] of codeValues.entries()) {
        // if the code value part is a dot, add 1 dot, otherwise it is a dash, so add 3.
        binaryCharacter += (val === '.') ? '1' : '111';
        if (index !== codeValues.length-1) {
            // time between dots and dashes is equal to one dot, so add it in
            binaryCharacter += '0';
        }
    }
    return binaryCharacter;
}

function toBinaryWord(word, codes) {
    var binaryWord = '';
    var characters = word.split('');
    for (var [index, character] of characters.entries()) {
        binaryWord += toBinaryChar(character, codes);
        if (index !== characters.length-1) {
            // time between each letter is the time of three dots, so need to add 3 dots
            binaryWord += '000';
        }
    }
    return binaryWord;
}

function messageToBinary(message, codes) {
    var binaryMessage ='';
    var words = message.split(' ');
    for (var [index, word] of words.entries()) {
        binaryMessage += toBinaryWord(word, codes);
        if (index !== words.length-1) {
            // spaces are represented by 7 dots, so after each word should have 7 dots
            binaryMessage += '0000000';
        }
    }
    return binaryMessage;
}

function transmitter(options, callbackFnc) {
    var currentLightState = 0;
    var currentIndex = 0;
    var binaryMessage = messageToBinary(options.message, options.codes);
    function toggleLight() {
        if (currentIndex > binaryMessage.length) {
            return callbackFnc();
        }
        if (+binaryMessage[currentIndex] !== currentLightState) {
            currentLightState = +binaryMessage[currentIndex];
            options.toggle();
        }
        currentIndex += 1;
        options.timeouter(toggleLight, 1);
    }

    toggleLight();
}

module.exports = transmitter;