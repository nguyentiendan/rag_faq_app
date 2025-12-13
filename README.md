# Goal
Build a RAG-based FAQ application where users can upload documents (PDF, DOC) and ask questions via a chat interface. The system uses Next.js for the frontend, FastAPI for the backend, and LangChain for the RAG pipeline.

1. High-Level Architecture
System Components
Frontend (Next.js): Handles file uploads and chat interface.
Backend API (FastAPI): Manages uploads, processes documents, and handles chat queries.
RAG Engine (LangChain): Orchestrates document loading, splitting, embedding, and retrieval.
Vector Store (ChromaDB/FAISS): Stores document embeddings for semantic search.
LLM (OpenAI/Gemini): Generates answers based on retrieved context.


# Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- OpenAI API Key
## 1. Backend Setup
Navigate to the backend directory:
```cd rag_faq_app/backend```
Create a virtual environment (optional but recommended):

```python -m venv venv```
source venv/bin/activate  # On Windows: venv\Scripts\activate
Install dependencies:
```pip install -r requirements.txt```
Set up environment variables:
Create a .env file in rag_faq_app/backend.
Add your OpenAI API Key:
OPENAI_API_KEY=sk-...
Run the server:
uvicorn app.main:app --reload
The API will be available at http://localhost:8000.
## 2. Frontend Setup
Navigate to the frontend directory:
cd rag_faq_app/frontend
Install dependencies (if not already done):
npm install
Run the development server:
npm run dev
The app will be available at http://localhost:3000.
3. Usage
Open http://localhost:3000.
Upload: Click the upload area or drag a PDF/DOCX file. Wait for the "Uploaded" success message.
Chat: Type a question in the chat box on the right. The AI will answer based on the uploaded document.
Notes
The vector database is stored locally in rag_faq_app/backend/chroma_db.
Uploaded files are saved in rag_faq_app/backend/uploads.
