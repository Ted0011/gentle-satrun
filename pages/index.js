import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState('');

  const generateImage = async (isRegenerate = false) => {
    if (!prompt && !isRegenerate) return;
    
    setGenerationStatus('✨ Generating your masterpiece...');
    setIsGenerating(true);
    setImage(null); // Clear previous image
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: isRegenerate ? prompt : prompt 
        })
      });
      
      const data = await response.json();
      setImage(`data:image/png;base64,${data.image}`);
      setGenerationStatus('🎉 Generation complete!');
    } catch (error) {
      console.error(error);
      setGenerationStatus('❌ Error generating image');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      generateImage();
    }
  };

  return (
    <div className="container">
      <h1>AI Image Generator</h1>
      
      <div className="input-group">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Describe the image you want..."
          disabled={isGenerating}
        />
        <button 
          onClick={() => generateImage()} 
          disabled={isGenerating}
        >
          {isGenerating ? 'Creating...' : 'Generate'}
        </button>
      </div>
      
      {generationStatus && !image && (
        <div className="status-message">
          {generationStatus}
          {isGenerating && <div className="spinner"></div>}
        </div>
      )}
      
      {image && (
        <div className="result-container">
          <img src={image} alt="Generated from AI" className="generated-image" />
          
          <div className="action-buttons">
            <button 
              onClick={() => generateImage(true)}
              className="regenerate-btn"
            >
              🔄 Regenerate
            </button>
            <button 
              onClick={() => {
                setImage(null);
                setPrompt('');
                setGenerationStatus('');
              }}
              className="clear-btn"
            >
              🗑️ Clear
            </button>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          font-family: 'Inter', sans-serif;
        }
        
        .input-group {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        input {
          flex: 1;
          padding: 0.75rem;
          border: 2px solid #ddd;
          border-radius: 8px;
          font-size: 1rem;
          transition: border 0.3s;
        }
        
        input:focus {
          border-color: #646cff;
          outline: none;
        }
        
        button {
          padding: 0.75rem 1.5rem;
          background: #646cff;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.3s;
        }
        
        button:hover {
          background: #535bf2;
        }
        
        button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        
        .status-message {
          padding: 2rem;
          text-align: center;
          font-size: 1.2rem;
          color: #646cff;
          background: #f0f4ff;
          border-radius: 8px;
          margin: 2rem 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        
        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-top: 4px solid #646cff;
          width: 30px;
          height: 30px;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .result-container {
          margin-top: 2rem;
          text-align: center;
        }
        
        .generated-image {
          max-width: 100%;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .action-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 1.5rem;
        }
        
        .regenerate-btn {
          background: #4CAF50;
        }
        
        .regenerate-btn:hover {
          background: #3e8e41;
        }
        
        .clear-btn {
          background: #f44336;
        }
        
        .clear-btn:hover {
          background: #d32f2f;
        }
      `}</style>
    </div>
  );
}
