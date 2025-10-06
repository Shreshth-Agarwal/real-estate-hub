export default function BusinessHomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-5xl font-heading font-bold text-foreground">
          Hub4Estate Business
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Welcome to the business platform. Manage your catalogs, respond to RFQs,
          and grow your real estate business.
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <div className="px-6 py-3 bg-primary text-primary-foreground rounded-lg">
            Manage Catalogs
          </div>
          <div className="px-6 py-3 border border-border rounded-lg">
            View RFQ Inbox
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-12">
          Running on: <strong>business.hub4estate.com</strong> (Port 3002 in dev)
        </p>
      </div>
    </div>
  );
}