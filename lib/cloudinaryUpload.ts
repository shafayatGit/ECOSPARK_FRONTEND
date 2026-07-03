export async function uploadFilesToCloudinary(
  files: File[],
): Promise<string[]> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const unsignedPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !unsignedPreset) {
    throw new Error("Cloudinary not configured (NEXT_PUBLIC_CLOUDINARY_*)");
  }

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

  const uploadedUrls: string[] = [];

  for (const file of files) {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", unsignedPreset);

    const res = await fetch(uploadUrl, {
      method: "POST",
      body: fd,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Cloudinary upload failed: ${res.status} ${text}`);
    }

    const json = await res.json();
    if (!json || !json.secure_url) {
      throw new Error("Cloudinary returned no secure_url");
    }

    uploadedUrls.push(json.secure_url as string);
  }

  return uploadedUrls;
}
