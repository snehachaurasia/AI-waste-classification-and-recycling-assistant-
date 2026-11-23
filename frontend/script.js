
// ==========================================
// ECOSORT AI - COMPLETE FRONTEND JAVASCRIPT
// ==========================================

// Backend API endpoints
const API_URL = "http://127.0.0.1:8000/predict";
const CHAT_API_URL = "http://127.0.0.1:8000/ask";


// ==========================================
// PAGE NAVIGATION
// ==========================================

const navItems = document.querySelectorAll(".nav-item");
const appPages = document.querySelectorAll(".app-page");
const pageHeading = document.getElementById("page-heading");

function showPage(pageId) {
    appPages.forEach(page => {
        page.classList.toggle("active-page", page.id === pageId);
    });

    navItems.forEach(item => {
        item.classList.toggle("active", item.dataset.page === pageId);
    });

    const selectedItem = [...navItems].find(
        item => item.dataset.page === pageId
    );

    if (pageHeading && selectedItem) {
        pageHeading.textContent = selectedItem.textContent.trim();
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// Sidebar navigation
navItems.forEach(item => {
    item.addEventListener("click", () => {
        showPage(item.dataset.page);
    });
});

// Navigation from feature cards and buttons
document.querySelectorAll("[data-go]").forEach(item => {
    item.addEventListener("click", () => {
        showPage(item.dataset.go);
    });
});


// ==========================================
// IMAGE CLASSIFICATION ELEMENTS
// ==========================================

const uploadArea = document.getElementById("upload-area");
const fileInput = document.getElementById("file-input");
const browseButton = document.getElementById("browse-button");

const previewContainer = document.getElementById("preview-container");
const imagePreview = document.getElementById("image-preview");
const fileName = document.getElementById("file-name");
const removeImageButton = document.getElementById("remove-image");

const classifyButton = document.getElementById("classify-button");
const loadingState = document.getElementById("loading-state");
const errorMessage = document.getElementById("error-message");

const resultSection = document.getElementById("result-section");
const resultIcon = document.getElementById("result-icon");
const resultCategory = document.getElementById("result-category");
const resultConfidence = document.getElementById("result-confidence");
const resultConfidenceBar = document.getElementById("result-confidence-bar");
const resultDescription = document.getElementById("result-description");
const resultFilename = document.getElementById("result-filename");
const tryAgainButton = document.getElementById("try-again-button");

let selectedFile = null;
let previewUrl = null;


// ==========================================
// SUPPORTED IMAGE TYPES
// ==========================================

const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp"
];


// ==========================================
// WASTE CATEGORY INFORMATION
// ==========================================

const categoryInfo = {
    battery: {
        icon: "🔋",
        description: "Battery waste. Keep used batteries separate and take them to an appropriate battery collection or recycling point."
    },

    biological: {
        icon: "🍃",
        description: "Biological waste, such as organic material. Where local facilities allow, this may be suitable for composting."
    },

    cardboard: {
        icon: "📦",
        description: "Cardboard waste. Keep it clean and dry, flatten it, and place it in an appropriate paper and cardboard recycling stream."
    },

    clothes: {
        icon: "👕",
        description: "Clothing or textile waste. Consider reuse, donation, or a textile collection facility if the item is in a suitable condition."
    },

    glass: {
        icon: "🍾",
        description: "Glass waste. Use a designated glass collection facility where available, and handle broken glass carefully."
    },

    metal: {
        icon: "🥫",
        description: "Metal waste. Separate suitable metal items for collection through your local recycling system."
    },

    paper: {
        icon: "📄",
        description: "Paper waste. Keep paper clean and dry before placing it in an appropriate paper recycling stream."
    },

    plastic: {
        icon: "🧴",
        description: "Plastic waste. Check local recycling rules and separate accepted plastic items for collection."
    },

    shoes: {
        icon: "👟",
        description: "Footwear waste. Consider repairing, reusing, donating, or using a suitable textile or footwear collection point."
    },

    trash: {
        icon: "🗑️",
        description: "General trash category. Check whether the item can be reused or separated into a more specific waste category."
    }
};


// ==========================================
// IMAGE SELECTION
// ==========================================

if (browseButton && fileInput) {
    browseButton.addEventListener("click", event => {
        event.stopPropagation();
        fileInput.click();
    });
}

if (uploadArea && fileInput) {
    uploadArea.addEventListener("click", event => {
        if (event.target.closest("button")) {
            return;
        }

        fileInput.click();
    });
}

if (fileInput) {
    fileInput.addEventListener("change", event => {
        const file = event.target.files[0];

        if (file) {
            handleFile(file);
        }
    });
}


// ==========================================
// IMAGE VALIDATION AND PREVIEW
// ==========================================

function handleFile(file) {
    hideError();
    hideResult();

    if (!allowedTypes.includes(file.type)) {
        showError("Please select a JPG, PNG, or WEBP image.");
        fileInput.value = "";
        return;
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
        showError("Image size must be 10 MB or less.");
        fileInput.value = "";
        return;
    }

    if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
    }

    selectedFile = file;
    previewUrl = URL.createObjectURL(file);

    imagePreview.src = previewUrl;
    fileName.textContent = file.name;

    previewContainer.hidden = false;
    uploadArea.hidden = true;

    classifyButton.disabled = false;
}


