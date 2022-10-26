# BadApple (or whatever you want to play)

As it says, using this package you can play whatever video you want in React.js. Follow the steps to do it.

# Steps

  - You just have to use the script inside [src/scripts/one-time-script.mjs](./src/scripts/one-time-script.mjs) or make your own to extract all frames from a video, then place them wherever you want;
  - You need to specify the path for the frames, and or you use ``public`` folder inside your app, or it have to be an absolute path (ex. of getting current path using vite.js: new URL('.', import.meta.url).pathname), put the path in framesDir prop;
  - Other props: width (horizontal pixels size), height (vertical pixels size) and fps (define framerate, it's optional but the standard is 30).

# Usage

```jsx
import { BadApple } from '@datsfilipe/react-bad-apple'

// ...
return (
  // ...
  <BadApple width={80} heigth={50} framesDir={/* path to your frames folder */} fps={43} />
  // ...
)
```

# Installation

  ```bash
# npm
  npm i @datsfilipe/react-bad-apple@latest
# pnpm
  pnpm i @datsfilipe/react-bad-apple@latest
# yarn
  yarn add @datsfilipe/react-bad-apple@latest
  ```

# Showcase
[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/3vilS05su_s/0.jpg)](https://www.youtube.com/watch?v=3vilS05su_s)
