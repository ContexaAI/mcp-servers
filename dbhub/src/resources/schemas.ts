import { ConnectorManager } from "../connectors/manager.js";
import {
  createResourceSuccessResponse,
  createResourceErrorResponse,
} from "../utils/response-formatter.js";

/**
 * Schemas resource handler
 * Returns a list of all schemas in the database
 */
export async function schemasResourceHandler(uri: URL, _extra: any) {
  const connector = ConnectorManager.getCurrentConnector();

  try {
    const schemas = await connector.getSchemas();

    // Prepare response data
    const responseData = {
      schemas: schemas,
      count: schemas.length,
    };

    // Use the utility to create a standardized response
    return createResourceSuccessResponse(uri.href, responseData);
  } catch (error) {
    return createResourceErrorResponse(
      uri.href,
      `Error retrieving database schemas: ${(error as Error).message}`,
      "SCHEMAS_RETRIEVAL_ERROR"
    );
  }
}
