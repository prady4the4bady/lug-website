
'use client';

export const compressImage = (file: File, maxWidth: number = 1080, quality: number = 0.7): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const scaleRatio = maxWidth / img.width;
                const width = img.width > maxWidth ? maxWidth : img.width;
                const height = img.width > maxWidth ? img.height * scaleRatio : img.height;

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    return reject(new Error('Could not get canvas context'));
                }
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL(file.type, quality));
            };
            img.onerror = (error) => reject(error);
        };
        reader.onerror = (error) => reject(error);
    });
};
