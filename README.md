# r3cipe

## Spoonacular API
This is a recipe app that uses the Spoonacular API to fetch recipes. Make an account on Spoonacular to get an API key. 
at https://spoonacular.com/food-api/console#Dashboard

## Open AI API
Our app uses Open AI's Davinci GPT-3 model to fill in instructions on recipes from the API that are partially incomplete. Please get an API key here at https://platform.openai.com/account/api-keys

## Setup

1. Clone the repository
2. Create a `.env` file in the root directory and add your Spoonacular API key(s), and your Open AI key, (modeled after the `\example.env` file)
3. Create another `.env` in your \frontend directory modeled after the `\frontend\example.env` file
3. Run `npm install`
4. `cd frontend` and run `npm install`
5. For development, run `npm run watch` in the root directory. In a separate terminal, `cd frontend` and run `npm run start`.
6. For deployment, run `npm run build:deploy` in the root directory, then `npm run start`

