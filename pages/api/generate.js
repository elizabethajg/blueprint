import{Configuration, OpenAIApi} from 'openai';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix = `Generate an original, useful portfolio project for a software engineer who wants to build the following skills: `;
const hoursPrefix = `The project should be practical and useful, something that could be used in daily life. This project should take approximately`
const generateAction = async(req, res) => {

    const baseCompletion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `${basePromptPrefix}${req.body.userSkills}\n
                ${hoursPrefix}${req.body.userTimeCommitment} to build.\n`,
        temperature: 0.8,
        max_tokens: 500,
    });

    const basePromptOutput = baseCompletion.data.choices.pop();

    const secondPrompt = 
    `
    Use the portfolio project idea to generate a detailed architecture for the project. Format as a bulleted list with frontend, backend, and testing tools with their own sublists. Under each tool, write an explanation of what the tool will be used for.
    Idea: ${basePromptOutput.text}
    Architecture:
    `

    const secondPromptCompletion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `${secondPrompt}`,
        temperature: 1,
        max_tokens: 1000,
    });

    const secondPromptOutput = secondPromptCompletion.data.choices.pop();

    res.status(200).json({ideaOutput: basePromptOutput, stackOutput: secondPromptOutput});
};

export default generateAction;