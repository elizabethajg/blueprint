import Head from 'next/head';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';
import { useState } from 'react';

const Home = () => {
  const [userSkills, setUserSkills] = useState('');
  const [userTimeCommitment, setUserTimeCommitment] = useState('');
  const [ideaOutput, setIdeaOutput] = useState('');
  const [stackOutput, setStackOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);

    console.log("Calling OpenAPI...")
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ userSkills, userTimeCommitment}),
    });

    const data = await response.json();
    const { ideaOutput, stackOutput } = data;

    setIdeaOutput(`${ideaOutput.text}`);
    setStackOutput(`${stackOutput.text}`);
    setIsGenerating(false);
  }

  const onUserChangedSkills = (event) => {
    setUserSkills(event.target.value);
  }

  const onUserChangedTimeCommitment = (event) => {
    setUserTimeCommitment(event.target.value);
  }
  return (
    <div className="root">
      <Head>
        <title>GPT-3 Writer | buildspace</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>blueprint</h1>
          </div>
          <div className="header-subtitle">
            <h2>a tool to map out your next portfolio project</h2>
          </div>
        </div>
        <div className="prompt-container">
          <label>
            What skills do you want to build?
            <textarea
              className="prompt-box"
              placeholder="e.g., swift, next.js, ui/ux design, blockchain engineering..."
              value={userSkills}
              onChange={onUserChangedSkills}/>
          </label>
        </div>
        {/* <div className="prompt-container">
          <label>
            Approximately how many hours do you want to put into this project?
            <textarea
              className="prompt-box"
              placeholder="e.g., 5-10"
              value={userTimeCommitment}
              onChange={onUserChangedTimeCommitment}/>
          </label>
        </div> */}
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
        {ideaOutput && stackOutput &&(
          <div className="output">
            <div className="output-header-container">
              <div className="output-header">
                <h3>Project Idea</h3>
              </div>
            </div>
            <div className="output-content">
              <p>{ideaOutput}</p>
            </div>
            <div className="output-header-container">
              <div className="output-header">
                <h3>Architecture</h3>
              </div>
            </div>
            <div className="output-content">
              <p>{stackOutput}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
