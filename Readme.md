# Dialogflow
```
git clone https://github.com/Aldabot/dialogflow
yarn install
serverless invoke local -f webhook 
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
