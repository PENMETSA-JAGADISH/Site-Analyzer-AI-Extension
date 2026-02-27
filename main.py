from fastapi import FastAPI
from groq import Groq
from validation import AnalyzeRequest
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("Llama_API_KEY"))

app=FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
def analyzer(request: AnalyzeRequest):
    completion = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
     messages=[
            {"role": "system", "content": "You are a helpful assistant you will get the current site data and user question your task is to understand the user question which are related to only the content provided and related onces and for other question just reply that we are a only helpful for site analyzer only etc..."},
            {"role": "user", "content": f"Context: {request.web_content.allText}"},
            {"role": "user", "content": f"Question: {request.userinput}"}
        ],
    temperature=1,
    max_completion_tokens=1024,
    top_p=1,
    stream=False,
    stop=None)

    return{"reply": completion.choices[0].message.content}