import axios from 'axios';

// Path to the static JSON file
const RECOMMENDATIONS_URL = '/data/recommendations.json';

export const getRecommendations = async () => {
  try {
    // Since this is a public static file, no auth token is needed.
    // Axios will fetch it relative to the public URL.
    const response = await axios.get(RECOMMENDATIONS_URL);
    return response.data.recommendations || []; // Return the array of recommendations
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    // Handle error appropriately, e.g., return an empty array or throw
    // For MVP, returning empty array might be simplest for the component.
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Data:", error.response.data);
      console.error("Status:", error.response.status);
      console.error("Headers:", error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Request:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error message:", error.message);
    }
    // Fallback to an empty list or a default recommendation
    return [{ "error_message": "Could not load recommendations at this time." }];
  }
};

export default {
  getRecommendations,
};