// ==========================================
// REMOVE SELECTED IMAGE
// ==========================================

function resetImageSelection() {
    selectedFile = null;

    if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        previewUrl = null;
    }

    imagePreview.removeAttribute("src");
    fileInput.value = "";

    previewContainer.hidden = true;
    uploadArea.hidden = false;

    classifyButton.disabled = true;

    hideError();
    hideResult();

    loadingState.hidden = true;
}

if (removeImageButton) {
    removeImageButton.addEventListener(
        "click",
        resetImageSelection
    );
}


// ==========================================
// DRAG AND DROP
// ==========================================

if (uploadArea) {
    ["dragenter", "dragover"].forEach(eventName => {
        uploadArea.addEventListener(eventName, event => {
            event.preventDefault();
            event.stopPropagation();

            uploadArea.classList.add("dragover");
        });
    });

    ["dragleave", "drop"].forEach(eventName => {
        uploadArea.addEventListener(eventName, event => {
            event.preventDefault();
            event.stopPropagation();

            uploadArea.classList.remove("dragover");
        });
    });

    uploadArea.addEventListener("drop", event => {
        const file = event.dataTransfer.files[0];

        if (file) {
            handleFile(file);
        }
    });
}


// ==========================================
// CLASSIFY IMAGE
// ==========================================

if (classifyButton) {
    classifyButton.addEventListener("click", classifyImage);
}

async function classifyImage() {
    if (!selectedFile) {
        showError("Please select an image first.");
        return;
    }

    hideError();
    hideResult();

    loadingState.hidden = false;
    classifyButton.disabled = true;

    try {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const response = await fetch(API_URL, {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.detail || "Unable to classify the image."
            );
        }

        displayResult(data);

    } catch (error) {
        console.error("Classification error:", error);

        if (error instanceof TypeError) {
            showError(
                "Could not connect to the backend. Make sure FastAPI is running at http://127.0.0.1:8000."
            );
        } else {
            showError(
                error.message || "Something went wrong. Please try again."
            );
        }

    } finally {
        loadingState.hidden = true;
        classifyButton.disabled = !selectedFile;
    }
}


// ==========================================
// DISPLAY CLASSIFICATION RESULT
// ==========================================

function displayResult(data) {
    const category = String(
        data.predicted_class || ""
    ).toLowerCase();

    const confidence = Number(data.confidence);

    if (!categoryInfo[category] || !Number.isFinite(confidence)) {
        showError("Invalid prediction received from backend.");
        return;
    }

    const info = categoryInfo[category];

    resultIcon.textContent = info.icon;

    resultCategory.textContent =
        category.charAt(0).toUpperCase() + category.slice(1);

    resultConfidence.textContent =
        `${confidence.toFixed(2)}%`;

    resultConfidenceBar.style.width =
        `${Math.max(0, Math.min(100, confidence))}%`;

    resultDescription.textContent = info.description;

    resultFilename.textContent =
        `Image analysed: ${data.filename || selectedFile.name}`;

    displayGuidance(data.waste_guidance, category);

    // Remove previous Top 3 predictions
    const previous = document.getElementById("top-predictions");

    if (previous) {
        previous.remove();
    }

    // Create Top 3 predictions section
    const section = document.createElement("div");
    section.id = "top-predictions";
    section.className = "top-predictions";

    const heading = document.createElement("h3");
    heading.textContent = "Top 3 Predictions";

    section.appendChild(heading);

    const predictions = data.top_predictions || [];

    predictions.slice(0, 3).forEach((item, index) => {
        const name = String(
            item.category || ""
        ).toLowerCase();

        const score = Number(item.confidence);

        if (!categoryInfo[name] || !Number.isFinite(score)) {
            return;
        }

        const row = document.createElement("div");
        row.className = "prediction-row";

        const details = document.createElement("div");
        details.className = "prediction-details";

        const label = document.createElement("span");

        label.textContent =
            `${index + 1}. ${name.charAt(0).toUpperCase() + name.slice(1)}`;

        const percentage = document.createElement("strong");
        percentage.textContent = `${score.toFixed(2)}%`;

        details.appendChild(label);
        details.appendChild(percentage);

        const track = document.createElement("div");
        track.className = "prediction-bar-track";

        const fill = document.createElement("div");
        fill.className = "prediction-bar-fill";

        fill.style.width =
            `${Math.max(0, Math.min(100, score))}%`;

        track.appendChild(fill);

        row.appendChild(details);
        row.appendChild(track);

        section.appendChild(row);
    });

    resultDescription.insertAdjacentElement(
        "afterend",
        section
    );

    resultSection.hidden = false;

    resultSection.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
}


