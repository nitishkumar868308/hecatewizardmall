export async function uploadToCloudinary(files, folderName = 'default') {
    if (!files || files.length === 0) throw new Error('No files provided');

    const uploadedUrls = [];

    for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch(`/api/upload`, {
            method: 'POST',
            body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Upload failed');
        uploadedUrls.push(data.url);
    }

    return uploadedUrls; // returns array of Cloudinary URLs
}
