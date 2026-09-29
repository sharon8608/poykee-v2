import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function login(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/poykee-admin/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/poykee-admin");
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-100 p-6">
      <div className="w-full max-w-md bg-white p-10 shadow-sm">
        <h1 className="text-3xl font-light">Poykee</h1>
        <p className="mb-8 mt-2 text-neutral-500">Administration</p>

        {error && (
          <p className="mb-5 bg-red-50 p-3 text-sm text-red-700">
            {decodeURIComponent(error)}
          </p>
        )}

        <form action={login} className="space-y-5">
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            className="w-full border p-3"
          />

          <input
            name="password"
            type="password"
            required
            placeholder="Password"
            className="w-full border p-3"
          />

          <button
            type="submit"
            className="w-full bg-black px-6 py-3 text-white"
          >
            Log in
          </button>
        </form>
      </div>
    </main>
  );
}