// ==========================================
// DISPLAY WASTE GUIDANCE
// ==========================================

function displayGuidance(guidance, category) {
    const guidanceSection =
        document.getElementById("guidance-section");

    const guidanceCategory =
        document.getElementById("guidance-category");

    const guidanceContent =
        document.getElementById("guidance-content");

    const guidanceError =
        document.getElementById("guidance-error");

    if (!guidanceContent) {
        return;
    }

    guidanceContent.replaceChildren();

    if (guidanceError) {
        guidanceError.hidden = true;
    }

    if (guidanceCategory) {
        guidanceCategory.textContent =
            category.charAt(0).toUpperCase() + category.slice(1);
    }

    if (!guidance) {
        guidanceContent.textContent = "No guidance is available.";

        if (guidanceSection) {
            guidanceSection.hidden = false;
        }

        return;
    }

    if (typeof guidance === "string") {
        guidanceContent.textContent = guidance;
    } else {
        Object.entries(guidance).forEach(([key, value]) => {
            const block = document.createElement("div");
            block.className = "guidance-item";

            const heading = document.createElement("h3");

            heading.textContent = key
                .replace(/_/g, " ")
                .replace(/\b\w/g, letter => letter.toUpperCase());

            block.appendChild(heading);

            if (Array.isArray(value)) {
                const list = document.createElement("ul");

                value.forEach(item => {
                    const listItem = document.createElement("li");
                    listItem.textContent = String(item);
                    list.appendChild(listItem);
                });

                block.appendChild(list);

            } else if (value && typeof value === "object") {
                const paragraph = document.createElement("p");

                paragraph.textContent =
                    JSON.stringify(value, null, 2);

                block.appendChild(paragraph);

            } else {
                const paragraph = document.createElement("p");
                paragraph.textContent = String(value);
                block.appendChild(paragraph);
            }

            guidanceContent.appendChild(block);
        });
    }

    if (guidanceSection) {
        guidanceSection.hidden = false;
    }
}


// ==========================================
// ERROR AND RESULT HELPERS
// ==========================================

function showError(message) {
    if (!errorMessage) return;

    errorMessage.textContent = message;
    errorMessage.hidden = false;
}

function hideError() {
    if (!errorMessage) return;

    errorMessage.textContent = "";
    errorMessage.hidden = true;
}

function hideResult() {
    if (!resultSection) return;

    resultSection.hidden = true;

    if (resultConfidenceBar) {
        resultConfidenceBar.style.width = "0%";
    }
}


// ==========================================
// CLASSIFY ANOTHER IMAGE
// ==========================================

if (tryAgainButton) {
    tryAgainButton.addEventListener("click", () => {
        resetImageSelection();
        showPage("detection-page");
    });
}


// ==========================================
// ECOSORT AI - CHATBOT ELEMENTS
// ==========================================

const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatMessages = document.getElementById("chat-messages");
const chatSendButton = document.getElementById("chat-send-button");
const chatError = document.getElementById("chat-error");


// ==========================================
// VOICE ASSISTANT ELEMENTS
// ==========================================

const voiceButton = document.getElementById("voice-button");
const voiceStatus = document.getElementById("voice-status");

let recognition = null;
let isListening = false;


// ==========================================
// DISPLAY CHAT MESSAGE
// ==========================================

function addChatMessage(message, sender) {
    if (!chatMessages) {
        console.error("Chat messages element not found.");
        return;
    }

    const messageRow = document.createElement("div");

    messageRow.className =
        sender === "user"
            ? "chat-message user-message"
            : "chat-message bot-message";

    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    avatar.textContent = sender === "user" ? "👤" : "🌿";

    const content = document.createElement("div");
    content.className = "message-content";
    content.textContent = String(message);

    messageRow.appendChild(avatar);
    messageRow.appendChild(content);

    chatMessages.appendChild(messageRow);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}


