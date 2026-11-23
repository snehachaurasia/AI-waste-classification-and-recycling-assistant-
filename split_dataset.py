import os
import shutil
from sklearn.model_selection import train_test_split

# Path of the original dataset
SOURCE_DIR = r"dataset\waste_dataset\standardized_256"

OUTPUT_DIR = "data"

# Get all category names from the source directory
categories = sorted([
    folder for folder in os.listdir(SOURCE_DIR)
    if os.path.isdir(os.path.join(SOURCE_DIR, folder))
])

print("Waste Categories:", categories)
print("Total Categories:", len(categories))

# Create empty lists to store image paths and labels
image_paths = []
image_labels = []

# Collect images from every category
for category in categories:

    category_path = os.path.join(SOURCE_DIR, category)

    for file in os.listdir(category_path):

        if file.lower().endswith(('.png', '.jpg', '.jpeg')):

            image_path = os.path.join(category_path, file)

            image_paths.append(image_path)
            image_labels.append(category)

# Display dataset information
print("Total Images Collected:", len(image_paths))
print("Total Labels Collected:", len(image_labels))

# Split dataset into training (70%) and temporary (30%)

X_train, X_temp, y_train, y_temp = train_test_split(
    image_paths,
    image_labels,
    test_size=0.30,
    random_state=42,
    stratify=image_labels
)

print("Training Images:", len(X_train))
print("Temporary Images:", len(X_temp))

# Split temporary data into validation (15%) and testing (15%)

X_val, X_test, y_val, y_test = train_test_split(
    X_temp,
    y_temp,
    test_size=0.50,
    random_state=42,
    stratify=y_temp
)

print("Training Images:", len(X_train))
print("Validation Images:", len(X_val))
print("Testing Images:", len(X_test))

print("---------------------------")
print("Total Images:", len(X_train) + len(X_val) + len(X_test))

# Create category folders and copy images

datasets = {
    "train": (X_train, y_train),
    "validation": (X_val, y_val),
    "test": (X_test, y_test)
}

for split_name, (image_list, label_list) in datasets.items():

    for image_path, label in zip(image_list, label_list):

        # Create destination category folder
        destination_folder = os.path.join(OUTPUT_DIR, split_name, label)

        os.makedirs(destination_folder, exist_ok=True)

        # Get image filename
        filename = os.path.basename(image_path)

        # Create destination image path
        destination_path = os.path.join(destination_folder, filename)

        # Copy image
        shutil.copy2(image_path, destination_path)

print("Images copied successfully!")

# Verify the number of images in each dataset

for split_name in ["train", "validation", "test"]:

    split_path = os.path.join(OUTPUT_DIR, split_name)

    total_count = 0

    print("\n", split_name.upper(), "DATASET")

    for category in categories:

        category_path = os.path.join(split_path, category)

        image_count = len([
            file for file in os.listdir(category_path)
            if file.lower().endswith(('.png', '.jpg', '.jpeg'))
        ])

        total_count += image_count

        print(category, ":", image_count)

    print("Total images:", total_count)
    print("---------------------------")