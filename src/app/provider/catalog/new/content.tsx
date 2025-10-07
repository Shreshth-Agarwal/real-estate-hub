"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Upload, X, FileText, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface CatalogItem {
  name: string;
  price: string;
  unit: string;
  stock: string;
}

export default function NewCatalogContent() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    subCategory: "",
    isPublic: true,
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [items, setItems] = useState<CatalogItem[]>([
    { name: "", price: "", unit: "piece", stock: "" }
  ]);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/sign-in?redirect=/provider/catalog/new");
    }
  }, [session, isPending, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (images.length + files.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }

    const validFiles = files.filter(file => {
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
        toast.error(`${file.name} is not a valid image format`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB limit`);
        return false;
      }
      return true;
    });

    setImages([...images, ...validFiles]);
    
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error("Only PDF files are allowed");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("PDF file must be less than 10MB");
      return;
    }

    setPdfFile(file);
  };

  const addItem = () => {
    setItems([...items, { name: "", price: "", unit: "piece", stock: "" }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof CatalogItem, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!formData.category) {
      toast.error("Category is required");
      return;
    }

    setLoading(true);
    setUploadProgress(10);

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      submitData.append('subCategory', formData.subCategory);
      submitData.append('isPublic', formData.isPublic.toString());
      
      const validItems = items.filter(item => item.name.trim() !== '');
      submitData.append('items', JSON.stringify(validItems));

      setUploadProgress(30);

      images.forEach(image => {
        submitData.append('images', image);
      });

      setUploadProgress(60);

      if (pdfFile) {
        submitData.append('pdf', pdfFile);
      }

      setUploadProgress(80);

      const response = await fetch('/api/catalogs/create', {
        method: 'POST',
        body: submitData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create catalog');
      }

      setUploadProgress(100);
      toast.success("Catalog created successfully!");
      
      setTimeout(() => {
        router.push('/provider/dashboard');
      }, 1000);

    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to create catalog');
    } finally {
      setLoading(false);
      setTimeout(() => setUploadProgress(0), 2000);
    }
  };

  if (isPending) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          border: '3px solid #e5e7eb', 
          borderTopColor: '#4F46E5',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  if (!session?.user) return null;

  const royalTheme = {
    primary: '#4F46E5',
    secondary: '#7C3AED',
    gold: '#F59E0B',
    background: '#F9FAFB',
    white: '#FFFFFF',
    text: '#1F2937',
    textLight: '#6B7280',
    border: '#E5E7EB',
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: royalTheme.background }}>
      <header style={{ borderBottom: `1px solid ${royalTheme.border}`, backgroundColor: royalTheme.white }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px' }}>
          <Link href="/provider/dashboard" style={{ display: 'inline-flex', alignItems: 'center', fontSize: '14px', color: royalTheme.primary, textDecoration: 'none' }}>
            <ArrowLeft style={{ marginRight: '8px', width: '16px', height: '16px' }} />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 16px' }}>
        <div style={{ backgroundColor: royalTheme.white, borderRadius: '12px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: royalTheme.text, marginBottom: '8px' }}>
            Create New Catalog
          </h1>
          <p style={{ color: royalTheme.textLight, marginBottom: '32px' }}>
            Upload your product catalog with images and detailed information
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: royalTheme.text, marginBottom: '8px' }}>
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Premium Building Materials Collection"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: `1px solid ${royalTheme.border}`,
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: royalTheme.text, marginBottom: '8px' }}>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your catalog..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: `1px solid ${royalTheme.border}`,
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                  resize: 'vertical',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: royalTheme.text, marginBottom: '8px' }}>
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: `1px solid ${royalTheme.border}`,
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: royalTheme.white,
                  }}
                >
                  <option value="">Select Category</option>
                  <option value="Materials">Materials</option>
                  <option value="Services">Services</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Labor">Labor</option>
                  <option value="Design">Design</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: royalTheme.text, marginBottom: '8px' }}>
                  Sub-category
                </label>
                <input
                  type="text"
                  value={formData.subCategory}
                  onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                  placeholder="e.g., Tiles, Cement, Steel"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: `1px solid ${royalTheme.border}`,
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: royalTheme.text, marginBottom: '8px' }}>
                Images (Max 10, JPG/PNG/WebP, Max 5MB each)
              </label>
              <div style={{
                border: `2px dashed ${royalTheme.border}`,
                borderRadius: '8px',
                padding: '24px',
                textAlign: 'center',
                cursor: 'pointer',
                position: 'relative',
              }}>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  multiple
                  onChange={handleImageChange}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer',
                  }}
                  disabled={images.length >= 10}
                />
                <Upload style={{ width: '40px', height: '40px', margin: '0 auto 12px', color: royalTheme.primary }} />
                <p style={{ color: royalTheme.text, fontWeight: '500', marginBottom: '4px' }}>
                  Click to upload or drag and drop
                </p>
                <p style={{ color: royalTheme.textLight, fontSize: '14px' }}>
                  {images.length}/10 images uploaded
                </p>
              </div>

              {imagePreviews.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px', marginTop: '16px' }}>
                  {imagePreviews.map((preview, index) => (
                    <div key={index} style={{ position: 'relative', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', border: `1px solid ${royalTheme.border}` }}>
                      <Image src={preview} alt={`Preview ${index + 1}`} fill style={{ objectFit: 'cover' }} />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        style={{
                          position: 'absolute',
                          top: '4px',
                          right: '4px',
                          backgroundColor: 'rgba(0,0,0,0.6)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <X style={{ width: '16px', height: '16px' }} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: royalTheme.text, marginBottom: '8px' }}>
                PDF Catalog (Optional, Max 10MB)
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  backgroundColor: royalTheme.white,
                  border: `1px solid ${royalTheme.border}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: royalTheme.text,
                }}>
                  <FileText style={{ width: '18px', height: '18px' }} />
                  {pdfFile ? pdfFile.name : 'Choose PDF'}
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handlePdfChange}
                    style={{ display: 'none' }}
                  />
                </label>
                {pdfFile && (
                  <button
                    type="button"
                    onClick={() => setPdfFile(null)}
                    style={{
                      padding: '10px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: royalTheme.textLight,
                      cursor: 'pointer',
                    }}
                  >
                    <X style={{ width: '18px', height: '18px' }} />
                  </button>
                )}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: royalTheme.text }}>
                  Items (Optional)
                </label>
                <button
                  type="button"
                  onClick={addItem}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 12px',
                    backgroundColor: royalTheme.primary,
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  <Plus style={{ width: '16px', height: '16px' }} />
                  Add Item
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {items.map((item, index) => (
                  <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '8px', padding: '12px', backgroundColor: royalTheme.background, borderRadius: '6px' }}>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(index, 'name', e.target.value)}
                      placeholder="Item name"
                      style={{
                        padding: '8px 12px',
                        border: `1px solid ${royalTheme.border}`,
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: royalTheme.white,
                      }}
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => updateItem(index, 'price', e.target.value)}
                      placeholder="Price"
                      style={{
                        padding: '8px 12px',
                        border: `1px solid ${royalTheme.border}`,
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: royalTheme.white,
                      }}
                    />
                    <select
                      value={item.unit}
                      onChange={(e) => updateItem(index, 'unit', e.target.value)}
                      style={{
                        padding: '8px 12px',
                        border: `1px solid ${royalTheme.border}`,
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: royalTheme.white,
                      }}
                    >
                      <option value="piece">Piece</option>
                      <option value="box">Box</option>
                      <option value="sqft">Sq. Ft.</option>
                      <option value="sqm">Sq. M.</option>
                      <option value="kg">Kg</option>
                      <option value="ton">Ton</option>
                      <option value="bag">Bag</option>
                    </select>
                    <input
                      type="number"
                      value={item.stock}
                      onChange={(e) => updateItem(index, 'stock', e.target.value)}
                      placeholder="Stock"
                      style={{
                        padding: '8px 12px',
                        border: `1px solid ${royalTheme.border}`,
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: royalTheme.white,
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      disabled={items.length === 1}
                      style={{
                        padding: '8px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: items.length === 1 ? royalTheme.border : royalTheme.textLight,
                        cursor: items.length === 1 ? 'not-allowed' : 'pointer',
                      }}
                    >
                      <Trash2 style={{ width: '18px', height: '18px' }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                color: royalTheme.text,
              }}>
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  style={{
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer',
                  }}
                />
                Make this catalog public
              </label>
            </div>

            {uploadProgress > 0 && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', color: royalTheme.textLight }}>Uploading...</span>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: royalTheme.primary }}>{uploadProgress}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: royalTheme.border, borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${uploadProgress}%`,
                    height: '100%',
                    backgroundColor: royalTheme.primary,
                    transition: 'width 0.3s ease',
                  }}></div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  backgroundColor: loading ? royalTheme.border : royalTheme.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Creating...' : 'Create Catalog'}
              </button>
              <Link href="/provider/dashboard" style={{ flex: 1 }}>
                <button
                  type="button"
                  style={{
                    width: '100%',
                    padding: '12px 24px',
                    backgroundColor: 'transparent',
                    color: royalTheme.text,
                    border: `1px solid ${royalTheme.border}`,
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
