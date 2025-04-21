import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HF_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;
    
    // Optimized for faster generation
    const response = await hf.textToImage({
      model: 'stabilityai/stable-diffusion-xl-base-1.0',
      inputs: prompt,
      parameters: {
        num_inference_steps: 2,
        guidance_scale: 2,
        height: 768,
        width: 768
      }
    });
    
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    
    res.status(200).json({ 
      image: base64,
      model: 'SDXL 1.0',
      steps: 20,
      resolution: '768x768'
    });
  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ 
      message: 'Error generating image',
      error: error.message,
      suggestion: 'Try a simpler prompt or wait a few moments'
    });
  }
}
