const defaults = {
    stiffness: 0.1,
    dampening: 0.8
};

function SpringValue(value, { stiffness = defaults.stiffness, dampening = defaults.dampening } = defaults) {
    let current = value;
    let previous = value;
    let destination = null;

    function target(dest) {
        destination = dest;
    }

    function update() {
        if (destination !== null) {
            let velocity = current - previous;
            let acceleration = (destination - current) * stiffness - velocity * dampening;
            previous = current;
            current += velocity + acceleration;
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

function SpringObject(start, { stiffness = defaults.stiffness, dampening = defaults.dampening } = defaults) {
    let keys = Object.keys(start);
    let current = keys.reduce((obj, key) => {
        obj[key] = start[key];

        return obj;
    }, {});

    let previous = keys.reduce((obj, key) => {
        obj[key] = start[key];

        return obj;
    }, {});

    let destination = null;

    function target(dest) {
        destination = dest;
    }

    function update() {
        if (destination !== null) {
            keys.forEach(key => {
                let velocity = current[key] - previous[key];
                let acceleration =
                    (destination[key] - current[key]) * stiffness - velocity * dampening;

                previous[key] = current[key];
                current[key] += velocity + acceleration;
                start[key] = current[key];
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

function SpringArray(start, { stiffness = defaults.stiffness, dampening = defaults.dampening } = defaults) {
    let current = start.map(element => element);
    let previous = start.map(element => element);
    let destination = null;

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

function useSpring(start, options) {
    if (Array.isArray(start)) {
        return SpringArray(start, options);
    }

    if (typeof start === "object") {
        return SpringObject(start, options);
    }

    return SpringValue(start, options);
}

export default useSpring;
