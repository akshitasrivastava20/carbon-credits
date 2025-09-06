import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const files: File[] = [];
    
    // Extract all files from FormData
    for (const [key, value] of data.entries()) {
      if (value instanceof File) {
        files.push(value);
      }
    }

    if (files.length === 0) {
      return NextResponse.json(
        { success: false, error: "No files provided" },
        { status: 400 }
      );
    }

    // Validate files
    for (const file of files) {
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { 
            success: false, 
            error: `File "${file.name}" has unsupported type. Only JPEG, PNG, and WebP are allowed.` 
          },
          { status: 400 }
        );
      }

      // Check file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        return NextResponse.json(
          { 
            success: false, 
            error: `File "${file.name}" is too large. Maximum size is 5MB.` 
          },
          { status: 400 }
        );
      }
    }

    // Upload files to Pinata using direct API calls
    const uploadPromises = files.map(async (file) => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        // Add metadata
        const metadata = JSON.stringify({
          name: file.name,
          keyvalues: {
            project: 'carbon-credits',
            type: 'project-image',
            uploadedAt: new Date().toISOString(),
          }
        });
        formData.append('pinataMetadata', metadata);

        const pinataOptions = JSON.stringify({
          cidVersion: 0,
        });
        formData.append('pinataOptions', pinataOptions);

        const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
          method: 'POST',
          headers: {
            'pinata_api_key': process.env.PINATA_API_KEY!,
            'pinata_secret_api_key': process.env.PINATA_API_SECRET!,
          },
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Pinata API error for ${file.name}:`, errorText);
          throw new Error(`Failed to upload ${file.name} to Pinata`);
        }

        const result = await response.json();
        
        // Use custom gateway URL if available, otherwise use default
        const gatewayUrl = process.env.NEXT_PUBLIC_GATEWAY_URL || 'https://gateway.pinata.cloud';
        return `${gatewayUrl}/ipfs/${result.IpfsHash}`;
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        throw new Error(`Failed to upload ${file.name}`);
      }
    });

    const uploadedUrls = await Promise.all(uploadPromises);

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
      message: `Successfully uploaded ${files.length} file(s) to Pinata IPFS`,
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to upload files to Pinata" 
      },
      { status: 500 }
    );
  }
}
