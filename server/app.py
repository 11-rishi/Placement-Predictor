from flask import Flask, request, jsonify
from flask_cors import CORS
import PyPDF2
import joblib
import os

app = Flask(__name__)
CORS(app)

# Load the model
model = joblib.load("ats_model.sav")

# Helper: extract text from PDF
def extract_text_from_pdf(file):
    reader = PyPDF2.PdfReader(file)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text

# Route to handle file upload
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and file.filename.endswith('.pdf'):
        try:
            text = extract_text_from_pdf(file)
            # Convert text into the format your model expects
            # Here we assume the model takes a list of texts
            score = model.predict([text])[0]

            return jsonify({"score": float(score)})
        except Exception as e:
            print("Error:", e)
            return jsonify({"error": "Failed to process file"}), 500
    else:
        return jsonify({"error": "Invalid file type"}), 400

if __name__ == '__main__':
    app.run(debug=True)
