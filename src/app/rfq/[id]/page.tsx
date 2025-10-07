"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Package, Calendar, User, FileText } from "lucide-react";

interface RFQ {
  id: number;
  catalogId: number | null;
  consumerId: number;
  providerId: number | null;
  quantity: number;
  unit: string;
  message: string | null;
  preferredDate: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Quote {
  id: number;
  rfqId: number;
  providerId: number;
  price: number;
  currency: string;
  deliveryEtaDays: number | null;
  notes: string | null;
  status: string;
  createdAt: string;
  providerName?: string;
}

export default function RFQDetailPage() {
  const params = useParams();
  const router = useRouter();
  const rfqId = params.id as string;

  const [rfq, setRfq] = useState<RFQ | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRFQDetails();
  }, [rfqId]);

  const fetchRFQDetails = async () => {
    try {
      const token = localStorage.getItem("bearer_token");
      const rfqResponse = await fetch(`/api/rfq-requests/${rfqId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!rfqResponse.ok) throw new Error("Failed to fetch RFQ");
      const rfqData = await rfqResponse.json();
      setRfq(rfqData.rfqRequest);

      // Fetch quotes for this RFQ
      const quotesResponse = await fetch(`/api/rfq-requests/${rfqId}/quotes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (quotesResponse.ok) {
        const quotesData = await quotesResponse.json();
        setQuotes(quotesData.quotes || []);
      }
    } catch (error) {
      toast.error("Failed to load RFQ details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptQuote = async (quoteId: number) => {
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/quotes/${quoteId}/accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to accept quote");
      
      toast.success("Quote accepted successfully!");
      fetchRFQDetails();
    } catch (error) {
      toast.error("Failed to accept quote");
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
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card className="p-6 mb-6">
          <h1 className="text-3xl font-bold mb-6">RFQ Details</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Package className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Quantity</p>
                <p className="font-semibold">{rfq.quantity} {rfq.unit}</p>
              </div>
            </div>

            {rfq.preferredDate && (
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Preferred Date</p>
                  <p className="font-semibold">
                    {new Date(rfq.preferredDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-semibold capitalize">{rfq.status}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-semibold">
                  {new Date(rfq.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {rfq.message && (
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground mb-2">Message</p>
              <p>{rfq.message}</p>
            </div>
          )}
        </Card>

        <div>
          <h2 className="text-2xl font-bold mb-4">
            Quotes Received ({quotes.length})
          </h2>

          {quotes.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                No quotes received yet. Providers will respond soon.
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {quotes.map((quote) => (
                <Card key={quote.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {quote.providerName || `Provider #${quote.providerId}`}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(quote.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        {quote.currency} {quote.price.toLocaleString()}
                      </p>
                      {quote.deliveryEtaDays && (
                        <p className="text-sm text-muted-foreground">
                          Delivery in {quote.deliveryEtaDays} days
                        </p>
                      )}
                    </div>
                  </div>

                  {quote.notes && (
                    <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm">{quote.notes}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAcceptQuote(quote.id)}
                      disabled={quote.status === "accepted"}
                      className="flex-1"
                    >
                      {quote.status === "accepted" ? "Accepted" : "Accept Quote"}
                    </Button>
                    {quote.status === "pending" && (
                      <Button variant="outline" className="flex-1">
                        Negotiate
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}