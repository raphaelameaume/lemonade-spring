const config = {
    stiffness: 0.1,
    damping: 0.8,
    mass: 1,
    precision: 0.01,
};

function noop() {}

function isAtTarget(curr, dest, precision = config.precision) {
    return curr < dest + precision && curr > dest - precision;
}

function createValueSpring(start, {
    stiffness = config.stiffness,
    damping = config.damping,
    mass = config.mass,
    precision = config.precision,
    onUpdate = noop,
    onComplete = noop,
} = config) {
    let previous, current;
    let destination = null;
    let completed = false;

    function target(dest) {
        destination = dest;
        completed = false;
    }

    function update() {
        if (destination !== null) {
            let velocity = (current - previous);
            let acceleration = (destination - current) * spring.stiffness - velocity * spring.damping;
            acceleration /= spring.mass;

            previous = current;
            current += velocity + acceleration;

            onUpdate(getValue());

            if (isAtTarget(current, destination, spring.precision) && !completed) {
                completed = true;
                onComplete();
            }
        }
    }

    function getValue() {
        return current;
    }

    function setValue(value) {
        previous = value;
        current = value;

        completed = false;
    }

    const spring = {
        stiffness,
        damping,
        precision,
        mass,
        update,
        getValue,
        setValue,
        target
    };

    spring.setValue(start);

    return spring;
}

function createObjectSpring(start, {
    stiffness = config.stiffness,
    damping = config.damping,
    mass = config.mass,
    precision = config.precision,
    onUpdate = noop,
    onComplete = noop,
} = config) {
    let keys, previous, current;
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
                let velocity = (current[key] - previous[key]);
                let acceleration = (destination[key] - current[key]) * spring.stiffness - velocity * spring.damping;
                acceleration /= spring.mass;

                previous[key] = current[key];
                current[key] += velocity + acceleration;
                start[key] = current[key];

                onUpdate(getValue());

                if (isAtTarget(current[key], destination[key], spring.precision) && !completed.includes(key)) {
                    completed.push(key);

                    if (completed.length === keys.length) {
                        onComplete();
                    }
                }
            }
        }
    }

    function setValue(value) {
        keys = Object.keys(value);

        previous = keys.reduce((obj, key) => {
            obj[key] = value[key];

            return obj;
        }, {});

        current = keys.reduce((obj, key) => {
            obj[key] = value[key];

            return obj;
        }, {});

        completed = [];
    }

    function getValue() {
        return current;
    }

    const spring = {
        stiffness,
        damping,
        precision,
        mass,
        update,
        getValue,
        setValue,
        target
    };

    spring.setValue(start);

    return spring;
}

function createArraySpring(start, {
    stiffness = config.stiffness,
    damping = config.damping,
    mass = config.mass,
    precision = config.precision,
    onUpdate = noop,
    onComplete = noop,
} = config) {
    let previous = [];
    let current = [];
    let destination = null;
    let completed = [];

    function target(dest) {
        if (!Array.isArray(dest)) {
            console.error("Spring: target must match the type of startValue");
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
                let acceleration = (destination[index] - current[index]) * spring.stiffness - velocity * spring.damping;
                acceleration /= spring.mass;

                previous[index] = current[index];
                current[index] += velocity + acceleration;
                start[index] = current[index];

                onUpdate(getValue());

                if (isAtTarget(current[index], destination[index], spring.precision) && !completed.includes(index)) {
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

    function setValue(value) {
        current = value.map(element => element);
        previous = value.map(element => element);
        completed = [];
    }

    const spring = {
        stiffness,
        damping,
        precision,
        mass,
        update,
        getValue,
        setValue,
        target
    };

    spring.setValue(start);

    return spring;
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
