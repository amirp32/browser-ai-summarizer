# AI Text Summarizer

A privacy-focused AI text summarizer that runs directly in the user's browser using Transformers.js.

No backend server or external AI API is required for text inference.

## Features

- AI text summarization
- Runs directly in the browser
- Local text processing
- Transformers.js
- Web Worker based inference
- Model loading progress
- Input word counter
- Summary word counter
- Copy summary
- Input validation
- Error handling
- Responsive interface

## How It Works

The application uses Transformers.js to run a pretrained summarization model directly in the browser.

AI inference runs inside a Web Worker so computationally intensive model processing does not block the main UI thread.

Architecture:

User Input  
↓  
Main Thread  
↓  
Web Worker  
↓  
Transformers.js  
↓  
AI Model  
↓  
Generated Summary  
↓  
Main Thread  
↓  
User Interface

## Privacy

Text is processed locally in the user's browser and is not sent to an application backend for summarization.

## Technologies

- HTML
- CSS
- JavaScript
- Transformers.js
- Hugging Face models
- Web Workers

## Model

This project uses:

`Xenova/distilbart-cnn-6-6`

for English text summarization.

## Run Locally

Clone the repository and run it using a local development server such as VS Code Live Server.

Opening the HTML file directly using `file://` is not recommended because the project uses JavaScript modules and Web Workers.

## Future Improvements

- Multilingual summarization
- Summary length controls
- Improved progress reporting
- Better accessibility
- Additional local AI models