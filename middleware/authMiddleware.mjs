import jwt from 'jsonwebtoken'

const authHandler = (handler) => {
   return { before:  async (request) => {
        const {event, context}= request;
        try {
            // Extract the JWT from the Authorization header
            const token = (event?.headers?.Authorization ?? "").split(
                " "
            );

            // Check if the token exists
            if (!token) {
                return {
                    statusCode: 401,
                    body: JSON.stringify({ message: 'Unauthorized: Token missing' }),
                };
            }

            // Verify the token
            const decodedToken = jwt.verify(token[1], process.env.JWT_SECRETE);

            // Attach the decoded token to the event for further use in the handler
            event.auth= decodedToken;

            // Call the next handler
            // return await handler(event, context);
        } catch (error) {
            console.error('Authentication error:', error);
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Unauthorized: Invalid token' }),
            };
        }
    }
    }
};

export {authHandler};
