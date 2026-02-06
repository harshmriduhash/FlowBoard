import fs from 'fs';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'mock-key',
});

export const transcribeAudio = async (filePath) => {
  if (!process.env.OPENAI_API_KEY) {
    return "This is a mock transcription. Voice AI requires an API Key.";
  }

  try {
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "whisper-1",
    });

    return transcription.text;
  } catch (err) {
    console.error("Whisper Error:", err);
    throw new Error("Voice transcription failed");
  }
  }
};

export const generateAudio = async (text) => {
  if (!process.env.OPENAI_API_KEY) {
      return null;
  }

  try {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: text,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    return buffer;
  } catch (err) {
    console.error("TTS Error:", err);
    return null;
  }
};
