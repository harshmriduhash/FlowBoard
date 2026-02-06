import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { chatWithAI } from '../services/aiService.js';
import { chatWithAI } from '../services/aiService.js';
import { transcribeAudio, generateAudio } from '../services/voiceService.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/voice', requireAuth, upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    // 1. Transcribe
    const text = await transcribeAudio(req.file.path);

    // 2. Chat with AI using transcribed text
    const { workflowId } = req.body;
    const userId = req.user.id;
    
    // Cleanup: Delete uploaded file
    fs.unlinkSync(req.file.path);

    // 3. Get AI Response
    const aiResponse = await chatWithAI({ message: text, workflowId, userId });

    // 4. Generate Audio Response (TTS)
    const audioBuffer = await generateAudio(aiResponse.answer);
    const audioBase64 = audioBuffer ? audioBuffer.toString('base64') : null;

    res.json({
      transcription: text,
      answer: aiResponse.answer,
      audio: audioBase64
    });

  } catch (error) {
    console.error('Voice Route Error:', error);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
