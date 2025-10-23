import { Platform } from "react-native";

export class ImageStorage {
  // Convert image to base64 for permanent storage on web
  static async uriToBase64(uri: string): Promise<string> {
    if (uri.startsWith("data:")) {
      return uri;
    }
    if (Platform.OS === "web" && uri.startsWith("blob:")) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            // NEW: Clear canvas with transparent background
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            try {
              const base64 = canvas.toDataURL("image/png");
              resolve(base64);
            } catch (error) {
              reject(error);
            }
          } else {
            reject(new Error("Could not get canvas context"));
          }
        };
        img.onerror = reject;
        img.src = uri;
      });
    }
    return uri;
  }

  // Check if we need to convert the URI for web
  static async prepareImageForStorage(uri: string): Promise<string> {
    if (Platform.OS === "web" && uri.startsWith("blob:")) {
      console.log("🌐 Converting blob URL to base64 for web storage...");
      return await this.uriToBase64(uri);
    }
    return uri;
  }

  // Get image dimensions (useful for display)
  static getImageSize(uri: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = reject;
      img.src = uri;
    });
  }
}
