# 🚀 Nexxus.Intelligence — Zero-Stress Cloud Deployment Guide
> **Architecture:**  
> 🌐 **Frontend:** Vercel (React + Vite SPA)  
> ⚡ **Backend:** Render (FastAPI + LangGraph)  
> 🧠 **Database:** Neo4j AuraDB Free (Managed Cloud Graph)  

---

## 📌 Phase 1: Create Your Free Neo4j AuraDB Database (3 Minutes)

1. Open your browser and go to: **[https://console.neo4j.io](https://console.neo4j.io)**
2. Click **Sign In** (or create a free account with Google/GitHub).
3. On the dashboard, click **"New Instance"**.
4. Choose the **Free** tier (AuraDB Free).
5. Give your database an instance name: `nexxus-intelligence` (or any name).
6. **IMPORTANT:** Neo4j will display a credentials screen with:
   - **Connection URI:** e.g. `neo4j+s://xxxxxxxx.databases.neo4j.io`
   - **Username:** `neo4j`
   - **Password:** A random string like `wA7...`
   - 👉 Click **"Download"** to save your credentials file to your computer.
7. Click **"I have saved these credentials"** and then **"Create"**.
8. Wait ~2-3 minutes while the status changes to green: **Running**.

---

## 📌 Phase 2: Ingest the Criminal Network Data into AuraDB (1 Minute)

Once your AuraDB instance is running:
1. Open `.env` in the root folder of this project (or we can do it together).
2. Update the Neo4j settings to your AuraDB credentials:
   ```env
   NEO4J_URL=neo4j+s://xxxxxxxx.databases.neo4j.io
   NEO4J_USER=neo4j
   NEO4J_PASSWORD=your_saved_auradb_password
   NEO4J_DATABASE=neo4j
   ```
3. Run the ingestion command in PowerShell:
   ```powershell
   .venv\Scripts\python.exe backend/run_ingestion.py
   ```
4. ✅ All **49 nodes** and **68 relationships** will instantly upload to your cloud database!

---

## 📌 Phase 3: Deploy Backend to Render (3 Minutes)

1. Go to **[https://dashboard.render.com](https://dashboard.render.com)** and sign in with GitHub.
2. Click **"New +"** (top right) ➔ **"Web Service"**.
3. Select **"Build and deploy from a Git repository"** and choose `4nkit-3isGGS/Nexxus.Intelligence`.
4. Configure the settings:
   - **Name:** `nexxus-intelligence-api` (or your preferred name)
   - **Region:** Any (e.g., Singapore or Frankfurt or US East)
   - **Branch:** `Main`
   - **Root Directory:** *(leave blank)*
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r backend/requirements.txt`
   - **Start Command:** `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type:** `Free`
5. Scroll down to **"Environment Variables"** and click **"Add Environment Variable"**:
   | Key | Value |
   |---|---|
   | `PYTHONPATH` | `.` |
   | `NEO4J_URL` | `neo4j+s://a0a75157.databases.neo4j.io` |
   | `NEO4J_USER` | `a0a75157` |
   | `NEO4J_PASSWORD` | `<your-auradb-password-from-.env>` |
   | `NEO4J_DATABASE` | `a0a75157` |
   | `NEO4J_CONNECTION_TIMEOUT` | `15.0` |
   | `OPENAI_API_KEY` | `<your-openai-api-key>` |
   | `OPENAI_MODEL` | `gpt-4o-mini` |
   | `GROQ_API_KEY` | `<your-groq-api-key>` |
6. Click **"Deploy Web Service"**.
7. In ~2 minutes, Render will output:
   `Your service is live 🎉 at: https://nexxus-intelligence-api.onrender.com`
8. Test it by visiting `https://nexxus-intelligence-api.onrender.com/api/health` in your browser. It will show:
   ```json
   {"status":"Healthy","Neo4j":"Connected"}
   ```

---

## 📌 Phase 4: Deploy Frontend to Vercel (2 Minutes)

1. Go to **[https://vercel.com](https://vercel.com)** and log in with GitHub.
2. Click **"Add New..."** ➔ **"Project"**.
3. Select your repository `Nexxus.Intelligence`.
4. In the configuration screen:
   - **Project Name:** `nexxus-intelligence`
   - **Framework Preset:** `Vite`
   - **Root Directory:** Click **Edit** and select `frontend` folder! *(CRITICAL)*
5. Expand **"Environment Variables"** and add:
   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://nexxus-intelligence-api.onrender.com/api` |
   | `VITE_OPENAI_API_KEY` | `sk-...` *(your OpenAI API key)* |
   | `VITE_GROQ_API_KEY` | `gsk_...` *(your Groq API key)* |
   *(Use your real Render URL from Phase 3 followed by `/api`)*
6. Click **"Deploy"**.
7. In ~30 seconds, Vercel will launch your live site:
   🎉 `https://nexxus-intelligence.vercel.app`

---

## 🔄 Making Future Changes (Zero Hassle)

Whenever you edit files locally:
```bash
git add .
git commit -m "Add new feature or fix"
git push origin Main
```
* Vercel will rebuild the frontend automatically.
* Render will rebuild the backend automatically.
* Your live demo stays continuously updated without any manual re-deployment!
