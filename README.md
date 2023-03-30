# a2g

Demo of connecting Alexa with ChatGPT via API.

## Setup
```
// configure your Amazon Developer account and AWS account
ask configure

ask init

cd lambda
// set your openai API key at an env var of the Lambda configuration
npm install
cd ..
ask deploy
```

Once deployment completes, you should be able to test in Alexa developer console.

## Skill interaction
Alexa Open Chatgpt skill
gpt <text>