import { pipeline } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1';


// ------------------------------------
// AI Pipeline
// ------------------------------------

class SummarizationPipeline {

    static task = 'summarization';

    static model = 'Xenova/distilbart-cnn-6-6';

    static instance = null;


    static async getInstance(progressCallback = null) {

        if (!this.instance) {

            this.instance = pipeline(
                this.task,
                this.model,
                {
                    progress_callback: progressCallback
                }
            );
        }

        return this.instance;
    }
}


// ------------------------------------
// Receive messages from app.js
// ------------------------------------

self.onmessage = async (event) => {

    const { type, text } = event.data;


    // Load the AI model
    if (type === 'load') {

        try {

            await SummarizationPipeline.getInstance((progress) => {

                self.postMessage({
                    type: 'progress',
                    data: progress
                });

            });


            self.postMessage({
                type: 'ready'
            });

        } catch (error) {

            console.error(error);

            self.postMessage({
                type: 'error',
                message: 'Failed to load the AI model.'
            });
        }

    }


    // Generate summary
    if (type === 'summarize') {

        try {

            const summarizer =
                await SummarizationPipeline.getInstance();


            const result = await summarizer(text, {
                max_new_tokens: 60
            });


            self.postMessage({
                type: 'result',
                summary: result[0].summary_text
            });

        } catch (error) {

            console.error(error);

            self.postMessage({
                type: 'error',
                message: 'Failed to generate the summary.'
            });
        }
    }

};