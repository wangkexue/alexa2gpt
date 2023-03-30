const Alexa = require('ask-sdk-core');
const OpenAI = require('openai');

const configuration = new OpenAI.Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAI.OpenAIApi(configuration);

const LaunchRequestHandler = {
 canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    async handle(handlerInput) {
        const speakOutput = 'Hello, welcome to OpenAI conversation. How can I assist you?';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const ChatGPTIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'ChatGPTIntent' 
            || Alexa.getIntentName(handlerInput.requestEnvelope) === 'FallbackIntent');
    },
    async handle(handlerInput) {
        console.log("[DEBUG] handlerInput: " + handlerInput);
        const userInput = handlerInput.requestEnvelope.request.intent.slots.Query.value;
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const previousConversation = sessionAttributes.conversation || '';
        const prompt = previousConversation + userInput;
        console.log("[DEBUG] prompt: " + prompt);
        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [{role: "user", content: prompt}]
        });
        const speakOutput = response.data.choices[0].message.content;
        sessionAttributes.conversation = prompt + speakOutput;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};

const LogRequestInterceptor = {
	process(handlerInput) {
  		console.log(`REQUEST ENVELOPE = ${JSON.stringify(handlerInput.requestEnvelope)}`
		  );
	}
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        ChatGPTIntentHandler,
        SessionEndedRequestHandler
        )
    .addRequestInterceptors(LogRequestInterceptor)
    .lambda();