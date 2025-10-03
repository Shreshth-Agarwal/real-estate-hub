import SignInForm from "@/components/auth/SignInForm";

export const metadata = {
  title: "Sign In - Hub4Estate",
  description: "Sign in to your Hub4Estate account",
};

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-muted/20 to-background">
      <SignInForm />
    </div>
  );
}