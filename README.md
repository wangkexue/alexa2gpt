# a2g

Demo of connecting Alexa with ChatGPT via API.

## Setup
```
// configure your Amazon Developer account
ask configure

cd <your_skill_name>/lambda
// set your openai API key at an env var of the Lambda configuration
npm install
ask deploy
```

Once deployment completes, you should be able to test in Alexa developer console.