"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddProjectPage() {
  const { user } = useUser();
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    pricePerCredit: "",
    totalCredits: "",
    availableCredits: "",
    projectImages: [] as string[],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      
      // Validate each file
      for (const file of fileArray) {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
          setError(`Please select valid image files (JPEG, PNG, or WebP). File "${file.name}" is not supported.`);
          return;
        }
        
        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
          setError(`File "${file.name}" is too large. File size must be less than 5MB.`);
          return;
        }
      }
      
      // Limit to 5 images maximum
      if (fileArray.length > 5) {
        setError("Maximum 5 images allowed per project");
        return;
      }
      
      setSelectedFiles(fileArray);
      setError("");
      
      // Create previews for all files
      const previewPromises = fileArray.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });
      
      Promise.all(previewPromises).then(previews => {
        setImagePreviews(previews);
      });
    }
  };

  const addImageUrl = () => {
    setImageUrls([...imageUrls, ""]);
  };

  const removeImageUrl = (index: number) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls);
  };

  const updateImageUrl = (index: number, url: string) => {
    const newUrls = [...imageUrls];
    newUrls[index] = url;
    setImageUrls(newUrls);
  };

  const removeSelectedFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    setIsUploading(true);
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add all files to FormData
      files.forEach((file, index) => {
        formData.append(`file-${index}`, file);
      });

      // Upload to our Pinata API endpoint
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      return data.urls;
    } catch (error) {
      console.error('Image upload error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to upload images. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      // Validate numeric fields
      const pricePerCredit = parseFloat(form.pricePerCredit);
      const totalCredits = parseInt(form.totalCredits);
      const availableCredits = parseInt(form.availableCredits);

      if (isNaN(pricePerCredit) || pricePerCredit <= 0) {
        setError("Please enter a valid price per credit (greater than 0)");
        return;
      }

      if (isNaN(totalCredits) || totalCredits <= 0) {
        setError("Please enter a valid total credits amount (greater than 0)");
        return;
      }

      if (isNaN(availableCredits) || availableCredits < 0) {
        setError("Please enter a valid available credits amount (0 or greater)");
        return;
      }

      if (availableCredits > totalCredits) {
        setError("Available credits cannot be greater than total credits");
        return;
      }

      // Check if images are provided (either file uploads or URLs)
      const validImageUrls = imageUrls.filter(url => url.trim() !== '');
      if (selectedFiles.length === 0 && validImageUrls.length === 0) {
        setError("Please provide at least one project image (either upload files or enter URLs)");
        return;
      }

      let allImageUrls: string[] = [];
      
      // Upload files if any are selected
      if (selectedFiles.length > 0) {
        try {
          const uploadedUrls = await uploadImages(selectedFiles);
          allImageUrls.push(...uploadedUrls);
        } catch (uploadError: any) {
          setError(uploadError.message || "Failed to upload images");
          return;
        }
      }

      // Add valid URLs
      allImageUrls.push(...validImageUrls);

      const projectData = {
        ...form,
        pricePerCredit,
        totalCredits,
        availableCredits,
        projectImages: allImageUrls,
      };

      const res = await fetch("/api/addProject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess("Project added successfully!");
        // Reset form
        setForm({
          title: "",
          description: "",
          location: "",
          pricePerCredit: "",
          totalCredits: "",
          availableCredits: "",
          projectImages: [],
        });
        setSelectedFiles([]);
        setImagePreviews([]);
        setImageUrls([]);
        
        // Redirect to projects list after 2 seconds
        setTimeout(() => {
          router.push("/projects");
        }, 2000);
      } else {
        setError(data.error || "Failed to add project");
      }
    } catch (error) {
      console.error("Error adding project:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Please sign in to add a project</h1>
          <Link 
            href="/sign-in" 
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Add Carbon Credit Project</h1>
            <p className="text-gray-600">Create a new project to generate and sell carbon credits</p>
          </div>

          {/* Navigation */}
          <div className="mb-6">
            <Link 
              href="/" 
              className="text-green-600 hover:text-green-700 font-medium flex items-center"
            >
              ← Back to Dashboard
            </Link>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Success/Error Messages */}
            {success && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                {success}
              </div>
            )}
            
            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Title *
                </label>
                <input 
                  type="text"
                  name="title" 
                  placeholder="e.g., Amazon Rainforest Reforestation" 
                  value={form.title} 
                  onChange={handleChange} 
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors placeholder-gray-500 text-gray-800" 
                  required 
                />
              </div>

              {/* Project Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description *
                </label>
                <textarea 
                  name="description" 
                  placeholder="Describe the project, its environmental impact, and carbon reduction methods..." 
                  value={form.description} 
                  onChange={handleChange} 
                  rows={4}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors placeholder-gray-500 text-gray-800 resize-vertical" 
                  required 
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Location *
                </label>
                <input 
                  type="text"
                  name="location" 
                  placeholder="e.g., Amazon Basin, Brazil" 
                  value={form.location} 
                  onChange={handleChange} 
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors placeholder-gray-500 text-gray-800" 
                  required 
                />
              </div>

              {/* Price and Credits Section */}
              <div className="grid md:grid-cols-3 gap-4">
                {/* Price per Credit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price per Credit (USD) *
                  </label>
                  <input 
                    type="number"
                    step="0.01"
                    min="0.01"
                    name="pricePerCredit" 
                    placeholder="25.00" 
                    value={form.pricePerCredit} 
                    onChange={handleChange} 
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors placeholder-gray-500 text-gray-800" 
                    required 
                  />
                </div>

                {/* Total Credits */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Credits *
                  </label>
                  <input 
                    type="number"
                    min="1"
                    name="totalCredits" 
                    placeholder="1000" 
                    value={form.totalCredits} 
                    onChange={handleChange} 
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors placeholder-gray-500 text-gray-800" 
                    required 
                  />
                </div>

                {/* Available Credits */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Credits *
                  </label>
                  <input 
                    type="number"
                    min="0"
                    name="availableCredits" 
                    placeholder="1000" 
                    value={form.availableCredits} 
                    onChange={handleChange} 
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors placeholder-gray-500 text-gray-800" 
                    required 
                  />
                </div>
              </div>

              {/* Project Images Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Images *
                </label>
                
                {/* File Upload */}
                <div className="mb-4">
                  <input 
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload image files (JPEG, PNG, WebP) to Pinata IPFS - Max 5 images, 5MB each
                  </p>
                </div>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Uploaded Images:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={preview} 
                            alt={`Project preview ${index + 1}`} 
                            className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeSelectedFile(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* OR divider */}
                <div className="flex items-center my-4">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="px-3 text-gray-500 text-sm">OR</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {/* URL Inputs as alternative */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URLs (Alternative)
                  </label>
                  
                  {imageUrls.map((url, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input 
                        type="url"
                        placeholder={`Image URL ${index + 1}`}
                        value={url}
                        onChange={(e) => updateImageUrl(index, e.target.value)}
                        className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors placeholder-gray-500 text-gray-800"
                        disabled={selectedFiles.length > 0}
                      />
                      <button
                        type="button"
                        onClick={() => removeImageUrl(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                        disabled={selectedFiles.length > 0}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addImageUrl}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                    disabled={selectedFiles.length > 0 || imageUrls.length >= 5}
                  >
                    Add Image URL
                  </button>
                  
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedFiles.length > 0 
                      ? "File uploads take priority over URLs" 
                      : `Add up to 5 image URLs. ${imageUrls.length}/5 added.`}
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isSubmitting || isUploading}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? "Uploading to Pinata IPFS..." : isSubmitting ? "Adding Project..." : "Add Project"}
                </button>
              </div>
            </form>

            {/* Info Section */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">💡 Project Guidelines</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Ensure your project has verified carbon reduction impact</li>
                <li>• Available credits should not exceed total credits</li>
                <li>• Price per credit should reflect the market value and project quality</li>
                <li>• Provide clear, detailed descriptions for better investor confidence</li>
                <li>• Upload multiple high-quality images that showcase different aspects of your project</li>
                <li>• Maximum 5 images per project - choose images that best represent your project</li>
                <li>• Images are stored securely on IPFS via Pinata for decentralized access</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
