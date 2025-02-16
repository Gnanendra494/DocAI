import os
import pandas as pd
from pptx import Presentation
from docx import Document
import textract
import shutil

# Function to convert CSV to text
def csv_to_txt(csv_file, output_dir):
    try:
        # Try reading the CSV file with various delimiters and quoting options
        for delimiter in [',', ';', '\t']:
            for quoting in [0, 1, 2, 3]:
                try:
                    df = pd.read_csv(csv_file, delimiter=delimiter, quoting=quoting, encoding='utf-16')
                    break  # Stop trying if successful
                except pd.errors.ParserError:
                    continue  # Try next delimiter and quoting option if parsing fails

        # Create output text file path
        txt_file_path = os.path.join(output_dir, os.path.splitext(os.path.basename(csv_file))[0] + ".txt")
        
        # Write CSV content to text file
        with open(txt_file_path, "w") as f:
            f.write(df.to_string(index=False))  # Write CSV content to text file
            
        print(f"Converted {csv_file} to {txt_file_path}")
    except Exception as e:
        print(f"Error converting {csv_file}:", e)

# Function to extract text from pptx and docx files
def extract_text(file_path):
    try:
        # Extract text using textract for pptx and docx files
        if file_path.lower().endswith('.pptx') or file_path.lower().endswith('.docx'):
            text = textract.process(file_path).decode("utf-8")
            return text
    except Exception as e:
        print(f"Error extracting text from {file_path}: {e}")
    return ""

# Main function to convert files in a directory
# Main function to convert files in a directory
def convert_files(input_dir, output_dir):
    # Create output directory if it doesn't exist
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Iterate through files in the directory
    for root, dirs, files in os.walk(input_dir):
        for file in files:
            file_path = os.path.join(root, file)
            if os.path.isfile(file_path):
                if file.lower().endswith('.csv'):
                    # Convert CSV to text
                    csv_to_txt(file_path, output_dir)
                elif file.lower().endswith('.pdf'):
                    # Check if PDF file already exists in the output directory
                    output_file_path = os.path.join(output_dir, file)
                    if not os.path.exists(output_file_path):
                        # Copy PDF file to output directory
                        shutil.copy(file_path, output_file_path)
                    else:
                        print(f"File '{file}' already exists in the output directory. Skipping...")
                else:
                    # Extract text from pptx and docx files
                    text = extract_text(file_path)
                    if text:
                        # Write the text to a .txt file with the same name
                        with open(os.path.join(output_dir, os.path.splitext(file)[0] + ".txt"), "w") as txt_file:
                            txt_file.write(text)
                            
    print("Conversion completed.")


# Example usage
if __name__ == "__main__":
    input_dir = "./data"  # Replace with your input directory path
    output_dir = "./data/converted"  # Output directory for converted files

    convert_files(input_dir, output_dir)