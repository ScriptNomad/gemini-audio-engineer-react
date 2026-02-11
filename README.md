# 🎛️ AI Audio Engineer (Dockerized)

**Your intelligent mixing assistant in a container.**

![Version](https://img.shields.io/badge/version-Gemini%203.0-blue)
![Deployment](https://img.shields.io/badge/deployment-Docker-green)

This is a containerized deployment of the **Gemini Audio Engineer**, a powerful tool that combines visual audio analysis with AI-powered mixing advice. It bundles a React frontend, a FastAPI backend, and specialized audio processing tools (Sonic Annotator & Vamp Plugins) into a single, ready-to-run Docker image.

## 🚀 Features
* **Waveform Analysis:** Upload WAV, MP3, or FLAC files and select specific regions for detailed inspection.
* **Spectrogram Visualization:** Automatically generates Mel-frequency spectrograms to identify frequency clashes and mix issues.
* **Dual AI Engines:**
    * **Google Gemini 3.0:** Full multimodal analysis (listens to audio + looks at spectrograms) with "Thinking" capabilities.
    * **OpenAI GPT-4o:** Native audio analysis for alternative feedback perspectives.
* **Chord & Beat Detection:** Built-in Vamp Plugins (Queen Mary & Chordino) detect chords, tempo, and beats automatically.
* **Interactive Chat:** Have a follow-up conversation with the AI to drill down into specific production techniques.

---

## 🛠️ Quick Start (Docker)

You can run the entire stack with a single command. You will need a Google Gemini API key (free tier available) or an OpenAI API key.

### Basic Launch
```bash
docker run -d \
  -p 5173:5173 \
  -p 8000:8000 \
  -e GEMINI_API_KEY="your_google_key" \
  -e OPENAI_API_KEY="your_openai_key" \
  --name audio-engineer \
  dockerizer000/audio-engineer:latest
```

Once running, access the application at: **http://localhost:5173**

---

## 🧠 Model Capabilities

| Feature | Google Gemini (3.0 Pro/Flash) | OpenAI (GPT-4o Audio) |
| :--- | :--- | :--- |
| **Audio Analysis** | ✅ Native Audio Support | ✅ Native Audio Support |
| **Visual Analysis** | ✅ Sees Spectrograms | ❌ Audio Only |
| **Reasoning** | ✅ Thinking/Reasoning Models | ❌ Standard Chat |
| **Best For...** | Deep dives, frequency visual checks | Alternative opinions, quick mix tips |

---

## ⚙️ Configuration

### Environment Variables
| Variable | Description | Required | Default |
| :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | Your Google AI Studio API Key. | **Yes** (if using Gemini) | N/A |
| `OPENAI_API_KEY` | Your OpenAI API Key. | **Yes** (if using GPT) | N/A |
| `VITE_API_URL` | The URL of the backend. Set this if running on a server (e.g., TrueNAS) to allow the frontend to connect. | No | `http://localhost:8000` |

### Ports
* **5173:** The React Frontend (User Interface).
* **8000:** The FastAPI Backend (Audio Processing API).

---

## 🖥️ Running on a Server (TrueNAS / Unraid)

If you are installing this on a home server and accessing it from a different computer on your network, **you must set the `VITE_API_URL` variable** so the frontend knows where to find the backend.

**Example for TrueNAS:**
* **Container Port 5173** -> Map to Node Port `9001`
* **Container Port 8000** -> Map to Node Port `9002`
* **Environment Variable:** `GEMINI_API_KEY` = `your_actual_google_api_key`
* **Environment Variable:** `VITE_API_URL` = `http://YOUR_SERVER_IP:9002`

### 🐳 TrueNAS Scale Installation Guide
1.  **Application Name:** `audio-engineer`
2.  **Container Image:**
    * Repository: `dockerizer000/audio-engineer`
    * Tag: `latest`
3.  **Port Forwarding:**
    * Container Port `5173` -> Host Port `9001`
    * Container Port `8000` -> Host Port `9002`
4.  **Environment Variables:**
    * `GEMINI_API_KEY`: (Paste your key)
    * `VITE_API_URL`: `http://192.168.x.x:9002` (Replace with your actual NAS IP)
    * *Note: If you skip `VITE_API_URL`, the frontend will try to connect to localhost, which will fail on other devices.*

---

## 💻 Building from Source (Local Development)

If you want to modify the code or build the image yourself:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ScriptNomad/gemini-audio-engineer-react.git
    cd gemini-audio-engineer-react
    ```

2.  **Build the Docker image:**
    ```bash
    docker build -t audio-engineer .
    ```

3.  **Run your local build:**
    ```bash
    docker run -p 5173:5173 -p 8000:8000 -e GEMINI_API_KEY="your_key" audio-engineer
    ```

---

## ⚠️ Note on API Usage
This application uses the **Google Gemini API**. The Free Tier is generous but has limits, especially with the high-demand **Gemini 3** models.

* **Free Tier Constraints:** You may encounter specific errors during peak times:
    * `503 Service Unavailable`: The Google servers are overloaded. **Solution:** Wait 1-2 minutes and try again.
    * `429 Too Many Requests`: You have hit the minute/day quota for the Free Tier. **Solution:** Switch to **Gemini 3.0 Flash** (which has much higher limits) or wait for the quota to reset.
* **Recommendation:** Default to **Gemini 3.0 Flash** for fast, reliable analysis. Use **Gemini 3.0 Pro** only for complex "Producer Mode" tasks, as it consumes quota much faster.

## ⚖️ License & Attribution

This project is a containerized distribution of open-source software.

### Application Code
**Gemini Audio Engineer:** Copyright © 2026 Anthony Galati.
Distributed under the **Non-Commercial / Research License**.
Free for personal, educational, and research use. Commercial use requires a separate license.

### Third-Party Components
This image includes the following software, redistributed under the **GNU General Public License (GPL)**:
* **Sonic Annotator:** Copyright © 2006-2022 Chris Cannam and Queen Mary, University of London. (GPL v2)
* **Vamp Plugins (Queen Mary):** Copyright © 2006-2022 Queen Mary, University of London. (GPL v2)
* **NNLS Chroma (Chordino):** Copyright © 2006-2012 Matthias Mauch and Queen Mary, University of London. (GPL v2)