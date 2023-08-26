
import { API } from '@aws-amplify/api'

API.configure({
  // "aws_project_region": process.env.REACT_APP_PROJECT_REGION,
  "aws_appsync_graphqlEndpoint": process.env.REACT_APP_APPSYNC_GRAPHQLENDPOINT,
  // "aws_appsync_region": process.env.REACT_APP_APPSYNC_REGION,
  //"aws_appsync_authenticationType": process.env.REACT_APP_APPSYNC_AUTHENTICATIONTYPE,
  "aws_appsync_apiKey": process.env.REACT_APP_APPSYNC_APIKEY,
  "aws_project_region": "us-east-1",
  "aws_appsync_region": "us-east-1",
  "aws_appsync_authenticationType": "API_KEY"
})

export default function ApiConfigure () {
    // Just a mock function to configure the AppSync API.
}