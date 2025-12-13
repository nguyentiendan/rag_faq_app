import FileUpload from '@/components/FileUpload';
import Chat from '@/components/Chat';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">RAG FAQ Assistant</h1>
          <p className="text-slate-500 text-lg">Upload documents and ask questions instantly</p>
        </header>

        <div className="grid md:grid-cols-[350px_1fr] gap-8 items-start">
          <div className="space-y-6">
            <FileUpload />
            
            <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
              <h3 className="font-semibold text-blue-900 mb-2">How it works</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                <li>Upload a PDF or DOCX file </li>
                <li>Wait for processing to complete</li>
                <li>Ask questions in the chat</li>
                <li>Get answers based on your doc</li>
              </ol>
            </div>
          </div>

          <Chat />
        </div>
      </div>
    </main>
  );
}
