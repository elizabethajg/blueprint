import Head from 'next/head';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';
import { useState } from 'react';

const Home = () => {
  const [userInput, setUserInput] = useState('');
  const [personaOutput, setPersonaOutput] = useState('');
  const [mvpOutput, setMvpOutput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false);

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);

    console.log("Calling OpenAPI...")
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ userInput }),
    });

    const data = await response.json();
    const { baseOutput, mvpOutput } = data;

    setPersonaOutput(`${baseOutput.text}`);
    setMvpOutput(`${mvpOutput.text}`);
    setIsGenerating(false);
  }

  const onUserChangedText = (event) => {
    setUserInput(event.target.value);
  }
  return (
    <div className="root">
      <Head>
        <title>GPT-3 Writer | buildspace</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>user persona + product description</h1>
          </div>
          <div className="header-subtitle">
            <h2>enter your product idea below, the more detail the better</h2>
          </div>
        </div>
        <div className="prompt-container">
          <textarea 
            className="prompt-box"
            placeholder="start-typing-here"
            value={userInput}
            onChange={onUserChangedText}/>
        </div>
        <div className="prompt-buttons">
          <a 
            className={isGenerating ? 'generate-button loading' : 'generate-button'}
            onClick={callGenerateEndpoint}
          >
            <div className="generate">
              {isGenerating ? <span className="loader"></span> : <p>Generate</p>}
            </div>
          </a>
        </div>
        {personaOutput && mvpOutput &&(
          <div className="output">
            <div className="output-header-container">
              <div className="output-header">
                <h3>User Persona</h3>
              </div>
            </div>
            <div className="output-content">
              <p>{personaOutput}</p>
            </div>
            <div className="output-header-container">
              <div className="output-header">
                <h3>Pitch</h3>
              </div>
            </div>
            <div className="output-content">
              <p>{mvpOutput}</p>
            </div>
          </div>
        )}
      </div>
      <div className="badge-container grow">
        <a
          href="https://buildspace.so/builds/ai-writer"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <Image src={buildspaceLogo} alt="buildspace logo" />
            <p>build with buildspace</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Home;