// ==========================================
// TEXT TO SPEECH
// ==========================================

function speakAnswer(message) {
    if (!("speechSynthesis" in window)) {
        if (voiceStatus) {
            voiceStatus.textContent =
                "Speech output is not supported in this browser.";
        }
        return;
    }

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(message);

    speech.lang = "en-IN";
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
}


// ==========================================
// SEND QUESTION TO AI BACKEND
// ==========================================

async function sendChatQuestion(question) {
    if (!question || !question.trim()) {
        return;
    }

    if (!chatMessages || !chatInput || !chatSendButton) {
        console.error("Chatbot HTML elements are missing.");
        return;
    }

    if (chatSendButton.disabled) {
        return;
    }

    if (chatError) {
        chatError.hidden = true;
        chatError.textContent = "";
    }

    // Display user's question
    addChatMessage(question, "user");

    // Clear input
    chatInput.value = "";

    // Disable controls while waiting
    chatSendButton.disabled = true;
    chatInput.disabled = true;
    chatSendButton.textContent = "Sending...";

    try {
        // Send question to FastAPI
        const response = await fetch(CHAT_API_URL, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: question.trim()
            })
        });

        const data = await response.json();

        console.log("AI Backend Response:", data);

        if (!response.ok) {
            throw new Error(
                data.detail || "Unable to get an AI response."
            );
        }

        if (!data.success || !data.response) {
            throw new Error(
                data.response || "Unable to generate an AI response."
            );
        }

        // Display AI answer
        addChatMessage(data.response, "bot");

        console.log("Bot message displayed");

        // Read AI answer aloud
        speakAnswer(data.response);

    } catch (error) {
        console.error("Chatbot error:", error);

        if (chatError) {
            chatError.textContent =
                error.message ||
                "Unable to connect to the AI assistant.";

            chatError.hidden = false;
        }

    } finally {
        // Enable controls again
        chatSendButton.disabled = false;
        chatInput.disabled = false;
        chatSendButton.textContent = "Send ➤";
        chatInput.focus();
    }
}


// ==========================================
// CHAT FORM SUBMISSION
// ==========================================

if (chatForm && chatInput) {
    chatForm.addEventListener("submit", event => {
        event.preventDefault();

        sendChatQuestion(chatInput.value.trim());
    });
}


// ==========================================
// SUGGESTED QUESTIONS
// ==========================================

document.querySelectorAll(".suggestion-button").forEach(button => {
    button.addEventListener("click", () => {
        sendChatQuestion(button.textContent.trim());
    });
});


// ==========================================
// VOICE RECOGNITION SETUP
// ==========================================

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
        isListening = true;

        if (voiceStatus) {
            voiceStatus.textContent = "Listening... Speak now.";
        }

        if (voiceButton) {
            voiceButton.textContent = "⏹ Stop Listening";
        }
    };

    recognition.onresult = event => {
        const spokenQuestion =
            event.results[0][0].transcript;

        if (chatInput) {
            chatInput.value = spokenQuestion;
        }

        if (voiceStatus) {
            voiceStatus.textContent =
                "You said: " + spokenQuestion;
        }

        sendChatQuestion(spokenQuestion);
    };

    recognition.onerror = event => {
        console.error("Voice recognition error:", event.error);

        if (voiceStatus) {
            voiceStatus.textContent =
                "Voice error: " + event.error;
        }
    };

    recognition.onend = () => {
        isListening = false;

        if (voiceButton) {
            voiceButton.textContent = "🎤 Start Voice Assistant";
        }
    };

} else {
    if (voiceStatus) {
        voiceStatus.textContent =
            "Voice recognition is not supported. Please use Google Chrome.";
    }

    if (voiceButton) {
        voiceButton.disabled = true;
    }
}


// ==========================================
// VOICE BUTTON
// ==========================================

if (voiceButton) {
    voiceButton.addEventListener("click", () => {
        if (!recognition) return;

        if (isListening) {
            recognition.stop();
            return;
        }

        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
        }

        try {
            recognition.start();
        } catch (error) {
            console.error("Unable to start voice recognition:", error);

            if (voiceStatus) {
                voiceStatus.textContent =
                    "Could not start microphone. Please try again.";
            }
        }
    });
}


// ==========================================
// INITIAL CHATBOT STATUS
// ==========================================

if (voiceStatus && recognition) {
    voiceStatus.textContent =
        "Voice assistant is ready. Click the microphone to speak.";
}


// ==========================================
// INITIAL PAGE
// ==========================================

showPage("home-page");
