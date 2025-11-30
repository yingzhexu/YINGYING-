import { GoogleGenAI } from "@google/genai";
import { Gender } from "../types";

// Helper to convert File to Base64
const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateFashionImage = async (
  file: File,
  gender: Gender,
  remarks: string,
  apiKey: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey });
  
  // Prepare the image input
  const imagePart = await fileToGenerativePart(file);

  // Construct the prompt based on the user's template
  const prompt = `
你是一位专业的时尚摄影师，擅长捕捉服装的质感与模特的自然状态。
请根据输入的服装图片，为一位【${gender}】模特拍摄一张极具氛围感和购买欲的电商生活照主图。

核心要求：
1. 主体：一位富有魅力的【${gender}】模特，自然地穿着输入的服装。
2. 服装还原：必须精准还原输入图片中衣服的颜色、材质纹理和版型细节。衣服穿在模特身上要显得合身且高级。
3. 场景与光影：创造一个与服装风格相匹配的、令人向往的生活场景（例如：阳光明媚的北欧风客厅、舒适的咖啡馆角落、或是自然度假风的户外）。光线必须采用柔和的电影级自然光（Golden Hour lighting），在模特和衣物上投射出温暖、高级的光影层次。
4. 姿态与情绪：模特姿态要放松、自然、自信，展现出穿着该服装时的舒适感和时尚态度，避免僵硬的摆拍。
5. 构图：采用编辑级（Editorial）构图，景深适当，焦点清晰地落在模特和服装上。
${remarks ? `6. 额外定制要求：${remarks} (请务必满足此要求)` : ''}

请直接生成一张高质量的摄影图像。
`;

  try {
    // Using gemini-3-pro-image-preview for high-quality image editing/generation
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          imagePart,
          { text: prompt }
        ]
      },
      config: {
        imageConfig: {
            aspectRatio: "3:4", // Standard fashion aspect ratio
            imageSize: "2K" // High quality for e-commerce
        }
      }
    });

    // Extract the image from the response
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
        for (const part of candidates[0].content.parts) {
            if (part.inlineData) {
                const base64EncodeString = part.inlineData.data;
                return `data:image/png;base64,${base64EncodeString}`;
            }
        }
    }
    
    throw new Error("No image generated.");

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to generate image.");
  }
};