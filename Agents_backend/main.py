import io
import base64
import pandas as pd
import matplotlib.pyplot as plt
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict
from langchain_groq import ChatGroq
from pandasai import Agent

app = FastAPI(title="AI Data Agent", version="1.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

dataframes: Dict[str, pd.DataFrame] = {}

# Helper to return chart as base64
def capture_plot_base64() -> str:
    buf = io.BytesIO()
    plt.savefig(buf, format="png")
    plt.close()
    buf.seek(0)
    return base64.b64encode(buf.read()).decode("utf-8")

@app.get("/")
def root():
    return {"message": "Welcome to AI Data Agent API 🚀"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        if file.filename.endswith(".csv"):
            df = pd.read_csv(io.BytesIO(contents))
        elif file.filename.endswith((".xls", ".xlsx")):
            df = pd.read_excel(io.BytesIO(contents))
        else:
            return {"error": "Only CSV or Excel files are supported."}

        dataframes[file.filename] = df
        return {
            "message": "File uploaded successfully ✅",
            "filename": file.filename,
            "rows": df.shape[0],
            "columns": df.shape[1],
            "columns_list": df.columns.tolist()
        }

    except Exception as e:
        return {"error": f"Upload failed: {str(e)}"}

@app.post("/chat")
async def chat_with_data(
    filename: str = Form(...),
    question: str = Form(...),
    api_key: str = Form(...)
):
    if filename not in dataframes:
        return {"error": "File not found. Please upload first."}

    df = dataframes[filename]

    try:
        llm = ChatGroq(model_name="qwen/qwen3-32b", groq_api_key=api_key)
        agent = Agent(df, config={"llm": llm, "verbose": True})
        answer = agent.chat(question)

        response = {"question": question, "answer": str(answer)}

        if plt.get_fignums():
            response["chart_filename"] = "chart.png"
            response["chart_base64"] = capture_plot_base64()

        return response
    except Exception as e:
        return {"error": f"Processing failed: {str(e)}"}
