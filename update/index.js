function copy(obj) {
    if (Array.isArray(obj)) {
        return obj.slice();
    }
    if (typeof obj === "object" && obj) {
        return Object.assign({}, obj);
    }
    return obj;
}

var commands = {
    $apply: function(obj, func) {
        return func(obj);
    },
    $merge: function(obj, updatedValue) {
        var keys = Object.keys(updatedValue);
        for (var key of keys) {
            if (obj[key] !== updatedValue[key]) {
                obj[key] = updatedValue[key];
            }
        }
        return obj;
    },
    $push: function(obj, updatedValues) {
        return obj.concat(updatedValues);
    },
    $set: function(obj, updatedValue) {
        return updatedValue;
    },
    $splice: function(obj, arrayArgs) {
        for (var args of arrayArgs) {
            obj.splice.apply(obj, args);
        }
        return obj;
    },
    $unshift: function(obj, updatedValues) {
        return updatedValues.concat(obj);
    }
}

function update(original, spec) {
    var keys = Object.keys(spec);
    var newState = copy(original);

    // iterate over the keys of the commands we want to perform
    for (var key of keys) {
        var val = spec[key];
        // if we have a command to use provided a key, call the command
        if (commands.hasOwnProperty(key)) {
            return commands[key](newState, val);
        } else {
            // if the key is a nested property we need to go deeper into the object, so call update again
            newState[key] = update(newState[key], val);
        }
    };

    return newState;
}   

module.exports = update;

