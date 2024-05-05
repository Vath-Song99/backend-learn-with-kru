// Define an interface representing the structure of the decoded user information
export interface DecodedUser {
    id: string;
    username: string;
    // Add other properties as needed
  }
  
  // Extend the Request interface in the Express module to include the user property
declare global {
    namespace Express {
      interface Request {
        user?: DecodedUser; // Optional property representing the decoded user information
      }
    }
  }