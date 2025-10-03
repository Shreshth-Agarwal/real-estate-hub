import SignUpForm from "@/components/auth/SignUpForm";

export const metadata = {
  title: "Sign Up - Hub4Estate",
  description: "Create your Hub4Estate account",
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-muted/20 to-background">
      <SignUpForm />
    </div>
  );
}