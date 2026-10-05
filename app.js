// ------------------------------------
// HTML Elements
// ------------------------------------

const input = document.querySelector('#input');

const button = document.querySelector('#summarizeBtn');

const output = document.querySelector('#output');

const wordCount = document.querySelector('#wordCount');

const copyButton = document.querySelector('#copyBtn');

const clearButton = document.querySelector('#clearBtn');

const modelStatus = document.querySelector('#modelStatus');

const statusDot = document.querySelector('#statusDot');

const progressContainer = document.querySelector('#progressContainer');

const progressBar = document.querySelector('#progressBar');

const summaryWordCount = document.querySelector('#summaryWordCount');


// ------------------------------------
// App State
// ------------------------------------

let modelReady = false;

let lastSummary = '';

const MAX_WORDS = 700;


// ------------------------------------
// Create Web Worker
// ------------------------------------

const worker = new Worker(
    './worker.js',
    {
        type: 'module'
    }
);


// ------------------------------------
// Initial UI State
// ------------------------------------

button.disabled = true;

copyButton.disabled = true;

output.textContent = 'Loading AI model...';


// ------------------------------------
// Start loading AI model
// ------------------------------------

worker.postMessage({
    type: 'load'
});


// ------------------------------------
// Receive messages from worker.js
// ------------------------------------

worker.onmessage = (event) => {

    const { type, data, summary, message } = event.data;


    // Model download progress
    if (type === 'progress') {

        if (
            data.status === 'progress' &&
            typeof data.progress === 'number'
        ) {

            const percent =
                Math.round(data.progress);

            output.textContent =
                `Loading AI model... ${percent}%`;

            progressBar.style.width =
                `${percent}%`;

            modelStatus.textContent =
                `Loading AI model... ${percent}%`;
        }

    }


    // Model ready
    if (type === 'ready') {

        modelReady = true;

        button.disabled = false;

        output.textContent = 'AI model is ready!';

        modelStatus.textContent = 'AI Model Ready';

        statusDot.classList.add('ready');

        progressContainer.style.display = 'none';
    }


    // Summary received
    if (type === 'result') {

        lastSummary = summary;

        const summaryWords = summary.trim().split(/\s+/).length;

        summaryWordCount.textContent =
            `Summary words: ${summaryWords}`;

        output.textContent = summary;

        button.disabled = false;

        button.textContent = 'Summarize';

        copyButton.disabled = false;
    }

    // Error
   if (type === 'error') {

        output.textContent = message;

        button.textContent = 'Summarize';

        if (!modelReady) {

            modelStatus.textContent =
                'AI Model Error';

            statusDot.classList.add('error');

        }

        if (modelReady) {
            button.disabled = false;
        }
    }

};


// ------------------------------------
// Word Counter
// ------------------------------------

input.addEventListener('input', () => {

    const text = input.value.trim();

    if (!text) {

        wordCount.textContent =
            'Words: 0';

        return;
    }

    const words = text.split(/\s+/);

    const count = words.length;

    wordCount.textContent =
        `Words: ${count}`;


    if (count > MAX_WORDS) {

        wordCount.textContent =
            `Words: ${count} — Too long`;

    }

});


// ------------------------------------
// Summarize Button
// ------------------------------------

button.addEventListener('click', () => {

    const text = input.value.trim();


    if (!text) {

        output.textContent =
            'Please enter some text first.';

        return;
    }

    const words =
        text.split(/\s+/);

    if (words.length > MAX_WORDS) {

        output.textContent =
            `Please keep your text under ${MAX_WORDS} words.`;

        return;
    }


    button.disabled = true;

    copyButton.disabled = true;

    button.textContent = 'Summarizing...';

    output.textContent =
        'AI is generating your summary...';


    worker.postMessage({
        type: 'summarize',
        text: text
    });

});


// ------------------------------------
// Copy Summary
// ------------------------------------

copyButton.addEventListener('click', async () => {

    if (!lastSummary) {
        return;
    }


    try {

        await navigator.clipboard.writeText(
            lastSummary
        );


        copyButton.textContent = 'Copied!';


        setTimeout(() => {

            copyButton.textContent =
                'Copy Summary';

        }, 1500);


    } catch (error) {

        console.error(error);

        copyButton.textContent =
            'Copy failed';

    }

});


// ------------------------------------
// Clear Button
// ------------------------------------

clearButton.addEventListener('click', () => {

    input.value = '';

    lastSummary = '';

    wordCount.textContent = 'Words: 0';

    summaryWordCount.textContent = 'Summary words: 0';

    copyButton.disabled = true;


    if (modelReady) {

        output.textContent =
            'Your summary will appear here.';

    } else {

        output.textContent =
            'Loading AI model...';
    }

});