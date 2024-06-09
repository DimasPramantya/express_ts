export interface IHTTPError extends Error {
    statusCode: number;
    data?: string[];
}