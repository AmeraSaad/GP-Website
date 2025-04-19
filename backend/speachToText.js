const { AssemblyAI } = require("assemblyai");

const client = new AssemblyAI({
  apiKey: "38a5ad6e456649c5a06173481cc36db1",
});

const audioUrl = 'P:/ASU/GP/Datasets/ES2003b.Mix-Headset.wav';
console.log('Using audio file at:', audioUrl);

const config = {
  audio_url: audioUrl,
  speaker_labels: true
};

const run = async () => {
  let transcript = await client.transcripts.create(config);

  for (const utterance of transcript.utterances) {
    console.log(`Speaker ${utterance.speaker}: ${utterance.text}`);
  }
}


run();