# lemonade-spring
`lemonade-spring` is a minimal function to create spring-physics based animations. The implementation is based on [this tweet by Taylor Baldwin](https://twitter.com/taylorbaldwin/status/1162407390492405762).
It is written in ES6 and can be used directly in browsers supporting `<script type="module">`

## Installation

```
npm install lemonade-spring
```

## Usage

```js
import createSpring from "lemonade-spring";
```

#### `spring = createSpring(startValue, [options]);`

- `startValue` — Can either be a number, an array (mutated) or an simple object with no nesting (mutated)
- `options.mass` — A number defining the mass of the spring. Default to `1`
- `options.stiffness` — A number defining the stiffness of the spring. Default to `0.1`
- `options.damping` — A number defining the damping of the spring. Default to `0.8`
- `options.precision` - A number defining the interval size in which the animation will considered completed. Default to `0.01`.
- `options.onComplete` — A function that will be called once the destValue is in range `[destValue-precision, destValue+precision]`

#### `spring.target(destValue)`
Set the destination value. Must be the same type|keys|length as startValue
#### `spring.update()`
Must be call in a requestAnimationFrame callback
#### `spring.setValue()`
Set the start value
#### `spring.getValue()`
Return the animated value

## Examples

### With a single number
```js
let spring = createSpring(0); // start value

document.addEventListener("click", () => {
    spring.target(Math.random() * 100);
});

function loop() {
    requestAnimationFrame(loop);

    spring.update(); // call the .update() method in a requestAnimationFrame callback

    console.log(spring.getValue());
}
```

### With an object (mutated)
```js
let coords = { x: 0, y: 0 };
let spring = createSpring(coords, {
    mass: 1,
    stiffness: 0.2,
    damping: 0.5,
});

document.addEventListener("mousemove", function(event) {
    spring.target({ x: event.clientX, y: event.clientY });
});

function loop() {
    requestAnimationFrame(loop);

    spring.update(); // call the .update() method in a requestAnimationFrame callback

    console.log(coords.x, coords.y);
}
```

### With an array (mutated)
```js
let coords = [0, 0];
let spring = createSpring(coords, {
    mass: 1,
    stiffness: 0.2,
    damping: 0.5,
});

document.addEventListener("mousemove", function(event) {
    spring.target([ event.clientX, event.clientY ]);
});

function loop() {
    requestAnimationFrame(loop);

    spring.update(); // call the .update() method in a requestAnimationFrame callback

    console.log(coords[0], coords[1]);
}
```

