import fs from 'fs';
import path from 'path';

export const config = {
    api: { bodyParser: false },
};

export async function POST(req) {
    try {
        const data = await req.formData(); // Web API FormData
        const file = data.get('file');

        if (!file) {
            return new Response(JSON.stringify({ message: 'No file uploaded' }), { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadDir = path.join(process.cwd(), 'public/uploads');
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, file.name);
        fs.writeFileSync(filePath, buffer);

        const fileUrl = `/uploads/${file.name}`;
        return new Response(JSON.stringify({ message: 'Image uploaded successfully', url: fileUrl }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ message: 'Upload failed', error: err.message }), { status: 500 });
    }
}
