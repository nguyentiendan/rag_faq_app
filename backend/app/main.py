from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
import os
import uvicorn
from .rag import process_documents, get_qa_chain

app = FastAPI(title="RAG FAQ App")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class ChatRequest(BaseModel):
    question: str

@app.post("/upload")
async def upload_files(files: list[UploadFile] = File(...)):
    try:
        saved_file_paths = []
        for file in files:
            file_path = os.path.join(UPLOAD_DIR, file.filename)
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            saved_file_paths.append(file_path)
        
        num_chunks = process_documents(saved_file_paths)
        return {
            "filenames": [f.filename for f in files],
            "chunks": num_chunks,
            "status": "success",
            "message": "Files uploaded and indexed successfully."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        chain = get_qa_chain()
        # Streaming response
        async def generate():
            async for chunk in chain.astream(request.question):
                yield chunk
                
        return StreamingResponse(generate(), media_type="text/plain")
    except Exception as e:
         raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

@app.get("/health")
async def health_check():
    return {"status": "Server is running"}