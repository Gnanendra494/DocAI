

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from langchain.llms import CTransformers
from langchain.embeddings.huggingface import HuggingFaceEmbeddings
from langchain.vectorstores.faiss import FAISS
from langchain_community.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA
from langchain_community.document_loaders import DirectoryLoader
from langchain.document_loaders.pdf import PyMuPDFLoader
from langchain.document_loaders import TextLoader
# from cors import cors
from fastapi.middleware.cors import CORSMiddleware
import os
import pickle

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)



# Define request body model
class QuestionRequest(BaseModel):
    query: str
    # document_name: str
# Define response body model
class AnswerResponse(BaseModel):
    answer: str

# Define document loaders
loaders = {
    '.pdf': PyMuPDFLoader,
    '.txt': TextLoader,
}

# Define a function to create a DirectoryLoader for a specific file type
def create_directory_loader(file_type, directory_path):
    return DirectoryLoader(
        path=directory_path,
        glob=f"**/*{file_type}",
        loader_cls=loaders[file_type],
        show_progress=True
    )

# Load documents from the specified directory
def load_documents():
    pdf_loader = create_directory_loader('.pdf', './data/converted/')
    txt_loader = create_directory_loader('.txt', './data/converted/')
    pdf_documents = pdf_loader.load()
    txt_documents = txt_loader.load()
    return pdf_documents + txt_documents

# Initialize language model and embeddings
llm = CTransformers(
    model="TheBloke/Mistral-7B-Instruct-v0.2-GGUF",
    model_file="mistral-7b-instruct-v0.2.Q4_K_M.gguf",
    model_type="mistral",
    max_new_tokens=1048,
    temperature=0.3
)

model_name = "BAAI/bge-small-en-v1.5"
model_kwargs = {'device': 'cpu'}
encode_kwargs = {'normalize_embeddings': False}
embeddings = HuggingFaceEmbeddings( model_name=model_name,model_kwargs=model_kwargs,encode_kwargs=encode_kwargs)

# Load documents
docs = load_documents()

# Split documents into chunks
splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=30
)

chunked_docs = splitter.split_documents(docs)
print(chunked_docs)
# Create vector store with the embeddings object
db = FAISS.from_documents(chunked_docs, embeddings)

db.save_local("faiss_index")

# new_db = FAISS.load_local("faiss_index", embeddings)

# docs = new_db.similarity_search(query)


# Create retriever
retriever = db.as_retriever(
    search_type="similarity",
    search_kwargs={'k': 2},
    
)

print(retriever)

# Create answer generation chain
answer_generation_chain = RetrievalQA.from_chain_type(llm=llm, chain_type="stuff", return_source_documents=True, retriever=retriever)

@app.post("/ask", response_model=AnswerResponse)
async def ask_question(request: QuestionRequest):
    query = request.query
    response = answer_generation_chain(query)
    answer = response['result']
    document_name = response.get('source_document', '')
    print(answer)
    print(document_name)
    return {"answer": response['result']}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8008)