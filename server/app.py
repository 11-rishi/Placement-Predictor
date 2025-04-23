import os
import re
import fitz  # PyMuPDF
from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
  # 16MB max file size
app.config['ALLOWED_EXTENSIONS'] = {'pdf'}

# Create uploads folder if it doesn't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Define weights for ATS score calculation
WEIGHTS = {
    'Skills Count': 0.35,
    'Experience': 0.20,
    'Education Level': 0.15,
    'Certifications Count': 0.15,
    'Project Count': 0.15,
}


# Expanded skill keywords
SKILL_KEYWORDS = [
    'python',
    'java',
    'c++',
    'javascript',
    'sql',
    'html',
    'css',
    'ruby',
    'go',
    'swift',
    'tensorflow',
    'pytorch',
    'keras',
    'scikit-learn',
    'machine learning',
    'deep learning',
    'data science',
    'nlp',
    'r',
    'hadoop',
    'spark',
    'tableau',
    'power bi',
    'docker',
    'kubernetes',
    'linux',
    'aws',
    'azure',
    'google cloud',
    'react',
    'angular',
    'node.js',
    'vue.js',
    'django',
    'flask',
    'git',
    'mongodb',
    'postgresql',
    'firebase',
    'graphql',
    'big data',
]


def allowed_file(filename):
    return (
        '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']
    )


def extract_text_from_pdf(pdf_path):
    """Extract text from a PDF file"""
    text = ""
    try:
        with fitz.open(pdf_path) as doc:
            for page in doc:
                text += page.get_text()
        return text.lower()
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return ""

def extract_skills(text):
    """Extract skills from text based on predefined keywords"""
    found = [
        skill
        for skill in SKILL_KEYWORDS
        if re.search(r'\b' + re.escape(skill) + r'\b', text, re.IGNORECASE)
    ]
    return list(set(found))
  # Remove duplicates

def extract_experience(text):
    """Extract years of experience from text"""
    match = re.search(r'(\d+)\s+years?', text)
    return int(match.group(1)) if match else 0


def extract_education(text):
    """Extract education level from text"""
    if 'phd' in text:
        return 3
    if 'mba' in text:
        return 2
    if 'b.tech' in text or 'bachelor' in text or 'b.sc' in text:
        return 1
    return 0


def extract_certifications(text):
    """Extract certifications from text"""
    return len(re.findall(r'certification|certified', text))

def extract_project_count(text):
    """Extract project count from text"""
    return len(re.findall(r'project', text))

def calculate_ats_score(features):
    """Calculate ATS score based on extracted features"""
    weighted_score = 0
    
    for feature, weight in WEIGHTS.items():
        raw_value = features[feature]
        weighted = raw_value * weight * 10  # scale the weight for percentage
        weighted_score += weighted
        
    return weighted_score

def process_resume(file_path):
    """Process resume and calculate ATS score"""
    # Extract text from the uploaded PDF

    resume_text = extract_text_from_pdf(file_path)
    
    if not resume_text:
        return {'success': False, 'message': 'Failed to extract text from the PDF'}
    # Extract features from resume text

    skills_found = extract_skills(resume_text)
    experience = extract_experience(resume_text)
    education_level = extract_education(resume_text)
    cert_present = extract_certifications(resume_text)
    project_count = extract_project_count(resume_text)
    
    # Prepare features for calculation

    features = {
        'Skills Count': len(skills_found),
        'Experience': experience,
        'Education Level': education_level,
        'Certifications Count': cert_present,
        'Project Count': project_count,
    }
    
    # Calculate the ATS score

    ats_score = calculate_ats_score(features)

    return {'success': True, 'score': round(ats_score, 2)}


@app.route('/')
def index():
    return "ATS Resume Analyzer API - Use the /upload endpoint to analyze resumes."


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'resume' not in request.files:
        return jsonify({'error': 'No file part'})
    file = request.files['resume']
    
    if file.filename == "":
        return jsonify({'error': 'No selected file'})
    if not file or not allowed_file(file.filename):
        return jsonify({'error': 'File type not allowed. Please upload a PDF.'})
    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(file_path)
    
    # Get the full result

    result = process_resume(file_path)
    
    # Clean up the file

    try:
        os.remove(file_path)
    except:
        pass
    # Return only the score

    if result['success']:
        return jsonify({'score': result['score']})
    return jsonify({'error': result['message']})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8080)