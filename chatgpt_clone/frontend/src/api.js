import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export const sendMessageToGemini = async (message) => {
  try {
    const response = await axios.post(`${API_URL}/chat`, { message });
    return response.data;
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    return { user_message: message, gemini_response: "エラーが発生しました。" };
  }
};

export const getChatHistory = async () => {
  try {
    const response = await axios.get(`${API_URL}/history`);
    return response.data;
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return [];
  }
};
