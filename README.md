# r3cipe

Available at https://food.tylers.works

## Description
r3cipe is a web app that allows people to easily find high quality recipes and share them with friends. 

Users can search for recipes by various filters (cuisine, meal type), save recipes to their favorites, and create their own recipes. Users can also create a pantry of ingredients that they have available, and the app will suggest recipes they can make with those ingredients.

A distinguishing aspect of the app is the social circles feature. Users can create a circle of friends, and share recipes with them. Friends in the circle can see these recipes and comments. This allows users to maintain a valuable set of high quality recipes as well as discuss it with fellow foodies!

A unique feature of r3cipe is that it uses Open AI's GPT-3 model to fill in missing instructions on recipes from the Spoonacular API. This allows users to get a better idea of what a recipe will be like before they make it.

## Architecture
**Frontend**: React, TypeScript, MaterialUI

**Backend**: Node.js, Express.js, MongoDB

**APIs**: Spoonacular, OpenAI

**Authentication**: Custom Sessions

**Deployment**: Linode, CloudFlare

**Tests**: Jest

### Spoonacular
We use the Spoonacular API to fetch recipes. Make an account on Spoonacular to get an API key at https://spoonacular.com/food-api/console#Dashboard

### OpenAI
Our app uses OpenAI's Davinci GPT-3 text completition model to fill in instructions on Spoonacular recipes that are partially incomplete. Please get an API key here at https://platform.openai.com/account/api-keys

## Setup
1. Clone the repository
2. Create a `.env` file in the root directory and add your Spoonacular API key(s), and your Open AI key, (modeled after the `/example.env` file)
3. Create another `.env` in your /frontend directory modeled after the `/frontend/example.env` file
3. Run `npm install`
4. `cd frontend` and run `npm install`
5. Development: run `npm run watch` in the root directory. In a separate terminal, `cd frontend` and run `npm run start`.
6. Deployment: run `npm run build:deploy` in the root directory, then `npm run start`

