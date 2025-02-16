import { Menu, MoveRight, Terminal, X } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);
      setIsVisible(
        currentScrollY <= lastScrollY ||
          currentScrollY < 50 ||
          currentScrollY + window.innerHeight >=
            document.documentElement.scrollHeight
      );
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "LmScale",
    description:
      "Deploy and scale language models with zero infrastructure headaches. Simple, fast, and secure cloud deployment.",
    applicationCategory: "AI Software",
    operatingSystem: "Cloud",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1000",
    },
  };

  return (
    <>
      <Head>
        <title>LmScale - Deploy and Scale Language Models in the Cloud</title>
        <meta
          name="description"
          content="Deploy and scale language models with zero infrastructure headaches. Simple, fast, and secure cloud deployment platform for enterprise AI applications."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta
          property="og:title"
          content="LmScale - Deploy and Scale Language Models in the Cloud"
        />
        <meta
          property="og:description"
          content="Deploy and scale language models with zero infrastructure headaches. Simple, fast, and secure cloud deployment."
        />
        <meta property="og:image" content="https://lmscale.com/og-image.jpg" />
        <meta property="og:url" content="https://lmscale.com" />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="LmScale - Deploy and Scale Language Models in the Cloud"
        />
        <meta
          name="twitter:description"
          content="Deploy and scale language models with zero infrastructure headaches. Simple, fast, and secure cloud deployment."
        />
        <meta
          name="twitter:image"
          content="https://lmscale.com/twitter-image.jpg"
        />

        <meta
          name="keywords"
          content="LLM, language models, AI deployment, cloud computing, machine learning, GPU infrastructure, model serving"
        />
        <link rel="canonical" href="https://lmscale.com" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <header>
        <div
          className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-in-out ${
            isVisible ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div
            className={`w-full transition-all duration-300 ${
              scrolled || isMenuOpen
                ? "bg-white/80 backdrop-blur-xl"
                : "bg-transparent"
            }`}
          >
            <div className="mx-auto max-w-full">
              <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center">
                  <Link
                    href="/"
                    className="group flex items-center gap-2 text-xl sm:text-2xl font-bold text-neutral-800"
                  >
                    <img
                      src="/icon.png"
                      alt="LmScale Logo"
                      className="h-7 w-7 sm:h-8 sm:w-8 object-contain"
                    />
                    <div className="font-light">LmScale</div>
                  </Link>
                </div>

                <div className="hidden lg:flex items-center space-x-6">
                  <nav>
                    <ul className="flex items-center space-x-6">
                      {[{ href: "/docs", text: "Docs" }].map((item) => (
                        <li key={item.text}>
                          <Link
                            href={item.href}
                            className="text-sm  text-neutral-600 hover:text-neutral-800 transition-colors duration-200"
                          >
                            {item.text}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>

                  <Link
                    href="/login"
                    className="group relative inline-flex items-center justify-center overflow-hidden bg-neutral-800 p-0.5 transition-all duration-300 hover:bg-neutral-950"
                  >
                    <span className="inline-flex h-full w-full items-center justify-center px-4 py-1.5 md:px-6 text-sm md:text-base  text-white transition-all duration-300">
                      Login
                    </span>
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="inline-flex items-center justify-center p-2 text-neutral-600 transition-colors duration-200 hover:bg-neutral-100 lg:hidden"
                  aria-label="Toggle menu"
                >
                  {isMenuOpen ? (
                    <X className="h-5 w-5 sm:h-6 sm:w-6" />
                  ) : (
                    <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`fixed inset-0 z-40 bg-white/90 backdrop-blur-xl transition-all duration-300 lg:hidden ${
            isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="h-full pt-20 overflow-y-auto">
            <div className="px-4 py-6">
              <nav className="flex flex-col space-y-1">
                {[
                  { href: "/docs", text: "Docs" },
                  { href: "/login", text: "Login" },
                ].map((item) => (
                  <Link
                    key={item.text}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="group relative flex items-center justify-between px-4 py-3 text-sm  text-neutral-600 transition-all duration-300 hover:text-neutral-800"
                  >
                    <span className="relative">
                      {item.text}
                      <span className="absolute inset-x-0 -bottom-0.5 h-px w-0 bg-neutral-800 transition-all duration-300 group-hover:w-full"></span>
                    </span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </header>
      <section
        id="Hero"
        className="relative min-h-screen bg-white overflow-hidden"
        aria-label="Hero Section"
      >
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:24px_24px] md:bg-[size:32px_32px]"
            style={{
              mask: "radial-gradient(circle at center, white 30%, transparent 70%)",
              WebkitMask:
                "radial-gradient(circle at center, white 30%, transparent 70%)",
            }}
          ></div>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-16 sm:pt-24 sm:pb-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="mb-6 md:mb-8 inline-flex items-center border border-black/10 px-4 py-1.5 md:px-6 md:py-2 text-xs md:text-sm text-neutral-800">
                <Terminal className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                Now Available in Beta
              </div>
            </div>
            <h1 className="mx-auto max-w-4xl font-display text-4xl font-light tracking-tight text-neutral-800 sm:text-6xl">
              Deploy Custom AI Assistants with SLMs
            </h1>
            <p className="mx-auto font-light mt-6 max-w-2xl text-lg sm:text-xl leading-8 text-neutral-600">
              Build and deploy production ready AI systems without the
              complexity. Simple setup, powerful features and enterprise grade
              infrastructure, all in one platform.
            </p>

            <div className="my-10 flex items-center justify-center gap-4 md:gap-6">
              <Link
                href="/register"
                className="group inline-flex items-center bg-neutral-900 px-6 md:px-8 py-2.5 md:py-3 text-sm md:text-base  text-white transition-all duration-300 hover:bg-neutral-950 hover:scale-105 hover:shadow-lg"
              >
                Get Started
                <svg
                  className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>

            <div className="relative w-full p-2 md:p-4">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#10b981,transparent_40%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,#f97316,transparent_40%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,#3b82f6,transparent_40%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_30%,#84cc16,transparent_40%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,#e879f9,transparent_40%)]" />
              <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]" />
              <div
                className="m-4 bg-white/80 p-2 md:p-4 backdrop-blur
-sm"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <div className="h-2.5 w-2.5 md:h-3 md:w-3 rounded-full bg-[#FF5F57]"></div>
                  <div className="h-2.5 w-2.5 md:h-3 md:w-3 rounded-full bg-[#FFBD2E]"></div>
                  <div className="h-2.5 w-2.5 md:h-3 md:w-3 rounded-full bg-[#28CA41]"></div>
                </div>
                <pre className="text-left text-xs md:text-sm text-neutral-600 overflow-x-auto scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-transparent">
                  <code>
                    {`curl -X POST "https://api.lmscale.tech/v1/chat/completion" \\
-H "Content-Type: application/json" \\
-H "Accept: text/event-stream" \\
-H "x-api-key: api_key" \\
-d '{
  "message": "Can you help me choose the right product for my needs?",
  "conversation": [
    {
      "role": "user",
      "content": "hi"
    },
    {
      "role": "ai", 
      "content": "how can i help you?"
    }
  ]
}'`}
                  </code>
                </pre>
              </div>
            </div>
            <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 items-center justify-center text-neutral-800">
              <div className="flex flex-col items-center gap-2 px-4 py-6">
                <span className="text-3xl font-light">40%</span>
                <span className="text-sm text-center">
                  Lower Deployment Cost
                </span>
              </div>
              <div className="flex flex-col items-center gap-2 px-4 py-6">
                <span className="text-3xl font-light">15x</span>
                <span className="text-sm text-center">Faster Integration</span>
              </div>
              <div className="flex flex-col items-center gap-2 px-4 py-6">
                <span className="text-3xl font-light">99.9%</span>
                <span className="text-sm text-center">Server Uptime</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer className="relative bg-white" role="contentinfo">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#10b981,transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,#f97316,transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,#3b82f6,transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_30%,#84cc16,transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,#e879f9,transparent_40%)]" />
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]" />
        <div className="relative mx-auto max-w-7xl px-4 py-12">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:gap-12">
            <div className="flex flex-col items-center md:items-start">
              <div className="text-2xl font-light text-neutral-800">
                LmScale
              </div>
              <p className="mt-4 max-w-xs text-center md:text-left text-sm text-neutral-800">
                Empowering businesses with secure, scalable local LLM solutions
                in the cloud.
              </p>
            </div>
            <div className="flex items-center gap-8">
              <Link
                href="#"
                className="text-neutral-800 hover:text-neutral-800 transition-colors duration-200"
              >
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>

              <Link
                href="#"
                className="text-neutral-800 hover:text-neutral-800 transition-colors duration-200"
              >
                <span className="sr-only">GitHub</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>

          <div className="mt-12 border-t border-neutral-200/60 pt-8">
            <div className="flex flex-col-reverse gap-4 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-neutral-800 text-center md:text-left">
                © {new Date().getFullYear()} LmScale. All rights reserved.
              </p>
              <nav className="flex flex-wrap justify-center gap-8">
                {["Privacy Policy", "Terms of Service", "Documentation"].map(
                  (item) => (
                    <Link
                      key={item}
                      href="#"
                      className="text-sm text-neutral-800 hover:text-neutral-800 transition-colors duration-200"
                    >
                      {item}
                    </Link>
                  )
                )}
              </nav>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
