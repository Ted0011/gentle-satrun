import { HfInference } from '@huggingface/inference'

const hf = new HfInference(process.env.HF_API_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { prompt } = req.body
    
    const response = await hf.textToImage({
      model: 'stabilityai/stable-diffusion-xl-base-1.0',
      inputs: prompt,
      parameters: {
	num_interface_steps: 30,
	guidance_scale: 7.5,
        height: 1024,
        width: 1024,
	seed: Math.floor(Math.random() * 1000000)
      }
    })
    
    // Convert the image to base64 for easy transfer
    const buffer = await response.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    
    res.status(200).json({ image: base64 })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error generating image' })
  }
}
