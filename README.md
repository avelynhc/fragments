# fragments
Run eslint and make sure there are no errors that need to be fixed:
`npm run lint`

Test that the server can be started manually:
`node src/server.js`

Try running `curl http://localhost:8080` in another terminal 
to see JSON health check response.

Pretty-print the JSON `curl -s localhost:8080 | jq`

Confirm that your server is sending the right HTTP headers.
Look for the Cache-Control and Access-Control-Allow-Origin
`curl -i localhost:8080`
You can also see the result in `Dev Tools and Network tab` in browser.

Try starting your server using all three methods, and use CTRL + c to stop each:

`npm start`
`npm run dev`
`npm run debug`

Try running your test:
`npm test`
`npm run test:watch`

You can run a single test file by passing its name:
`npm test fileName.js`
`npm run test:watch fileName.js`

Run coverage script which collects coverage information: which files and lines of code were run:
`npm run coverage`
