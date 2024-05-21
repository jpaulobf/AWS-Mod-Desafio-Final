const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {

  //result
  let body        = "";
  let statusCode  = 200;
  const table     = "products";
  const headers   = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers": "*"
  };

  //RouteKey test  
  try {
    switch (event.routeKey) {
      case "DELETE /items/{id}":
        await dynamo.delete({TableName: table, Key: {id: event.pathParameters.id}}).promise();
        body = `Deleted item ${event.pathParameters.id}`;
        break;
      case "GET /items/{id}":
        body = await dynamo.get({TableName: table, Key: {id: event.pathParameters.id}}).promise();
        break;
      case "GET /items":
        body = await dynamo.scan({ TableName: table }).promise();
        break;
      case "PUT /items":
        let requestJSON = JSON.parse(event.body);
        await dynamo.put({TableName: table, Item: {id: requestJSON.id, price: requestJSON.price, name: requestJSON.name}}).promise();
        body = `Put item ${requestJSON.id}`;
        break;
      default:
        throw new Error(`Unsupported route: "${event.routeKey}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  //return
  return {
    statusCode,
    body,
    headers
  };
};