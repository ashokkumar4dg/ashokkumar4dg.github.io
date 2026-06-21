import os
from PIL import Image

def convert_to_webp():
    files_to_convert = [
        "assets/WhiteShirt_Transparent.png",
        "assets/WhiteTshirt_3D.png",
        "assets/BlackShirt.png",
        "assets/BlackTshirt_3D.png",
        "assets/project-brand.png",
        "assets/project-social.png",
        "assets/project-book.png",
        "assets/project-web.png",
        "assets/project-poster.png",
        "assets/project-invitation.png",
        "assets/Logo1.png",
        "assets/Logo2.png"
    ]
    
    for file_path in files_to_convert:
        if os.path.exists(file_path):
            img = Image.open(file_path)
            webp_path = os.path.splitext(file_path)[0] + ".webp"
            print(f"Converting {file_path} ({os.path.getsize(file_path)} bytes) to {webp_path}...")
            img.save(webp_path, "WEBP", quality=80)
            print(f"Done. New size: {os.path.getsize(webp_path)} bytes.")
        else:
            print(f"File not found: {file_path}")

if __name__ == "__main__":
    convert_to_webp()
