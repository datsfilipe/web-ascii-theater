# Ascii Theater

As it says, using this package you can play whatever video you want in React.js as an Ascii animation. Follow the steps to do it.

# Showcase

You can see how it would be in here: [deploy](https://react-bad-apple.vercel.app).

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
  npm i https://github.com/datsfilipe/web-ascii-theater.git
# pnpm
  pnpm i https://github.com/datsfilipe/web-ascii-theater.git
# yarn
  yarn add https://github.com/datsfilipe/web-ascii-theater.git
  ```
