import { APIGatewayProxyHandler } from 'aws-lambda';
import * as AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();
const TABLE_NAME = process.env.TABLE_NAME || '';
const BUCKET_NAME = process.env.BUCKET_NAME || '';

export const deletePhoto: APIGatewayProxyHandler = async (event) => {
  const { id } = JSON.parse(event.body || '{}');
  
  // Delete from DynamoDB
  const deleteParams = {
    TableName: TABLE_NAME,
    Key: { id },
  };
  
  // Delete from S3
  const deleteS3Params = {
    Bucket: BUCKET_NAME,
    Key: id,  // Assuming the S3 key matches the DynamoDB id
  };

  try {
    await Promise.all([
      dynamoDb.delete(deleteParams).promise(),
      s3.deleteObject(deleteS3Params).promise()
    ]);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Photo deleted successfully" }),
    };
  } catch (error) {
    console.error('Delete operation failed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to delete photo", error }),
    };
  }
};
