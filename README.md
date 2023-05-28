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

Update OS packages in ec2 instance:
`sudo yum update`

Install editor in ec2 instance:
`sudo yun install programName -y`

Switch different node version in ec2 instance:
`nvm use --lts`
`nvm use 16`

Copy file between local computer and remote computer:
`scp file.txt remote-computer.com:file.txt`

Connect to web server using SSH
`ssh -i ~/.ssh/ccp555-key-pair.pem ec2-user@public IPv4 DNS`

AWS CLI Terminal
- Start the instance
`aws ec2 start-instances --instance-ids {instance-id}`

- Stop the instance
`aws ec2 stop-instances --instance-ids {instance-id}`