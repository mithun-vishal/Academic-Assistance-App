import axios from "axios";

export const askAI = async (question: string) => {
  const response = await axios.post("http://localhost:11434/api/generate", {
    model: "llama3",
    prompt: question,
    stream: false
  });

  return response.data.response;
};
