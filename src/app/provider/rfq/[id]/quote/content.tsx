"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Package } from "lucide-react";

interface RFQ {
  id: number;
  catalogId: number | null;
  consumerId: number;
  quantity: number;
  unit: string;
  message: string | null;
  preferredDate: string | null;
  status: string;
  createdAt: string;
}

export default function ProviderQuoteSubmissionContent() {
  const params = useParams();
  const router = useRouter();
  const rfqId = params.id as string;

  const [rfq, setRfq] = useState<RFQ | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    price: "",
    currency: "INR",
    deliveryEtaDays: "",
    notes: "",
  });

  useEffect(() => {
    fetchRFQDetails();
  }, [rfqId]);

  const fetchRFQDetails = async () => {
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/rfq-requests/${rfqId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) throw new Error("Failed to fetch RFQ");
      const data = await response.json();
      setRfq(data.rfqRequest);
    } catch (error) {
      toast.error("Failed to load RFQ details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/rfq-requests/${rfqId}/quotes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          price: parseFloat(formData.price),
          currency: formData.currency,
          deliveryEtaDays: formData.deliveryEtaDays ? parseInt(formData.deliveryEtaDays) : null,
          notes: formData.notes || null,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit quote");
      
      toast.success("Quote submitted successfully!");
      router.push("/provider/dashboard");
    } catch (error) {
      toast.error("Failed to submit quote");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!rfq) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">RFQ Not Found</h2>
          <Button onClick={() => router.push("/provider/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-3xl mx-auto px-4">
        <Button
          variant="ghost"
          onClick={() => router.push("/provider/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="p-6 mb-6">
          <h1 className="text-3xl font-bold mb-6">Submit Quote</h1>
          
          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3 mb-3">
              <Package className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Customer Request</p>
                <p className="font-semibold">{rfq.quantity} {rfq.unit}</p>
              </div>
            </div>
            
            {rfq.preferredDate && (
              <div className="mb-3">
                <p className="text-sm text-muted-foreground">Preferred Delivery</p>
                <p className="font-semibold">
                  {new Date(rfq.preferredDate).toLocaleDateString()}
                </p>
              </div>
            )}

            {rfq.message && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Message</p>
                <p className="text-sm">{rfq.message}</p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="Enter price"
                  required
                />
              </div>

              <div>
                <Label htmlFor="currency">Currency</Label>
                <select
                  id="currency"
                  value={formData.currency}
                  onChange={(e) =>
                    setFormData({ ...formData, currency: e.target.value })
                  }
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="deliveryEtaDays">Delivery Time (Days)</Label>
              <Input
                id="deliveryEtaDays"
                type="number"
                min="1"
                value={formData.deliveryEtaDays}
                onChange={(e) =>
                  setFormData({ ...formData, deliveryEtaDays: e.target.value })
                }
                placeholder="Estimated delivery time in days"
              />
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Include any terms, conditions, or special instructions..."
                rows={4}
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "Submitting..." : "Submit Quote"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/provider/dashboard")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
