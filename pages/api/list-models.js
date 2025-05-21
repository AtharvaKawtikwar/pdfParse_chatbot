export default async function handler(req, res) {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
  
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not set');
      }
  
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error ${response.status}`);
      }
  
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error("Error listing models:", error);
      res.status(500).json({ error: error.message });
    }
  }
  