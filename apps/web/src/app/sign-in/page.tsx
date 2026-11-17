import { SignInForm } from "@/features/auth/components/SignInForm";

export const metadata = { title: "Sign in · PayRole" };

export default function SignInPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-8">
      <h1 className="mb-1 text-2xl font-semibold leading-8">Sign in to PayRole</h1>
      <p className="mb-6 text-muted">Casa Verde Trading Corp.</p>
      <SignInForm />
    </main>
  );
}
