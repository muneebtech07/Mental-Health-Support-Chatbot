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
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

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
- Always formatted with bullet points
- Include relevant emojis to make the message more engaging and supportive
- Start with a supportive emoji that matches the user's emotional state
- Empathetic and understanding
- Focused on mental health support and well-being
- Non-judgmental and encouraging
- Clear about not being a replacement for professional help
- Careful to avoid medical advice or diagnosis
Always recommend professional help for serious concerns.

Format your responses like this example:
🤗 I understand how you're feeling. Let me help:

• 💭 Your feelings are valid and it's okay to feel this way
• 🌱 Here are some things that might help:
  • Take deep breaths
  • Go for a walk
• 💪 Remember that you're stronger than you think
• 🤝 Consider talking to someone you trust about this

Always use bullet points and relevant emojis to make the response more engaging and supportive. Also Never response to the chat which is non-mental health related like general knowledge , coding , math, science, or any subject related but if its a normal converstion like how are you etc then response  . if the user asks non mental health related questions, please respond with the following message:
"I apologize, but I'm specifically designed to provide mental health support and cannot assist with other topics. Please feel free to ask me about your feelings, emotions, or mental well-being."`;

// Non-mental health related keywords and patterns
const NON_MENTAL_HEALTH_PATTERNS = [
  /\d[\s+\-*/%=]\d/,  // Mathematical operations
  /write.*code/i,     // Code requests
  /create.*program/i, // Programming requests
  /what is.*\d+.*\+.*\d+/i, // Math questions
  /how to code/i,     // Coding questions
  /programming/i,     // Programming related
  /development/i,     // Development related
  /algorithm/i,       // Technical terms
  /database/i,        // Technical terms
  /script/i,          // Technical terms
];

// Check if message is about the chatbot's creator
const isCreatorQuery = (message) => {
  const creatorPatterns = [
    /who.*made.*you/i,
    /who.*created.*you/i,
    /who.*developed.*you/i,
    /who.*your.*creator/i,
    /who.*your.*developer/i,
    /who.*your.*owner/i,
    /who.*designed.*you/i,
  ];
  return creatorPatterns.some(pattern => pattern.test(message));
};

// Check if message is non-mental health related
const isNonMentalHealthQuery = (message) => {
  return NON_MENTAL_HEALTH_PATTERNS.some(pattern => pattern.test(message));
};

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

    // Check for creator/developer queries
    if (isCreatorQuery(message)) {
      return res.json({
        message: "I was created at MuNeeB Tech, a skilled developer focused on building supportive mental health solutions.",
        timestamp: new Date().toISOString()
      });
    }

    // Check for non-mental health queries
    if (isNonMentalHealthQuery(message)) {
      return res.json({
        message: "I apologize, but I'm specifically designed to provide mental health support and cannot assist with other topics like coding, mathematics, or technical questions. Please feel free to ask me about your feelings, emotions, or mental well-being.",
        timestamp: new Date().toISOString()
      });
    }

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