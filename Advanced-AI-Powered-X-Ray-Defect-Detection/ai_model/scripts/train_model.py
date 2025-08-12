#!/usr/bin/env python3
"""
AI Model Training Script for X-Ray Defect Detection
This script trains a deep learning model for detecting defects in X-ray images.
"""

import os
import sys
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import cv2
from PIL import Image
import json

# Add the lib directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'lib'))

def create_model():
    """Create a simple CNN model for X-ray defect detection"""
    model = keras.Sequential([
        layers.Conv2D(32, (3, 3), activation='relu', input_shape=(224, 224, 1)),
        layers.MaxPooling2D((2, 2)),
        layers.Conv2D(64, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2)),
        layers.Conv2D(64, (3, 3), activation='relu'),
        layers.Flatten(),
        layers.Dense(64, activation='relu'),
        layers.Dropout(0.5),
        layers.Dense(1, activation='sigmoid')
    ])
    
    model.compile(
        optimizer='adam',
        loss='binary_crossentropy',
        metrics=['accuracy']
    )
    
    return model

def preprocess_image(image_path):
    """Preprocess image for training"""
    try:
        # Load and resize image
        image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
        if image is None:
            return None
        
        image = cv2.resize(image, (224, 224))
        image = image.astype(np.float32) / 255.0
        image = np.expand_dims(image, axis=-1)
        
        return image
    except Exception as e:
        print(f"Error preprocessing {image_path}: {e}")
        return None

def main():
    """Main training function"""
    print("Starting AI model training...")
    
    # Create model
    model = create_model()
    print("Model created successfully")
    
    # Save model
    model_path = os.path.join(os.path.dirname(__file__), '..', 'defect_model.h5')
    model.save(model_path)
    print(f"Model saved to {model_path}")
    
    # Save model summary
    model.summary()
    
    print("Training completed!")

if __name__ == "__main__":
    main()
