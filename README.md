# Mental Health Support Chatbot
https://mental-health-supportchatbot.onrender.com/
## Overview
The **Mental Health Support Chatbot** is designed to provide users with a supportive and safe environment to discuss their mental health concerns. It offers empathetic responses, resources, and guidance while respecting user privacy. The chatbot integrates with the Gemini API to enable mental health-specific chat functionality.

## Features
- **Natural Language Understanding (NLU):** Provides intelligent responses based on user inputs.
- **Mental Health Focused:** Gemini API responses are restricted to mental health-related support.
- **Custom Chat UI**   
- **Initial Interaction** 
- **Resource Recommendations:** Links to mental health resources via a `/resources` endpoint.
- **Frontend and Backend Integration:** Backend runs on port `3000`, while the frontend runs on port `5176`, with seamless communication enabled through CORS.

## Tech Stack
- **Backend:** Node.js with Express.js
- **Frontend:** React.js or Vite-based framework
- **Chat Functionality:** Gemini API integration
- **Styling:** CSS or TailwindCSS
- **Security:** Environment variable management with `dotenv`
- **Deployment:** GitHub, Heroku, or AWS

## Installation and Usage

### Prerequisites
- Node.js (v16+ recommended)
- Git
- npm

### Steps

#### Clone the Repository
```bash
git clone https://github.com/muneebtech07/Mental-Health-Support-Chatbot.git
```

#### Navigate to the Project Directory
```bash
cd Mental-Health-Support-Chatbot
```

#### Setup

2. Install dependencies:
   ```bash
   npm install
   ```
3. edit a `.env` file for API keys and environment variables:
   ```bash
   touch .env
   ```
   Add the following to `.env`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   ```
4. Start the front end & backend server at same time front end will start at port 5176 and backend at 3000 :
   ```bash
   npm run dev:all
   ```

#### Access the Application
- Open the frontend in your browser at `http://localhost:5176`.
- The frontend will interact with the backend running on `http://localhost:3000`.

## UI Features
- Mood tracker
- Mental health exercise
- Mental health podcast
- Goals
- Mood history Record
- Chat history
- and much more 
## Deployment
1. Push changes to GitHub:
   ```bash
   git push origin main
   ```
2. Deploy the backend to Heroku, AWS, or any Node.js-compatible cloud platform.
3. Deploy the frontend using platforms like Vercel or Netlify.

## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Acknowledgments
- [Gemini API](https://gemini.api/docs)
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [React.js](https://reactjs.org/)
- Mental health professionals for guidance and feedback.

---

With these updates, your Mental Health Support Chatbot is ready to deliver an empathetic and user-friendly experience.

