"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, FileText, CheckCircle, XCircle, Clock } from "lucide-react";

interface KYCDocument {
  id: number;
  docType: string;
  docUrl: string;
  status: string;
  createdAt: string;
}

export function KYCUploadForm() {
  const [documents, setDocuments] = useState<KYCDocument[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState("gst");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    setIsUploading(true);
    try {
      // In a real app, upload to cloud storage first
      const mockUrl = `https://storage.example.com/${selectedFile.name}`;

      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/verification-docs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          docType: selectedDocType,
          docUrl: mockUrl,
          ocrJson: null,
        }),
      });

      if (!response.ok) throw new Error("Failed to upload document");

      const data = await response.json();
      toast.success("Document uploaded successfully!");
      setDocuments(prev => [...prev, data.document]);
      setSelectedFile(null);
    } catch (error) {
      toast.error("Failed to upload document");
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      default:
        return "Pending Review";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">KYC Verification</h2>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="docType">Document Type</Label>
            <select
              id="docType"
              value={selectedDocType}
              onChange={(e) => setSelectedDocType(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-input bg-background mt-2"
            >
              <option value="gst">GST Certificate</option>
              <option value="pan">PAN Card</option>
              <option value="license">Trade License</option>
              <option value="aadhar">Aadhar Card</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <Label htmlFor="file">Upload Document</Label>
            <div className="mt-2">
              <Input
                id="file"
                type="file"
                onChange={handleFileSelect}
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Accepted formats: PDF, JPG, PNG (Max 5MB)
            </p>
          </div>

          <Button
            onClick={handleUpload}
            disabled={isUploading || !selectedFile}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? "Uploading..." : "Upload Document"}
          </Button>
        </div>
      </Card>

      {documents.length > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Uploaded Documents</h3>
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-semibold capitalize">{doc.docType}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(doc.status)}
                  <span className="text-sm font-medium">
                    {getStatusText(doc.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-6 bg-muted/50">
        <h3 className="font-semibold mb-3">Verification Requirements</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>All documents must be clear and readable</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>Documents will be reviewed within 24-48 hours</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>Upload at least GST/PAN for basic verification</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>Trade license required for enhanced trust badge</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}