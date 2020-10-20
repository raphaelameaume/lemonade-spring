const config = {
    stiffness: 0.1,
    damping: 0.8,
    mass: 1,
    precision: 0.01,
};

function noop() { }

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

    function target(dest) {
        if (dest !== current) {
            destination = dest;
            spring.completed = false;
        }
    }

    function update() {
        if (destination !== null) {
            let velocity = (current - previous);
            let acceleration = (destination - current) * spring.stiffness - velocity * spring.damping;
            acceleration /= spring.mass;

            previous = current;
            current += velocity + acceleration;

            if (isAtTarget(current, destination, spring.precision) && !spring.completed) {
                spring.completed = true;
                current = destination;
                onUpdate(getValue());
                onComplete(getValue());
            } else if (!spring.completed) {
                onUpdate(getValue());
            }
        }
    }

    function getValue() {
        return current;
    }

    function setValue(value) {
        previous = value;
        current = value;

        spring.completed = false;
    }

    const spring = {
        completed: false,
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
    let destination = {};
    let completedKeys = [];

    function target(dest) {
        Object.keys(dest).forEach(key => {
            let completedKeyIndex = completedKeys.indexOf(key);
            if (completedKeyIndex >= 0) {
                completedKeys.splice(completedKeyIndex, 1);
            }

            destination[key] = dest[key];
        });

        spring.completed = false;
    }

    function update() {
        if (Object.keys(destination).length > 0) {
            for (let i = 0; i < keys.length; i++) {
                let key = keys[i];

                if (destination[key] !== undefined && !completedKeys.includes(key)) {
                    let velocity = (current[key] - previous[key]);
                    let acceleration = (destination[key] - current[key]) * spring.stiffness - velocity * spring.damping;
                    acceleration /= spring.mass;

                    previous[key] = current[key];
                    current[key] += velocity + acceleration;
                    start[key] = current[key];

                    if (isAtTarget(current[key], destination[key], spring.precision) && !completedKeys.includes(key)) {
                        completedKeys.push(key);
                    }
                }
            }

            let isComplete = Object.keys(destination).every(key => completedKeys.includes(key));

            if (isComplete && !completed) {
                spring.completed = true;

                Object.keys(destination).forEach(key => {
                    current[key] = destination[key];
                })

                onUpdate(getValue());
                onComplete(getValue());
            } else if (!spring.completed) {
                onUpdate(getValue());
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

        spring.completed = false;
    }

    function getValue() {
        return current;
    }

    const spring = {
        completed: false,
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
    let completedIndexes = [];

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
        completedIndexes = [];
        spring.completed = false;
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


                if (isAtTarget(current[index], destination[index], spring.precision) && !completedIndexes.includes(index)) {
                    completedIndexes.push(index);

                    if (completedIndexes.length === start.length) {
                        spring.completed = true;
                        onUpdate(destination);
                        onComplete();
                    }
                } else if (!completed.length === start.length) {
                    onUpdate(getValue());
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
        completedIndexes = [];
        spring.completed = false;
    }

    const spring = {
        completed: false,
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
