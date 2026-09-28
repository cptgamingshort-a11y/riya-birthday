# Happy Birthday, Riya

A simple birthday surprise for a best friend. Open `index.html` in a browser.

Five screens: birthday greeting, interactive candles, a short BFF note, three photos, and a final wish. Next and Back control the experience; the layout does not require scrolling. Replay resets the candles and photos.

- Edit the greeting and message directly in `index.html`.
- Change photo paths and captions in the `photos` array at the top of `script.js`.
- The three existing PNG photos are used. No missing fourth photo is referenced.
- Tap each candle to extinguish it with smoke. All five reveal the wish.
- Photo arrows cycle through the pictures; tap a picture to enlarge it.
- Reduced motion preferences are respected. The confetti loop runs only during bursts.

On mobile, the birthday screen uses a soft pink grid, bunting, bold birthday lettering, balloons, and a postcard-style note inspired by the supplied reference. The desktop layout keeps its existing five-screen flow.

The original birthday instrumental loops in the background, with a short Hindi birthday greeting at the start. The site tries to autoplay both sounds. Browsers that block audible autoplay start them on the first tap instead. The top button pauses or plays the music. Audio files are in `assets/audio`.

Files use two-space formatting, with `.editorconfig` and `.prettierrc.json` included. No framework or build step is required. Fonts load from Google Fonts with system fallbacks.
