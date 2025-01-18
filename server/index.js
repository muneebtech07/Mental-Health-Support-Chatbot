import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://mental-health-supportchatbot.onrender.com',
  'https://mental-healthsupportchatbot-bnbo.onrender.com/'
];

// Middleware
app.use(express.json());
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  keyGenerator: () => 'global',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/chat', limiter);
app.use('/resources', limiter);

const MENTAL_HEALTH_CONTEXT = `You are a supportive mental health chatbot. Your responses should be:
- Empathetic and understanding
- Focused on mental health support and well-being
- Non-judgmental and encouraging
- Clear about not being a replacement for professional help
- Careful to avoid medical advice or diagnosis
Always recommend professional help for serious concerns.`;

const validateChatInput = [
  body('message').trim().notEmpty().withMessage('Message cannot be empty')
    .isLength({ max: 500 }).withMessage('Message too long'),
  body('context').isArray().optional(),
];

app.post('/chat', validateChatInput, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { message, context = [] } = req.body;

    const anonymizedMessage = message.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]')
      .replace(/\b\d{10}\b/g, '[PHONE]')
      .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE]');

    // Convert context messages to chat history format
    const chatHistory = context.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Initialize chat with context
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: MENTAL_HEALTH_CONTEXT }],
        },
        {
          role: "model",
          parts: [{ text: "I understand my role as a supportive mental health chatbot. I will provide empathetic, non-judgmental support while being mindful of my limitations and encouraging professional help when needed." }],
        },
        ...chatHistory
      ],
    });

    const result = await chat.sendMessage(anonymizedMessage);
    const response = await result.response;

    res.json({
      message: response.text(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: 'Failed to process your message',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.get('/resources', (req, res) => {
  const resources = {
    emergencyContacts: [
      {
        name: "National Suicide Prevention Lifeline",
        phone: "1-800-273-8255",
        available: "24/7"
      },
      {
        name: "Crisis Text Line",
        phone: "Text HOME to 741741",
        available: "24/7"
      }
    ],
    organizations: [
      {
        name: "National Alliance on Mental Illness (NAMI)",
        website: "https://www.nami.org",
        helpline: "1-800-950-6264"
      },
      {
        name: "Mental Health America",
        website: "https://www.mhanational.org",
        helpline: "1-800-273-8255"
      }
    ],
    selfHelpResources: [
      {
        name: "Mindfulness Exercises",
        type: "Meditation",
        link: "https://www.mindful.org/meditation/mindfulness-getting-started/"
      },
      {
        name: "Anxiety Coping Strategies",
        type: "Self-help",
        link: "https://www.anxietycanada.com/articles/anxiety-strategies-to-help-you-cope/"
      }
    ]
  };

  res.json(resources);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});