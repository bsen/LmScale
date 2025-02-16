import { Loader, MoveRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useAuthentication } from "@/providers/authentication-provider";
import Seo from "@/components/_shared/seo";

export default function RegisterPage() {
  const router = useRouter();
  const { registerUser, submitting } = useAuthentication();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleregister = async (e) => {
    if (e) e.preventDefault();

    if (!formData.email || !formData.password || !formData.name) {
      setError("Please fill in all fields");
      return;
    }
    if (formData.name.length < 3) {
      setError("Name must be at least 3 characters long");
      return;
    }
    if (formData.name.length > 24) {
      setError("Name cannot exceed 24 characters");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 8 characters long");
      return;
    }
    if (formData.password.length > 100) {
      setError("Password cannot exceed 100 characters");
      return;
    }
    try {
      await registerUser(formData.name, formData.email, formData.password);
    } catch (err) {
      setError(err.message || "Failed to create account");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const getInputClassName = (field) => {
    const baseClasses =
      "w-full pl-3 pr-3 py-1.5 border bg-white/50 backdrop-blur-sm transition-all duration-200 focus:outline-none";
    const isEmpty = !formData[field] && error;

    if (isEmpty) {
      return `${baseClasses} border-rose-400 focus:border-rose-500`;
    }
    return `${baseClasses} border-neutral-200 focus:border-neutral-400`;
  };

  return (
    <div className="relative min-h-screen bg-white">
      <Seo
        title="Register"
        description="Login to your LmScale account"
        path="/register"
      />
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:24px_24px] md:bg-[size:32px_32px]"
          style={{
            mask: "radial-gradient(circle at center, white 30%, transparent 70%)",
            WebkitMask:
              "radial-gradient(circle at center, white 30%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-md px-4">
        <div className="flex min-h-screen flex-col items-center justify-center py-16 md:py-24">
          <div className="w-full">
            <div className="mb-6 md:mb-8 inline-flex items-center justify-center w-full">
              <Link href="/" className="flex items-center gap-2">
                <img
                  src="/icon.png"
                  alt="LmScale Logo"
                  width={36}
                  height={36}
                  className="object-cover"
                />
                <span className="text-xl sm:text-4xl font-light text-neutral-800">
                  LmScale
                </span>
              </Link>
            </div>

            <div className="relative w-full p-4 shadow-md bg-white">
              <form
                onSubmit={handleregister}
                className="relative space-y-6 p-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-lg ">Create an Account</div>
                </div>

                {error && (
                  <div className="text-sm mb-4 bg-rose-50 p-3 border border-rose-200 text-rose-500">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-neutral-600" htmlFor="name">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className={getInputClassName("name")}
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-neutral-600" htmlFor="email">
                      Work Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className={getInputClassName("email")}
                        placeholder="name@company.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      className="text-sm text-neutral-600"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        id="password"
                        name="password"
                        className={getInputClassName("password")}
                        placeholder="8+ characters"
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="group w-full inline-flex items-center gap-2 justify-center bg-neutral-900 px-6 md:px-8 py-2.5 md:py-3 text-sm md:text-base  text-white transition-all duration-300 hover:bg-neutral-950 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
                >
                  {submitting ? (
                    <Loader className="animate-spin h-4 w-4" />
                  ) : (
                    <>
                      Create Account
                      <MoveRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                <div className="text-center text-sm text-neutral-600">
                  Already have an account?
                  <button
                    type="button"
                    onClick={() => router.push("/login")}
                    className="text-neutral-900 underline-offset-2 underline ml-1"
                  >
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
