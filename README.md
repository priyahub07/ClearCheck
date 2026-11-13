# ClearCheck — Local MVP

A small educational prototype for analysing a manually entered ingredient list.
It uses a transparent, rule-based demonstration knowledge base. It does **not**
connect to live regulatory databases or provide medical advice.

## Requirements
- Python 3.10+
- Node.js 18+

## Run the backend (Terminal 1)
```bash
cd backend
python -m venv venv
# Windows PowerShell:
.\venv\Scripts\Activate.ps1
# Windows Command Prompt:
venv\Scripts\activate.bat
pip install -r requirements.txt
uvicorn main:app --reload
```
Backend: http://127.0.0.1:8000
API docs: http://127.0.0.1:8000/docs

## Run the frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```
Open the local URL printed by Vite (usually http://localhost:5173).

## Important scope note
The included ingredient entries are illustrative examples for demonstrating the
interface and workflow. They are not a complete or authoritative safety database.
The app does not determine whether a product causes cancer, and does not infer
that an ingredient is safe merely because no entry is found. Verify claims with
the relevant regulator and scientific source before real-world use.
