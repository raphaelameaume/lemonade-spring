# lemonade-spring
`lemonade-spring` is a small utility function to animate numbers with a spring defined by stiffness and dampening. It's a simple spring implementation based on [this tweet by Taylor Baldwin](https://twitter.com/taylorbaldwin/status/1162407390492405762).

## Installation

```
npm install lemonade-spring
```

## Usage

```js
import createSpring from "lemonade-spring";
```

`lemonade-spring` supports numbers, arrays and not-nested objects.

#### `spring = createSpring(startValue, [options]);`

- `startValue` — Can either be a number, an array (mutated) or an object (mutated)
- `[options] mass` — 
- `[options] stiffness` — 
- `[options] dampening` — 

#### `spring.update()`
Must be call in a requestAnimationFrame callback
#### `spring.target(destValue)`
Set the destination value. Must be the same type/keys/length as startValue
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
    stiffness: 0.2,
    dampening: 0.5,
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
    stiffness: 0.2,
    dampening: 0.5,
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

