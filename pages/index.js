import { useState } from 'react'

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [image, setImage] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateImage = async () => {
    if (!prompt) return
    
    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })
      
      const data = await response.json()
      setImage(`data:image/png;base64,${data.image}`)
    } catch (error) {
      console.error(error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="container">
      <h1>Text-to-Image AI Agent</h1>
      
      <div className="input-group">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image you want to generate"
        />
        <button onClick={generateImage} disabled={isGenerating}>
          {isGenerating ? 'Generating...' : 'Generate Image'}
        </button>
      </div>
      
      {image && (
        <div className="result">
          <img src={image} alt="Generated from AI" />
        </div>
      )}
      
      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }
        .input-group {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        input {
          flex: 1;
          padding: 0.5rem;
        }
        button {
          padding: 0.5rem 1rem;
        }
        .result {
          margin-top: 2rem;
        }
        img {
          max-width: 100%;
          height: auto;
        }
      `}</style>
    </div>
  )
}
