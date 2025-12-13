import requests
import os
import time

BASE_URL = "http://localhost:8000"

def test_rag_flow():
    print("Starting RAG flow test...")
    
    # 1. Create dummy files
    files_to_upload = [
        ("test1.txt", "The capital of France is Paris."),
        ("test2.txt", "The capital of Germany is Berlin.")
    ]
    
    upload_files = []
    for filename, content in files_to_upload:
        with open(filename, "w") as f:
            f.write(content)
        upload_files.append(('files', (filename, open(filename, 'rb'), 'text/plain')))
    
    try:
        # 2. Upload files
        print("Uploading files...")
        response = requests.post(f"{BASE_URL}/upload", files=upload_files)
        if response.status_code == 200:
            print("Upload successful:", response.json())
        else:
            print("Upload failed:", response.text)
            return

        # 3. Chat
        print("Testing chat...")
        questions = [
            "What is the capital of France?",
            "What is the capital of Germany?"
        ]
        
        for q in questions:
            print(f"Question: {q}")
            response = requests.post(f"{BASE_URL}/chat", json={"question": q}, stream=True)
            if response.status_code == 200:
                print("Answer: ", end="")
                for chunk in response.iter_content(chunk_size=None):
                    if chunk:
                        print(chunk.decode(), end="")
                print("\n")
            else:
                print("Chat failed:", response.text)
                
    finally:
        # Cleanup
        for filename, _ in files_to_upload:
            if os.path.exists(filename):
                os.remove(filename)
            # Close file handles if I kept them open? 
            # The list comprehension opened them inline, so they might be closed by GC or remain open until script ends.
            # For a simple script it's fine.

if __name__ == "__main__":
    try:
        requests.get(f"{BASE_URL}/health")
        test_rag_flow()
    except requests.exceptions.ConnectionError:
        print("Server is not running. Please start the server with `uvicorn app.main:app --reload`")
