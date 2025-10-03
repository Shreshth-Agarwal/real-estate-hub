"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Upload, FileCheck, Clock, XCircle } from "lucide-react";
import Link from "next/link";

export default function KYCPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [docType, setDocType] = useState("gst");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/sign-in?redirect=/provider/kyc");
    }
  }, [session, isPending, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    setLoading(true);

    try {
      // In a real app, you'd upload to S3/Cloudinary first
      // For now, we'll simulate the upload
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("KYC document uploaded successfully! It will be reviewed within 24 hours.");
      setFile(null);
      setDocType("gst");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload document");
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session?.user) return null;

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <Link href="/provider/dashboard" className="inline-flex items-center text-sm hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>KYC & Verification</CardTitle>
            <CardDescription>
              Upload your business documents to get verified and build trust with buyers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-medium text-sm mb-2">Why verify?</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Build trust with potential buyers</li>
                  <li>• Get a verified badge on your profile</li>
                  <li>• Increase your trust score</li>
                  <li>• Access premium features</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Upload Document</CardTitle>
            <CardDescription>Accepted: GST Certificate, PAN Card, Trade License</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="docType">Document Type *</Label>
                <Select value={docType} onValueChange={setDocType}>
                  <SelectTrigger id="docType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gst">GST Certificate</SelectItem>
                    <SelectItem value="pan">PAN Card</SelectItem>
                    <SelectItem value="license">Trade License</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Upload Document *</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Accepted formats: PDF, JPG, PNG (Max 5MB)
                </p>
              </div>

              {file && (
                <div className="p-3 bg-muted rounded-lg flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-green-600" />
                  <span className="text-sm">{file.name}</span>
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Upload className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Document
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Document Status</CardTitle>
            <CardDescription>Track your verification status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p className="text-sm">No documents uploaded yet</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}