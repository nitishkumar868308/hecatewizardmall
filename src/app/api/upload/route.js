import { v2 as cloudinary } from 'cloudinary';

export const config = {
    api: { bodyParser: false },
};

// Cloudinary config
cloudinary.config({
    cloud_name: 'dvm4h2d2h',
    api_key: '395968122253792',
    api_secret: 'GHYbpPIPjc8KNi9LtGvhhTaR-5o',
});

export async function POST(req) {
    try {
        const url = new URL(req.url);
        const paths = url.pathname.split('/').filter(Boolean);
        const folderName = paths[2] || 'default'; // folder name API route se

        const data = await req.formData();
        const file = data.get('file');

        if (!file) {
            return new Response(JSON.stringify({ message: 'No file uploaded' }), { status: 400 });
        }

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Cloudinary
        const uploadResult = await cloudinary.uploader.upload_stream(
            {
                folder: folderName,
                resource_type: 'auto', // image, video, etc.
            },
            (error, result) => {
                if (error) throw error;
                return result;
            }
        );
        const uniqueFilename = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        // Using a promise wrapper for stream
        const streamUpload = (buffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: folderName, resource_type: 'auto', public_id: uniqueFilename, },
                    (error, result) => {
                        if (result) resolve(result);
                        else reject(error);
                    }
                );
                stream.end(buffer);
            });
        };

        const result = await streamUpload(buffer);

        return new Response(JSON.stringify({ message: 'File uploaded successfully', url: result.secure_url }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ message: 'Upload failed', error: err.message }), { status: 500 });
    }
}
