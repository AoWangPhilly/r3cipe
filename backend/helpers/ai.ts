import { OpenAIApi, Configuration } from "openai";

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

const promptStart =
    "Give me a numbered list of instructions based on a recipe's name and ingredients.Ignore unrelated ingredients. Give me only the numbered list of instructions. Include only one newline characters for each instruction.\n\n";

export async function generateInstructions(
    name: string,
    ingredients: string[]
) {
    const prompt =
        promptStart +
        "Name: " +
        name +
        "\n\nIngredients: " +
        ingredients.join(", ");

    // console.log(prompt);

    try {
        // ChatCompletion (a bit slow)
        /* const completition = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{"role": "user", "content": prompt}],
            // max_tokens: 250,
            // temperature: 0.2,
        }) */

        // Text Completition
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            max_tokens: 275,
            temperature: 0.7, // reduce for more deterministic results
        });

        let genInstruc = completion.data.choices[0].text;
        // let genInstruc = completition.data.choices[0].message?.content;
        
        // remove all the numbers from the instructions
        genInstruc = genInstruc?.replace(/[0-9]/g, "");
        // console.log(genInstruc);
        return genInstruc;
    } catch (err: any) {
        console.log(err.message);
    }

    /* const gptResponse = await openai.complete({
    engine: 'davinci',
    prompt,
    maxTokens: 500,
    temperature: 0.9,
    topP: 1,
    presencePenalty: 0,
    frequencyPenalty: 0,
    stop: ['\n', ' User:', ' AI:'],
  });

  return gptResponse.data.choices[0].text; */
}

// Path: backend/helpers/ai.ts
// connect to cleverbot API
//
