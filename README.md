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

fragment metadata vs fragment data
- fragment or fragment metadata refer to the metadata, which is JSON
- fragment data refers to the fragment's raw, binary data, which is a Buffer

In our design, a `fragment` will be split across [AWS S3](https://aws.amazon.com/s3/) (data) and [Amazon DynamoDB](https://aws.amazon.com/dynamodb/) (metadata).
- S3:
  - Our `fragments` data is between 0 and 5Mb in size, and can be any type from text to JSON to binary images.
- DynamoDB: 
  - Each `fragment` will be an **item** in our table. 
  - Since an **owner** might have many fragments (i.e., **ids**), we'll use the `ownerId` as our **partition key**, and the fragment `id` as our **sort key**. 
  - The other `fragment` values `created`, `updated`, `type`, `size` will be **attributes** on each `fragment` **item**.
