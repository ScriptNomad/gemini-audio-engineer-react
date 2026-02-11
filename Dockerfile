# 1. Base Image
FROM python:3.11-slim-bookworm

# 2. Install System Dependencies
# We only need the basics now because you did the hard work already!
RUN apt-get update && apt-get upgrade && apt-get install -y \
    ffmpeg \
    curl \
    gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 3. Install Sonic Annotator (From your extracted folder)
# We copy the 'sonic-dist' folder to /opt/sonic
COPY sonic-dist/ /opt/sonic/

# 4. Install Vamp Plugins (From your extracted folder)
# We copy the 'vamp-plugins' folder to the system path
COPY vamp-plugins/ /usr/local/lib/vamp/

# 5. Set Working Directory
WORKDIR /app

# 6. Install Backend Dependencies
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

# 7. Install Frontend Dependencies
COPY frontend/package.json ./frontend/
WORKDIR /app/frontend
RUN npm install

# 8. Copy Application Code
WORKDIR /app
COPY . .

# 9. Environment Variables
# KEY CHANGE: We point to 'AppRun' inside the extracted sonic folder
ENV SONIC_ANNOTATOR_EXE=/opt/sonic/AppRun
ENV VAMP_PATH=/usr/local/lib/vamp

# 10. Start Script
EXPOSE 8000 5173
CMD ["sh", "-c", "cd backend && uvicorn app:app --host 0.0.0.0 --port 8000 & cd frontend && npm run dev -- --host"]