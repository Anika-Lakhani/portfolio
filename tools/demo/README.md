# Recording demo videos

How the South Asian Heart Risk demo was made. No extra software needed beyond
Node, Playwright's browsers and the Swift that ships with Xcode's command-line tools.

1. **Record.** `record.js` drives the live app in a headless browser, draws a fake
   cursor, and saves every screen change as a timestamped JPEG.

   ```bash
   node tools/demo/record.js /tmp/take        # add --dry for checkpoint screenshots
   ```

2. **Encode.** `encode.swift` turns those frames into an H.264 MP4 that plays in
   every browser (Playwright's own recorder only makes WebM).

   ```bash
   swift tools/demo/encode.swift /tmp/take/frames /tmp/take/frames.json assets/<project>/demo.mp4 1600 900 30 1.0
   ```

   The last argument is playback speed (1.5 = 50% faster).

3. Set `video: "assets/<project>/demo.mp4"` on the project in `data/projects.js`.

For another project, copy `record.js` and rewrite the steps in the middle of it.
It loads Playwright from the npx cache; if that path moves, run `npx playwright --version`
once and update the `require` at the top.
