// pages/api/generate.js
import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HF_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { prompt, parameters } = req.body;
    
    const response = await hf.textToImage({
      model: 'stabilityai/stable-diffusion-xl-base-1.0',
      inputs: prompt,
      parameters: {
        num_inference_steps: parameters?.steps || 20,
        guidance_scale: parameters?.guidance || 7,
        height: 768,
        width: 768,
        seed: Math.floor(Math.random() * 1000000)
      }
    });
    
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    
    res.status(200).json({ 
      image: base64,
      parameters: {
        steps: parameters?.steps || 20,
        guidance: parameters?.guidance || 7
      }
    });
  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ error: error.message });
  }
}
