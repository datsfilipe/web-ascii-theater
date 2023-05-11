# Ascii Theater

As it says, using this package you can play whatever video you want in React.js as an Ascii animation. Follow the steps to do it.

# Steps
  
  - You can see the examples, in main repo inside "[src/scripts](./src/scripts)", of the scripts used to download the video and extract the frames;
  - If you cannot see it in the main repo, you can try to find package folder inside your node_modules, the scripts will be there;
  - You need to specify the path for the frames (recommend you to use ``public`` folder inside your app :));
  - Some of the props are mandatory, like: framesDir, framesCount, width and height.

# Usage

```jsx
import { AsciiTheater } from '@datsfilipe/web-ascii-theater'

// ...
return (
  // ...
  <AsciiTheater
    width={90}
    height={50}
    framesDir={/* path to your frames folder */}
    framesCount={/* total frames/images in the folder */}
    customStyles={/* add custom styles in object style */}
    loop={true}
  />
  // ...
)
```

# Installation

  ```bash
# npm
  npm i @datsfilipe/web-ascii-theater@latest
# pnpm
  pnpm i @datsfilipe/web-ascii-theater@latest
# yarn
  yarn add @datsfilipe/web-ascii-theater@latest
  ```

# Showcase

You can see how it would be in here: [deploy](https://react-bad-apple.vercel.app).

***Obs: you might experience some laggy, and some frames will be jumped in order to show the full animation quicker, since the other way could make you, or me, wait an eternity for the animation to end.***
