import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  Menu,
  X,
  Sparkles,
  Brain,
  FileText,
  BarChart2,
  UserPlus,
  MessageSquare,
  Star,
  ChevronDown,  
} from "lucide-react";

import {
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";

import Logo from "../components/common/Logo";

import { SiLeetcode } from "react-icons/si";

import heroImage from "../assets/heroPage.webp";

function LandingPage() {
  const navigate = useNavigate();

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  const [openFaq, setOpenFaq] =
  useState(null);

  const faqItems = [
  {
    question:
      "Is NexHire free to use?",
    answer:
      "Yes, NexHire is completely free. Sign up and start practicing immediately with no credit card required.",
  },
  {
    question:
      "What types of interviews can I practice?",
    answer:
      "NexHire supports Technical, HR, Behavioral, and Mixed interview types across various roles and difficulty levels.",
  },
  {
    question:
      "How does the AI evaluate my answers?",
    answer:
      "Your answers are analyzed by Google's Gemini AI which scores each response, identifies strengths and weak areas, and provides detailed feedback.",
  },
  {
    question:
      "Can I analyze my resume?",
    answer:
      "Yes. Upload your PDF or DOCX resume and get an ATS compatibility score, missing skills, and actionable improvement suggestions.",
  },
  {
    question:
      "Is my data safe?",
    answer:
      "Your data is stored securely. You can delete your account and all associated data at any time from the Settings page.",
  },
];

  /**
   * Smooth Scroll Helper
   */
  const scrollToSection = (
    sectionId
  ) => {
    const section =
      document.getElementById(
        sectionId
      );

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });

      setMobileMenuOpen(
        false
      );
    }
  };

  return (
    <div className="bg-white text-[#0f172a]">
      {/* ========================================
          NAVBAR
      ======================================== */}
      <header className="sticky top-0 z-50 border-b border-[#e2e8f0] bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          
          {/* Logo */}
          <button
            onClick={() =>
              scrollToSection(
                "hero"
              )
            }
          >
            <div className="flex items-end gap-2">
              <img
                src="/favicon.svg"
                alt="NexHire"
                className="h-8 w-auto"
              />

              <Logo />
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <button
              onClick={() =>
                scrollToSection(
                  "features"
                )
              }
              className="text-sm font-medium text-[#64748b] transition hover:text-[#2563eb]"
            >
              Features
            </button>

            <button
              onClick={() =>
                scrollToSection(
                  "how-it-works"
                )
              }
              className="text-sm font-medium text-[#64748b] transition hover:text-[#2563eb]"
            >
              How It Works
            </button>

            <button
              onClick={() =>
                scrollToSection(
                  "faq"
                )
              }
              className="text-sm font-medium text-[#64748b] transition hover:text-[#2563eb]"
            >
              FAQ
            </button>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={() =>
                navigate(
                  "/login"
                )
              }
              className="rounded-lg border border-[#2563eb] px-4 py-2 text-sm font-medium text-[#2563eb] transition hover:bg-blue-100"
            >
              Log in
            </button>

            <button
              onClick={() =>
                navigate(
                  "/signup"
                )
              }
              className="rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() =>
              setMobileMenuOpen(
                (
                  prev
                ) => !prev
              )
            }
            className="md:hidden"
          >
            {mobileMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="border-t border-[#e2e8f0] bg-white md:hidden">
            <div className="flex flex-col gap-2 px-4 py-4">
              <button
                onClick={() =>
                  scrollToSection(
                    "features"
                  )
                }
                className="rounded-lg px-3 py-2 text-left text-[#64748b] hover:bg-slate-50"
              >
                Features
              </button>

              <button
                onClick={() =>
                  scrollToSection(
                    "how-it-works"
                  )
                }
                className="rounded-lg px-3 py-2 text-left text-[#64748b] hover:bg-slate-50"
              >
                How It Works
              </button>

              <button
                onClick={() =>
                  scrollToSection(
                    "faq"
                  )
                }
                className="rounded-lg px-3 py-2 text-left text-[#64748b] hover:bg-slate-50"
              >
                FAQ
              </button>

              <hr className="my-2 border-[#e2e8f0]" />

              <button
                onClick={() =>
                  navigate(
                    "/login"
                  )
                }
                className="rounded-lg border border-[#2563eb] px-4 py-2 text-[#2563eb]"
              >
                Log in
              </button>

              <button
                onClick={() =>
                  navigate(
                    "/signup"
                  )
                }
                className="rounded-lg bg-[#2563eb] px-4 py-2 text-white"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ========================================
          HERO SECTION
      ======================================== */}
      <section
        id="hero"
        className="pt-6 pb-16 lg:pt-10 lg:pb-24"
      >
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          
          {/* Left Content */}
          <div>
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-[#2563eb]">
              <Sparkles
                size={16}
              />
              AI-Powered Interview Prep
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-bold leading-tight text-[#0f172a] sm:text-5xl lg:text-6xl">
              Ace Your Next{" "}
              <span className="text-[#2563eb]">
                Interview
              </span>{" "}
              with AI
            </h1>

            {/* Subheading */}
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#64748b]">
              Practice with
              AI-powered mock
              interviews, get
              instant feedback,
              and walk into every
              interview with
              confidence.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button
                onClick={() =>
                  navigate(
                    "/signup"
                  )
                }
                className="rounded-xl bg-[#2563eb] px-6 py-3 font-medium text-white transition hover:bg-blue-700"
              >
                Start Practicing
                Free
              </button>

              <button
                onClick={() =>
                  scrollToSection(
                    "how-it-works"
                  )
                }
                className="rounded-xl border border-[#2563eb] px-6 py-3 font-medium text-[#2563eb] transition hover:bg-blue-50"
              >
                See How It Works
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div>
            <img
              src={heroImage}
              alt="NexHire Hero"
              className="w-full rounded-2xl shadow-xl shadow-slate-200/50"
            />
          </div>
        </div>
      </section>

            {/* ========================================
          FEATURES SECTION
      ======================================== */}
      <section
        id="features"
        className="bg-[#f8fafc] py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-[#0f172a] sm:text-4xl">
              Everything You Need to Succeed
            </h2>

            <p className="mt-4 text-lg text-[#64748b]">
              NexHire gives you the tools to prepare
              smarter and perform better.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 */}
            <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-[#2563eb]">
                <Brain size={24} />
              </div>

              <h3 className="text-xl font-semibold text-[#0f172a]">
                AI Mock Interviews
              </h3>

              <p className="mt-3 leading-relaxed text-[#64748b]">
                Practice with real interview questions
                tailored to your role and difficulty
                level. Get scored and evaluated by AI
                instantly.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-[#2563eb]">
                <FileText size={24} />
              </div>

              <h3 className="text-xl font-semibold text-[#0f172a]">
                Resume ATS Analyzer
              </h3>

              <p className="mt-3 leading-relaxed text-[#64748b]">
                Upload your resume and get an ATS
                score, missing skills, strengths, and
                actionable suggestions to improve it.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-[#2563eb]">
                <BarChart2 size={24} />
              </div>

              <h3 className="text-xl font-semibold text-[#0f172a]">
                Track Your Progress
              </h3>

              <p className="mt-3 leading-relaxed text-[#64748b]">
                Monitor your interview scores and ATS
                improvements over time. Know exactly
                where to focus next.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          HOW IT WORKS
      ======================================== */}
      <section
        id="how-it-works"
        className="bg-white py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-[#0f172a] sm:text-4xl">
              How It Works
            </h2>

            <p className="mt-4 text-lg text-[#64748b]">
              Get interview-ready in three simple
              steps.
            </p>
          </div>

          {/* Steps */}
          <div className="relative mt-16">
            {/* Desktop Connector */}
            <div className="absolute left-0 right-0 top-10 hidden h-[2px] bg-[#e2e8f0] lg:block" />

            <div className="grid gap-10 lg:grid-cols-3">
              {/* Step 1 */}
              <div className="relative text-center">
                <div className="relative z-10 mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
                  <UserPlus
                    size={32}
                    className="text-[#2563eb]"
                  />
                </div>

                <div className="mx-auto mt-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#2563eb] text-sm font-bold text-white">
                  01
                </div>

                <h3 className="mt-5 text-xl font-semibold text-[#0f172a]">
                  Create Your Account
                </h3>

                <p className="mt-3 leading-relaxed text-[#64748b]">
                  Sign up free and set your target
                  role and skills in your profile.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative text-center">
                <div className="relative z-10 mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
                  <MessageSquare
                    size={32}
                    className="text-[#2563eb]"
                  />
                </div>

                <div className="mx-auto mt-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#2563eb] text-sm font-bold text-white">
                  02
                </div>

                <h3 className="mt-5 text-xl font-semibold text-[#0f172a]">
                  Practice with AI
                </h3>

                <p className="mt-3 leading-relaxed text-[#64748b]">
                  Choose interview type,
                  difficulty, and number of
                  questions. Answer at your own
                  pace.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative text-center">
                <div className="relative z-10 mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
                  <Star
                    size={32}
                    className="text-[#2563eb]"
                  />
                </div>

                <div className="mx-auto mt-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#2563eb] text-sm font-bold text-white">
                  03
                </div>

                <h3 className="mt-5 text-xl font-semibold text-[#0f172a]">
                  Get Instant Feedback
                </h3>

                <p className="mt-3 leading-relaxed text-[#64748b]">
                  Receive AI-powered scores,
                  strengths, weak areas, and a
                  personalized learning path.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

            {/* ========================================
          FAQ SECTION
      ======================================== */}
      <section
        id="faq"
        className="bg-[#f8fafc] py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#0f172a] sm:text-4xl">
              Frequently Asked Questions
            </h2>

            <p className="mt-4 text-lg text-[#64748b]">
              Everything you need to know about
              NexHire.
            </p>
          </div>

          {/* FAQ Items */}
          <div className="mt-12">
            {faqItems.map(
              (item, index) => (
                <div
                  key={index}
                  className="border-b border-[#e2e8f0]"
                >
                  <button
                    onClick={() =>
                      setOpenFaq(
                        openFaq === index
                          ? null
                          : index
                      )
                    }
                    className="flex w-full items-center justify-between py-5 text-left"
                  >
                    <span className="text-lg font-medium text-[#0f172a]">
                      {item.question}
                    </span>

                    <ChevronDown
                      size={20}
                      className={`transition-transform duration-300 ${
                        openFaq === index
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openFaq === index
                        ? "max-h-40 pb-5"
                        : "max-h-0"
                    }`}
                  >
                    <p className="leading-relaxed text-[#64748b]">
                      {item.answer}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ========================================
          FOOTER
      ======================================== */}
      <footer className="border-t border-[#e2e8f0] bg-[#f8fafc]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-3">
            
            {/* Brand */}
<div className="flex flex-col items-start">
  <button
    onClick={() => scrollToSection("hero")}
    className="transition hover:opacity-80"
  >
    <Logo></Logo>
  </button>

  <p className="mt-2 text-sm text-[#64748b]">
    Your AI-powered interview preparation platform.
  </p>
</div>

            {/* Quick Links */}
            <div>
              <h4 className="mb-4 font-semibold text-[#0f172a]">
                Quick Links
              </h4>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => scrollToSection("features")}
                  className="text-left text-[#64748b] hover:text-[#2563eb]"
                >
                  Features
                </button>

                <button
                  onClick={() => scrollToSection("how-it-works")}
                  className="text-left text-[#64748b] hover:text-[#2563eb]"
                >
                  How It Works
                </button>

                <button
                  onClick={() => scrollToSection("faq")}
                  className="text-left text-[#64748b] hover:text-[#2563eb]"
                >
                  FAQ
                </button>

                <button
                  onClick={() => navigate("/login")}
                  className="text-left text-[#64748b] hover:text-[#2563eb]"
                >
                  Login
                </button>

                <button
                  onClick={() => navigate("/signup")}
                  className="text-left text-[#64748b] hover:text-[#2563eb]"
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Connect */}
            <div>
              <h4 className="mb-4 font-semibold text-[#0f172a]">
                Connect
              </h4>

              <div className="flex flex-col gap-3">
                <a
                  href="https://www.linkedin.com/in/sahilghorpade/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#64748b] transition hover:text-[#2563eb]"
                >
                  <FaLinkedin size={18} />
                  LinkedIn
                </a>

                <a
                  href="https://github.com/Sahil-Ghorpade"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#64748b] transition hover:text-[#2563eb]"
                >
                  <FaGithub size={18} />
                  GitHub
                </a>

                <a
                  href="https://leetcode.com/u/Nhdui1uvFI/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#64748b] transition hover:text-[#2563eb]"
                >
                  <SiLeetcode size={18} />
                  LeetCode
                </a>
              </div>
            </div>

          </div>

          {/* Bottom */}
          <div className="mt-10 border-t border-[#e2e8f0] pt-6 text-center text-sm text-[#64748b]">
            © 2026 NexHire • Designed & Developed by
            <span className="font-medium text-[#0f172a]">
              {" "}Sahil Ghorpade
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;