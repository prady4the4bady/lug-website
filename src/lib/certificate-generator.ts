
interface CertificateData {
    name: string;
    event: string;
    date: string;
}

export function generateCertificate(data: CertificateData): Promise<void> {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        canvas.width = 1200;
        canvas.height = 800;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            return reject(new Error('Could not get canvas context'));
        }

        const template = new Image();
        template.crossOrigin = 'anonymous'; 
        // NOTE: Replace this placeholder with your actual certificate template image in /public/images/
        template.src = '/images/certificate-template.png'; 

        template.onload = () => {
            // Draw background template
            ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

            // Set text styles
            ctx.textAlign = 'center';
            ctx.fillStyle = '#333333'; // A dark color for text

            // Draw participant's name
            ctx.font = 'bold 60px "Times New Roman"';
            ctx.fillText(data.name, canvas.width / 2, 450);

            // Draw event name
            ctx.font = '40px "Times New Roman"';
            ctx.fillText(data.event, canvas.width / 2, 550);
            
            // Draw date
            ctx.font = 'italic 30px "Times New Roman"';
            ctx.fillText(`on ${data.date}`, canvas.width / 2, 600);

            // Trigger download
            const link = document.createElement('a');
            link.download = `LUG_Certificate_${data.event.replace(/ /g, '_')}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            resolve();
        };
        
        template.onerror = () => {
            reject(new Error('Failed to load certificate template image.'));
        };
    });
}
