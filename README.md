<p align="center">
  <img src="public/readme_img.png" alt="Project Banner" width="400">
</p>

# 🩺 MarrowAI

MarrowAI is an **AI-powered healthcare analytics platform** that simplifies the process of managing, understanding, and acting on complex medical reports.  
By securely uploading documents such as blood tests, biopsies, and imaging studies, users gain **clear, AI-driven insights** — from health risk assessments to actionable recommendations.  
It also provides **access to details of specialized doctors**, helping users connect with the right healthcare professionals for their conditions.

---

## 📖 Table of Contents
1. [Introduction](#-introduction)
2. [Key Features](#-key-features)
3. [System Architecture](#-system-architecture)
4. [Technology Stack](#-technology-stack)
5. [Detailed Feature Descriptions](#-detailed-feature-descriptions)
6. [How It Works](#-how-it-works)
7. [Security & Privacy](#-security--privacy)
8. [Installation & Setup](#-installation--setup)

---

## 📌 Introduction

In healthcare, patients often receive **dense, technical medical reports** that are difficult to interpret without expert guidance. This creates:
- **Delayed health action** due to lack of understanding
- **Missed early warning signs** in test results
- **Fragmented record management**

**MarrowAI** solves these challenges by:
- Allowing **secure uploads** of medical reports
- Using **advanced AI models** to extract critical metrics
- Displaying results in **clear dashboards** with visual trends
- Providing **personalized, AI-based recommendations**
- Offering **details of specialized doctors** based on condition and location

---

## 🚀 Key Features

- **Medical Dashboard** – Overview of your latest health stats, AI insights, and recommendations
- **AI Report Analysis** – Automatic extraction of metrics like WBC, hemoglobin, platelets, and more
- **Risk Scoring** – Calculates health risk levels based on report data
- **Symptom Checker** – AI-assisted symptom assessment for early risk detection
- **Report Management** – Secure storage and easy retrieval of past reports
- **Trend Visualizations** – Graphs and charts showing changes over time
- **Specialized Doctor Directory** – Search and view detailed profiles of relevant healthcare specialists

---

## 🏗 System Architecture

**Frontend (Next.js)**
- Interactive UI for uploading, viewing, and analyzing reports
- Chart rendering for lab trends

**Backend**
- Secure API endpoints for file upload and data retrieval
- AI processing pipeline for extracting and interpreting report data

**AI Layer**
- Advanced AI models for medical data extraction and interpretation
- Risk scoring algorithms trained on diverse medical datasets for accurate assessments

**Database**
- Firebase Firestore for secure, real-time storage of structured lab metrics and report metadata
- Firebase Authentication for secure user login and role-based access control

---

## 💻 Technology Stack

| Layer           | Technology |
|----------------|------------|
| Frontend       | Next.js, React, TailwindCSS |
| Backend        | Node.js, Express |
| AI Processing  | AI Models |
| Database       | Firebase Firestore |
| Authentication | Firebase Auth |
| File Storage   | Firebase Cloud Storage (Encrypted) |
| Charts         | Chart.js / Recharts |

---

## 📂 Detailed Feature Descriptions

### 1. **Home**
- Landing page introducing MarrowAI
- Quick navigation to all features

### 2. **Dashboard**
- Displays **Risk Score** and **Health Level**
- Shows latest WBC, Hemoglobin, and Platelet counts
- Lists recent reports with quick access
- AI-generated health recommendations

### 3. **Upload Report**
- Secure upload of medical documents
- Automatic parsing and extraction of medical data
- End-to-end encrypted transfer and storage

### 4. **Symptom Checker**
- Guided questionnaire for symptom selection
- AI compares symptoms against medical condition database
- Outputs risk assessment and recommended actions

### 5. **Reports**
- Organized library of all uploaded medical reports
- Quick search and filtering
- Side-by-side comparison of past and present data

### 6. **Specialized Doctor Directory**
- Search doctors by specialization and location
- View detailed doctor profiles including:
  - Name & qualifications
  - Specialty
  - Experience
  - Contact information

---

## ⚙ How It Works

1. **Upload** your medical report in the "Upload Report" section.
2. **AI Processing** extracts health metrics and compares them with medical reference ranges.
3. **Risk Score** is generated to summarize urgency.
4. **Visual Insights** are shown in charts for easy understanding.
5. **Recommendations** are given to guide the next steps.
6. **Find a Specialist** – Based on results, browse doctor profiles for the right expertise.

---

## 🔒 Security & Privacy

- **End-to-End Encryption** for uploads
- **No unauthorized third-party data sharing**
- **User-controlled data deletion**

---

## 🛠 Installation & Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/marrowai.git
cd marrowai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your API keys and Firebase config

# Run development server
npm run dev

