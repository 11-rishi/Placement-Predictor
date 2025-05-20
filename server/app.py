import os
import re
import sys
import json
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
    'Skills Count': 0.40,  # Increased weight for skills
    'Experience': 0.25,    # Increased weight for experience
    'Education Level': 0.15,
    'Certifications Count': 0.10,
    'Project Count': 0.10,
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
    
    # Base score for having a resume
    base_score = 20
    
    # Calculate weighted score for each feature
    for feature, weight in WEIGHTS.items():
        raw_value = features[feature]
        
        # Normalize raw values
        if feature == 'Skills Count':
            # Cap skills at 20 for normalization
            normalized_value = min(raw_value, 20) / 20
        elif feature == 'Experience':
            # Cap experience at 10 years for normalization
            normalized_value = min(raw_value, 10) / 10
        elif feature == 'Education Level':
            # Education is already normalized (0-3)
            normalized_value = raw_value / 3
        elif feature == 'Certifications Count':
            # Cap certifications at 5 for normalization
            normalized_value = min(raw_value, 5) / 5
        elif feature == 'Project Count':
            # Cap projects at 10 for normalization
            normalized_value = min(raw_value, 10) / 10
            
        # Calculate weighted score (0-100 scale)
        weighted = normalized_value * weight * 100
        weighted_score += weighted
    
    # Add base score
    final_score = base_score + weighted_score
    
    # Ensure score is between 0 and 100
    return min(max(final_score, 0), 100)

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
    
    # Add additional information to the response
    return {
        'success': True,
        'score': round(ats_score, 2),
        'details': {
            'skills_found': skills_found,
            'experience_years': experience,
            'education_level': education_level,
            'certifications': cert_present,
            'projects': project_count
        }
    }


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

def main():
    if len(sys.argv) != 2:
        print(json.dumps({'error': 'Please provide a file path'}))
        sys.exit(1)

    file_path = sys.argv[1]
    if not os.path.exists(file_path):
        print(json.dumps({'error': 'File not found'}))
        sys.exit(1)

    result = process_resume(file_path)
    print(json.dumps(result))

if __name__ == '__main__':
    if len(sys.argv) > 1:
        main()
    else:
        app.run(debug=True, host='0.0.0.0', port=8080)