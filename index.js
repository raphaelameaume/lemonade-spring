const defaults = {
    stiffness: 0.1,
    dampening: 0.8,
    mass: 1,
    precision: 0.01,
};

function noop() {}

function isAtTarget(curr, dest, precision = defaults.precision) {
    return curr < dest + precision && curr > dest - precision;
}

function createValueSpring(value, {
    stiffness = defaults.stiffness,
    dampening = defaults.dampening,
    mass = defaults.mass,
    precision = defaults.precision,
} = defaults) {
    let previous = value;
    let current = value;
    let destination = null;
    let completed = false;

    function target(dest) {
        destination = dest;
        completed = false;
    }

    function update() {
        if (destination !== null) {
            let velocity = current - previous;
            let acceleration = (destination - current) * stiffness - velocity * dampening;
            previous = current;
            current += velocity + acceleration;

            if (isAtTarget(current, destination, precision) && !completed) {
                completed = true;
                onComplete();
            }
        }
    }

    function getValue() {
        return current;
    }

    return {
        target,
        update,
        getValue
    };
}

function createObjectSpring(start, {
    stiffness = defaults.stiffness,
    dampening = defaults.dampening,
    mass = defaults.mass,
    precision = defaults.precision,
    onComplete = noop,
} = defaults) {

    let keys = Object.keys(start);
    let previous = keys.reduce((obj, key) => {
        obj[key] = start[key];

        return obj;
    }, {});
    let current = keys.reduce((obj, key) => {
        obj[key] = start[key];

        return obj;
    }, {});
    let destination = null;
    let completed = [];

    function target(dest) {
        destination = dest;
        completed = [];
    }

    function update() {
        if (destination !== null) {
            for (let i = 0; i < keys.length; i++) {
                let key = keys[i];
                let velocity = current[key] - previous[key];
                let acceleration =
                    (destination[key] - current[key]) * stiffness - velocity * dampening;

                previous[key] = current[key];
                current[key] += velocity + acceleration;
                start[key] = current[key];

                if (isAtTarget(current[key], destination[key], precision) && !completed.includes(key)) {
                    completed.push(key);

                    if (completed.length === keys.length) {
                        onComplete();
                    }
                }
            }
        }
    }

    function getValue() {
        return current;
    }

    return {
        update,
        getValue,
        target
    };
}

function createArraySpring(start, {
    stiffness = defaults.stiffness,
    dampening = defaults.dampening,
    mass = defaults.mass,
    precision = defaults.precision,
    onComplete = noop,
} = defaults) {

    let current = start.map(element => element);
    let previous = start.map(element => element);
    let destination = null;
    let completed = [];

    function target(dest) {
        if (!Array.isArray(dest)) {
            console.error("Spring: target must match the type of first argument");
            return;
        }

        if (dest.length !== current.length) {
            console.error("Spring: target length must match the length of the first argument.");
            return;
        }

        destination = dest;
        completed = [];
    }

    function update() {
        if (destination !== null) {
            current.forEach((element, index) => {
                let velocity = current[index] - previous[index];
                let acceleration =
                    (destination[index] - current[index]) * stiffness -
                    velocity * dampening;

                previous[index] = current[index];

                current[index] += velocity + acceleration;

                start[index] = current[index];

                if (isAtTarget(current[index], destination[index], precision) && !completed.includes(index)) {
                    completed.push(index);

                    if (completed.length === start.length) {
                        onComplete();
                    }
                }
            });
        }
    }

    function getValue() {
        return current;
    }

    return {
        update,
        getValue,
        target
    };
}

function createSpring(start, options) {
    if (Array.isArray(start)) {
        return createArraySpring(start, options);
    }

    if (typeof start === "object") {
        return createObjectSpring(start, options);
    }

    return createValueSpring(start, options);
}

export default createSpring;
