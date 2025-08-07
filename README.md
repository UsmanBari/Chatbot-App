# 🤖 Chatbot-App – AI Chatbot using React + Node.js + Gemini 2.5 Flash

Welcome to **Chatbot-App**, a full-stack AI chatbot web app built using **React** on the frontend and **Node.js + Express** on the backend. It connects to Google's **Gemini 2.5 Flash API**, offering lightning-fast, intelligent conversations directly in your browser – no database or user auth required! ⚡🧠

---

## 🌟 Key Features

- 🧠 **AI Chat** with Gemini 2.5 Flash
- ⚛️ Beautiful **React-based UI** (fully responsive)
- 🔌 Simple, clean **Express server**
- 📦 Lightweight – **no database**
- 🔐 Secure API usage via `.env` file
- 🔁 Continuous conversation history (within the session)

---

## 🧱 Tech Stack

| Layer      | Tech                           | Description                                        |
|------------|--------------------------------|----------------------------------------------------|
| 🖼️ Frontend | **React**, HTML, CSS            | Built with React. Main logic in `App.js`. Styling in `App.css`. Uses `index.html` from `public/`. |
| 🌐 Backend  | **Node.js**, **Express.js**     | Handles requests from frontend and communicates with Gemini API. Logic inside `server.js`. |
| 🤖 AI API   | **Gemini 2.5 Flash API**        | Provides fast and intelligent responses using Google's powerful language model. |
| 🛠️ Config   | **.env**                        | Keeps the Gemini API key hidden and secure. |

---

## 📁 Folder Structure

```
Chatbot-App/
│
├── frontend/
│   ├── public/
│   │   └── index.html         # Root HTML page
│   └── src/
│       ├── App.js             # React component with chatbot logic
│       └── App.css            # Styling for the chatbot UI
│
├── backend/
│   ├── server.js              # Express server logic
│   ├── package.json
│   ├── package-lock.json
│   └── .env (hidden)          # Contains API key for Gemini
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### 🔄 Clone the Repository

```bash
git clone https://github.com/UsmanBari/Chatbot-App.git
cd Chatbot-App
```

---

### 📦 Install Dependencies

#### Frontend

```bash
cd frontend
npm install
```

#### Backend

```bash
cd ../backend
npm install
```

---

### 🔐 Configure Environment Variables

Inside the `backend` folder, create a file named `.env`:

```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```

> ☝️ **Never share your `.env` file** – it's already ignored via `.gitignore`.

---

### 🧪 Run the App Locally

#### Start Backend Server
```bash
cd backend
node server.js
```

#### Start React Frontend
```bash
cd ../frontend
npm start
```

🔗 Open in browser: [http://localhost:3000](http://localhost:3000)

---

## 🧪 Example Interaction

> 🧍 User: *Tell me a fun fact about space.*  
> 🤖 Bot: *Did you know that Venus rotates backwards compared to most planets in the solar system?*

---

## 🌐 Deployment Options

Deploy your full-stack app using these platforms:

| Layer      | Platform              |
|------------|------------------------|
| Frontend   | Vercel, Netlify, GitHub Pages |
| Backend    | Render, Railway, Cyclic, Heroku |

Make sure to add `GEMINI_API_KEY` in the environment settings of your hosting platform.

---

## 🔒 Environment Notes

### .env File Sample

```env
PORT=5000
GEMINI_API_KEY=your_secret_key
```

✅ This file is hidden from GitHub with `.gitignore` to protect sensitive data.

---
---

## 🌍 Deployment

You can host this full-stack app with:

- **Frontend (React)** → [Vercel](https://vercel.com/)
- **Backend (Express)** → [Render](https://render.com/), [Railway](https://railway.app/), or [Cyclic](https://www.cyclic.sh/)

🔐 Make sure to set `GEMINI_API_KEY` in the backend's environment variables when deploying.

---

## 📸 UI Preview
<img width="1919" height="1022" alt="Screenshot 2025-08-08 011825" src="https://github.com/user-attachments/assets/bca32514-3111-4591-a2ec-b4167507a45e" />

<img width="1919" height="1079" alt="Screenshot 2025-08-08 012219" src="https://github.com/user-attachments/assets/bc2b225e-3034-42c6-bddf-52cfb327ea7c" />


---
## 🔮 Future Improvements

- 🗃️ Add conversation history storage (MongoDB or Firebase)
- 👤 Add login/signup with user-based chat logs
- 🎨 UI improvements with Tailwind or Chakra UI
- 🔁 Continuous chat memory across sessions
- 📱 Mobile responsiveness with animations

---

## 🙌 Credits

- 👨‍💻 Made by [Usman Bari](https://github.com/UsmanBari)
- 🔗 Powered by [Gemini 2.5 Flash API](https://ai.google.dev/)
- 💻 Built with React and Express

---

## 📄 License

This project is open-source and for educational/demo purposes. Feel free to fork and experiment!

---

⭐ Don't forget to **star** the repo if you liked it: [UsmanBari/Chatbot-App](https://github.com/UsmanBari/Chatbot-App)
