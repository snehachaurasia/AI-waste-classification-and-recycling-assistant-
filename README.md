# ♻️ EcoSort AI – Image-Based Waste Classification and Recycling Assistant

An AI-powered waste classification system that uses deep learning and computer vision to identify different types of waste from images and help users make better waste disposal and recycling decisions.

## 📌 Project Overview

Improper waste segregation is one of the major challenges in effective waste management. Different types of waste require different disposal and recycling methods, but identifying and separating them manually can be difficult.

**EcoSort AI** aims to simplify this process using Artificial Intelligence and Deep Learning.

Users can upload an image of a waste item, and the system analyzes the image using a trained deep learning model to predict its waste category. The application also provides relevant disposal and recycling guidance.

## 🎯 Problem Statement

Traditional waste segregation often depends on manual identification, which can be time-consuming and prone to errors.

EcoSort AI addresses this problem by developing an automated image-based waste classification system that helps identify waste categories and encourages responsible waste disposal.

## ✨ Key Features

- **Image-Based Classification:** Upload an image of a waste item for automatic classification.
- **10 Waste Categories:** Classifies waste into ten different categories.
- **Deep Learning:** Uses a trained CNN model and MobileNetV2 transfer learning.
- **Prediction Confidence:** Provides confidence information for model predictions.
- **Recycling Assistance:** Provides waste disposal and recycling guidance.
- **Web-Based Interface:** User-friendly frontend for interacting with the AI system.
- **FastAPI Backend:** Connects the frontend with the trained machine learning model.

## 🗂️ Waste Categories

The model is trained to recognize the following 10 waste categories:

| No. | Category |
|---|---|
| 1 | Battery |
| 2 | Biological |
| 3 | Cardboard |
| 4 | Clothes |
| 5 | Glass |
| 6 | Metal |
| 7 | Paper |
| 8 | Plastic |
| 9 | Shoes |
| 10 | Trash |

## 🧠 Machine Learning Approach

EcoSort AI uses Convolutional Neural Networks (CNNs) for image classification.

Two model approaches were developed:

### 1. Custom CNN Model

A CNN architecture was developed to learn visual patterns and classify waste images into the ten categories.

Global Average Pooling was used to reduce the number of parameters in the classification head.

### 2. MobileNetV2 – Transfer Learning

MobileNetV2 was used as a pretrained feature extraction architecture.

Transfer learning helps leverage features learned from large image datasets and adapt them to the waste classification task.

The classification head was customized for the ten waste categories.

**Saved model files:**
- `EcoSort_AI_Final_Model.keras`
- `EcoSort_AI_MobileNetV2_90.keras`

## 📊 Dataset Information

The project uses an image-based waste classification dataset.

The dataset contains images belonging to ten waste categories.

The `standardized_256` dataset was used for the data preparation and training workflow.

**Dataset distribution:**

| Category | Images |
|---|---:|
| Battery | 756 |
| Biological | 699 |
| Cardboard | 1,411 |
| Clothes | 1,892 |
| Glass | 1,736 |
| Metal | 930 |
| Paper | 1,336 |
| Plastic | 1,597 |
| Shoes | 1,449 |
| Trash | 453 |
| **Total** | **12,259** |

The dataset was divided into training, validation and testing sets.

| Dataset | Images |
|---|---:|
| Training | 8,581 |
| Validation | 1,839 |
| Testing | 1,839 |
| **Total** | **12,259** |

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| Python | Core programming language |
| TensorFlow | Deep learning framework |
| Keras | Model development and training |
| MobileNetV2 | Transfer learning architecture |
| NumPy | Numerical operations |
| Scikit-learn | Model evaluation |
| Matplotlib | Data visualization |
| Jupyter Notebook | Model development and experimentation |
| FastAPI | Backend API development |
| HTML | Frontend structure |
| CSS | Frontend styling |
| JavaScript | Frontend functionality |
| Git & GitHub | Version control and project hosting |

## 📁 Project Structure

```text
EcoSort-AI/
│
├── backend/
│   ├── __init__.py
│   ├── assistant.py
│   ├── knowledge_base.json
│   ├── main.py
│   ├── predictor.py
│   ├── test_assistant.py
│   └── test_groq.py
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── models/
│   ├── EcoSort_AI_Final_Model.keras
│   ├── EcoSort_AI_MobileNetV2_90.keras
│   └── class_names.json
│
├── 01_Dataset_Exploration.ipynb
├── 02_Dataset_Exploration.ipynb
├── 03_Dataset_Exploration.ipynb
│
├── split_dataset.py
├── .gitignore
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/snehachaurasia/AI-waste-classification-and-recycling-assistant-.git
```

### 2. Navigate to the Project Directory

```bash
cd AI-waste-classification-and-recycling-assistant-
```

### 3. Create a Virtual Environment

```bash
python -m venv .venv
```

Activate it on Windows:

```bash
.venv\Scripts\activate
```

### 4. Install Dependencies

Install the required backend and machine learning dependencies used by the project.

```bash
pip install tensorflow fastapi uvicorn python-multipart pillow numpy scikit-learn
```

Install any additional dependencies required by the AI assistant component.

### 5. Run the Backend

From the project root directory:

```bash
uvicorn backend.main:app --reload
```

The backend will be available at:

`http://127.0.0.1:8000`

FastAPI interactive API documentation:

`http://127.0.0.1:8000/docs`

### 6. Run the Frontend

Open `frontend/index.html` in your browser.

Make sure the backend is running so that the frontend can communicate with the prediction API.

## 🔄 Project Workflow

1. **Dataset Collection:** Collect images belonging to different waste categories.
2. **Data Exploration:** Analyze the dataset and understand image distribution.
3. **Preprocessing:** Prepare images and divide the dataset into training, validation and testing sets.
4. **Model Training:** Train a custom CNN and experiment with MobileNetV2 transfer learning.
5. **Model Evaluation:** Evaluate the trained models using test data and classification metrics.
6. **Model Saving:** Save the trained model and class labels.
7. **Backend Development:** Develop APIs using FastAPI to handle image uploads and predictions.
8. **Frontend Development:** Build a web interface using HTML, CSS and JavaScript.
9. **Integration:** Connect the frontend, backend and trained model.
10. **Testing:** Test the complete application using different waste images.

## 🚀 Future Enhancements

- Improve classification accuracy through further model optimization.
- Expand the number of waste categories.
- Add real-time waste detection using a camera.
- Introduce location-based recycling center recommendations.
- Develop a mobile application.
- Add multilingual support for disposal instructions.
- Integrate smart waste management and analytics.

## 👩‍💻 Author

**Sneha Chaurasia**

GitHub: [@snehachaurasia](https://github.com/snehachaurasia)

## 📄 License

This project is developed for educational and practical learning purposes.

---

**EcoSort AI – Making Waste Segregation Smarter with Artificial Intelligence. 🌱♻️**
