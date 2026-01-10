from PIL import Image
import os

# Source image path (using the downloaded image path from search result 5)
source_path = "/home/ubuntu/upload/search_images/xVsIipxzxXie.webp"
output_dir = "/home/ubuntu/attendance-system/client/public"

# Ensure output directory exists
os.makedirs(output_dir, exist_ok=True)

try:
    img = Image.open(source_path)
    
    # Convert to RGBA if not already (though webp usually handles transparency well, good to be safe for PNG)
    img = img.convert("RGBA")

    # Resize and save 192x192
    img_192 = img.resize((192, 192), Image.Resampling.LANCZOS)
    img_192.save(os.path.join(output_dir, "pwa-192x192.png"), "PNG")
    print("Created pwa-192x192.png")

    # Resize and save 512x512
    img_512 = img.resize((512, 512), Image.Resampling.LANCZOS)
    img_512.save(os.path.join(output_dir, "pwa-512x512.png"), "PNG")
    print("Created pwa-512x512.png")

except Exception as e:
    print(f"Error generating icons: {e}")
