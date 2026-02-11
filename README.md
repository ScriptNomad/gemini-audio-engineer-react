# 🎛️ AI Audio Engineer (Dockerized)

**Your intelligent mixing assistant in a container.**

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-Non--Commercial-orange)
![Docker](https://img.shields.io/badge/deployment-Docker-green)
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

### 📝 Configuration with .env
1. Copy the template: `cp .env.example .env`
2. Open `.env` and add your `GEMINI_API_KEY`.
3. Run `docker compose up -d`.

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

## 🐳 TrueNAS Scale Installation Guide

This application can be deployed on TrueNAS Scale as a **Custom App**. Follow these steps to get it running in minutes.

### 1. Application Name & Version
* **Application Name:** `audio-engineer`
* **Version:** `1.0.0` (or leave default)

### 2. Container Configuration
* **Repository:** `dockerizer000/audio-engineer`
* **Tag:** `latest`
* **Image Pull Policy:** `Always` (Recommended to ensure you get the latest updates)

### 3. Network Configuration (Port Forwarding)
You must expose **two** ports for the application to function: one for the user interface (Frontend) and one for the AI processing (Backend).

* **Port 1 (Frontend):**
    * **Container Port:** `5173`
    * **Node Port:** `9001` (or any available port greater than 9000)
* **Port 2 (Backend API):**
    * **Container Port:** `8000`
    * **Node Port:** `9002` (or any available port greater than 9000)

### 4. Environment Variables
Add the following variables in the **Environment Variables** section.

| Name | Value | Description |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | `your_google_api_key` | **Required.** Your API key from Google AI Studio. |
| `OPENAI_API_KEY` | `your_openai_api_key` | **Optional.** Only required if you want to use GPT-4o Audio mode. |
| `VITE_API_URL` | `http://YOUR_NAS_IP:9002` | **Critical.** This tells the frontend where the backend lives. |

> **⚠️ Important Note on `VITE_API_URL`:**
> You must replace `YOUR_NAS_IP` with the actual IP address of your TrueNAS server (e.g., `http://192.168.1.50:9002`).
> If you skip this, the app will try to connect to `localhost`, which will fail when accessing it from other computers.

### 5. Portal Configuration (Optional)
To make the "Web Portal" button in TrueNAS open the correct page:

1.  Click **Add** in the Portal Configuration section.
2.  **Portal Name:** `Web UI`
3.  **Protocol:** `HTTP`
4.  **Port:** `9001` (Must match the Node Port you set for the Frontend)
5.  **Path:** `/`

Click **Save** and wait for the application to deploy.

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

### ⚠️ Model Tier Requirements

This application supports both Gemini 3 Flash and Gemini 3 Pro. However, please note that **Gemini 3 Pro** requires a **Paid Tier** (Billing Enabled) API key from Google AI Studio. If you are using a Free Tier key, you must select **Gemini 3 Flash** to avoid `400: Model not found` errors.

#### Summary of Differences

| Feature | Gemini 3 Flash | Gemini 3 Pro |
| :--- | :--- | :--- |
| **API Cost** | Free (within rate limits) | Pay-as-you-go ($2.00/1M input) |
| **Context Window** | 32,000 tokens | 1,000,000+ tokens |
| **Capabilities** | Optimized for speed & coding | Flagship intelligence & deep reasoning |
| **Status** | **Working (Free Tier)** | **Requires Paid API Key** |

* **Free Tier Constraints:** You may encounter specific errors during peak times:
    * `503 Service Unavailable`: The Google servers are overloaded. **Solution:** Wait 1-2 minutes and try again.
    * `429 Too Many Requests`: You have hit the minute/day quota for the Free Tier. **Solution:** Switch to **Gemini 3.0 Flash** (which has much higher limits) or wait for the quota to reset.
* **Recommendation:** Default to **Gemini 3.0 Flash** for fast, reliable analysis. Use **Gemini 3.0 Pro** only for complex "Producer Mode" tasks, as it consumes quota much faster.

## 🔍 Troubleshooting & Common Issues

Since this app runs in a dual-container architecture on TrueNAS/Docker, most issues are related to networking or API restrictions.

### 🌐 Connectivity & UI Issues
* **"Backend Connection Error" or Infinite Loading:**
    * **Check `VITE_API_URL`:** Ensure this environment variable is set to your server's IP and the **Backend Node Port** (e.g., `http://192.168.1.50:9002`).
    * **Browser Cache:** If you've recently changed ports, try an Incognito window to bypass cached (and now incorrect) API endpoints.
* **Waveform Not Rendering:**
    * Ensure the uploaded file is a standard format (WAV, MP3, FLAC). Very high sample rates (above 96kHz) can sometimes struggle in the browser-side decoder.

### 🤖 Gemini API Errors
* **Error 400 (Model Not Found / Invalid):**
    * Usually occurs when trying to use **Gemini 3 Pro** on a Free Tier API key. Switch the model selector to **Gemini 3 Flash**.
* **Error 429 (Too Many Requests):**
    * You've hit the Free Tier rate limit. Gemini 3 models have tighter per-minute quotas. Wait 60 seconds and try again.
* **Error 503 (Service Unavailable):**
    * This is a Google-side overload. It is common during "Preview" phases of new models. Wait a few minutes and re-run the analysis.

### 🐳 Docker & TrueNAS Performance
* **Analysis is slow or container restarts:**
    * **CPU Resources:** Audio processing (Sonic Annotator) can be CPU-intensive. Ensure your TrueNAS App isn't strictly limited to a single low-power core.
    * **Logs:** Check the container logs in TrueNAS (`System -> Shell` or the App's "Logs" button) for specific Python tracebacks if the analysis fails.

### 💻 Local Deployment Issues (Mac/Windows/Linux)

* **Port 5173 or 8000 "Already in Use":**
    * **The Conflict:** If you are a developer and have a local React or FastAPI instance running *outside* of Docker, the container will fail to start because the port is "already allocated".
    * **The Fix:** Stop the local process or map to a different host port in your `docker run` command (e.g., `-p 5174:5173`).
* **"localhost" vs "0.0.0.0" (The Witness Protection Issue):**
    * **The Conflict:** Inside a Docker container, `localhost` refers to the container itself, not your computer.
    * **The Fix:** Always ensure the backend is listening on `0.0.0.0` so it is "gregarious" and reachable from the frontend.
* **Docker Desktop Memory Limits (Windows/Mac):**
    * **The Problem:** Large audio files or complex spectrogram generation can be RAM-intensive. Docker Desktop often defaults to only 2GB of RAM.
    * **The Fix:** If the container crashes during analysis, increase the memory limit in **Docker Desktop Settings > Resources** to at least 4GB.    

## ⚖️ License & Attribution

This project is a containerized distribution of open-source software.

## ⚖️ License

This project is distributed under a **Non-Commercial / Research License**. 

* [cite_start]**Personal/Educational Use:** Free[cite: 5].
* [cite_start]**Commercial Use:** Requires explicit permission and a separate license from the original author[cite: 8, 9].
* [cite_start]**Redistribution:** Permitted for non-commercial purposes only, provided this license is included[cite: 7].

[cite_start]For full legal terms, please see the [LICENSE](./LICENSE) file included in this repository[cite: 3].

### Application Code
**Gemini Audio Engineer:** Copyright © 2026 Anthony Galati.
Distributed under the **Non-Commercial / Research License**.
Free for personal, educational, and research use. Commercial use requires a separate license.

### Third-Party Components
This image includes the following software, redistributed under the **GNU General Public License (GPL)**:
* **Sonic Annotator:** Copyright © 2006-2022 Chris Cannam and Queen Mary, University of London. (GPL v2)
* **Vamp Plugins (Queen Mary):** Copyright © 2006-2022 Queen Mary, University of London. (GPL v2)
* **NNLS Chroma (Chordino):** Copyright © 2006-2012 Matthias Mauch and Queen Mary, University of London. (GPL v2)