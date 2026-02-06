import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    console.log("Received event:", JSON.stringify(event));

    try {
        const body = JSON.parse(event.body);

        const params = {
            TableName: "Products", 
            Item: {
                Category: body.category, // Partition Key
                ID: body.id,             // Sort Key
                Name: body.name,         
                Price: body.price,
                Stock: body.stock        
            }
        };

        await docClient.send(new PutCommand(params));

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: "Product saved successfully!" })
        };
    } catch (error) {
        console.error("Detailed Error:", error);
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ 
                error: "Internal Server Error", 
                details: error.message 
            })
        };
    }
};