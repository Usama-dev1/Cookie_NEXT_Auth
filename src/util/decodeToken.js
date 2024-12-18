import { jwtVerify } from "jose"; // Import jwtVerify from jose

export const decodeToken = async (request) => {
  try {
    const token = request.cookies.get("token")?.value || "";
    if (!token) {
      return null; // If no token, return null
    }

    const secret = new TextEncoder().encode(process.env.JWT_KEY); // Encode the secret key
    const { payload } = await jwtVerify(token, secret); // Verify the JWT using JOSE

    // Log the payload to ensure 'isAdmin' is part of it
    console.log("Decoded JWT Payload: ", payload);

    // Return the decoded token data needed for authorization
    return {
      id: payload.id,
      username: payload.username,
      email: payload.email,
      isAdmin: payload.isAdmin !== undefined ? payload.isAdmin : false, // Ensure isAdmin has a default value
    };
  } catch (error) {
    // Handle specific JWT errors
    if (error instanceof jwtVerify.JOSEError) {
      console.error(
        "Invalid token or token verification failed",
        error.message
      );
    }
    return null; // Return null if token is invalid or expired
  }
};
