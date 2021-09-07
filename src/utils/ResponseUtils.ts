import { APIGatewayProxyResult } from 'aws-lambda';

export const Success = (body: string): APIGatewayProxyResult => ({
  statusCode: 200,
  body,
});

export const ServerError = (body: string): APIGatewayProxyResult => ({
  statusCode: 500,
  body,
});

export const BadRequest = (body: string): APIGatewayProxyResult => ({
  statusCode: 400,
  body,
});
