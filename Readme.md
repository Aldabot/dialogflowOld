# Dialogflow
## Install
```
git clone https://github.com/Aldabot/dialogflow
yarn install
```

## Testing
```
mac: serverless invoke local -f webhook ./intents/hello.json
ubuntu: $ export SLS_DEBUG=true
ubuntu: $ serverless invoke local -f webhook -p ./intents/hello.json
ubuntu: $ serverless invoke local -f webhook -p ./intents/loan.json

```

## Docmentation
I've used [Serverless](https://serverless.com/framework/docs/) to easly log and deploy functions.
You need to have the AWS CLI configured: meaning the `aws` standard profile needs to have admin access
Sum up:
```
serverless deploy -v // creates functions in our aws
serverless logs -f webhook -t // fetched logs from function
serverless remove // deletes all used resources
```
Furthermore I am using [Webpack](https://webpack.js.org/) to compile the code via [Babel](https://babeljs.io/) in combination with the Serverless plugin [serverless-webpack](https://github.com/serverless-heaven/serverless-webpack). Don't worry everything should work out of the box! In principle Webpack just translates the `handler.js` file so that lambda can work with it, adds all the installed node packages, and finally adds a copy of the `.env` file into the `.webpack` folder.
