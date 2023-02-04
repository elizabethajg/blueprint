import{Configuration, OpenAIApi} from 'openai';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix = "Generate a user persona for the following product: ";

const generateAction = async(req, res) => {
    console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

    const baseCompletion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `${basePromptPrefix}${req.body.userInput}\n`,
        temperature: 1,
        max_tokens: 500,
    });

    const basePromptOutput = baseCompletion.data.choices.pop();

    const secondPrompt = 
    `
    Use the product idea and user persona to adapt the original idea to a product so compelling that an investor would be excited to invest millions without doing any due dilligence. Include a unique and memorable two syllable name that does not incorporate the word energy. Write a pitch that includes a detailed product description that includes key features, benefits, and reasons it is superior to similar competing products.
    Product: ${req.body.userInput}
    User Persona: ${basePromptOutput.text}
    Product Description:
    `

    const secondPromptCompletion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `${secondPrompt}`,
        temperature: 1,
        max_tokens: 1000,
    });

    const secondPromptOutput = secondPromptCompletion.data.choices.pop();

    res.status(200).json({baseOutput: basePromptOutput, mvpOutput: secondPromptOutput});
};

export default generateAction;