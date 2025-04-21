import { HfInference } from '@huggingface/inference'

const hf = new HfInference(process.env.HF_API_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { prompt } = req.body
    
    const response = await hf.textToImage({
      model: 'Jovie/Midjourney',
      inputs: prompt,
      parameters: {
        height: 512,
        width: 512
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
