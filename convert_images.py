import os
from PIL import Image

def convert_to_webp():
    files_to_convert = []
    
    # Recursively find all PNG and JPG/JPEG files in assets/
    for root, _, files in os.walk("assets"):
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in [".png", ".jpg", ".jpeg"]:
                file_path = os.path.join(root, file)
                files_to_convert.append(file_path)
                
    print(f"Found {len(files_to_convert)} files to convert.")
    
    for file_path in files_to_convert:
        file_path = file_path.replace("\\", "/")
        webp_path = os.path.splitext(file_path)[0] + ".webp"
        
        try:
            img = Image.open(file_path)
            print(f"Converting {file_path} ({os.path.getsize(file_path)} bytes) to {webp_path}...")
            # Save WebP at 80% quality to retain original crispness and high-resolution details
            img.save(webp_path, "WEBP", quality=80)
            print(f"Done. New size: {os.path.getsize(webp_path)} bytes.")
        except Exception as e:
            print(f"Error converting {file_path}: {e}")

if __name__ == "__main__":
    convert_to_webp()

