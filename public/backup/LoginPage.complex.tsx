import { useState } from "react";
import { cn } from "../lib/utils";
import { useMockedAuth } from "../contexts/MockedAuthContext";

const SofyaLogo = () => (
  <div className="flex items-center justify-center mb-11">
    <img
      src="/sofya-logo.svg"
      alt="Sofya Logo"
      className="w-auto h-14 max-w-[148px]"
      width={148}
      height={56}
    />
  </div>
);

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState("");

  const { login, isLoading, error: authError } = useMockedAuth();

  const validateForm = () => {
    if (!email.trim()) {
      setFormError("Email é obrigatório");
      return false;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setFormError("Por favor, insira um email válido");
      return false;
    }

    return true;
  };

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!validateForm()) {
      return;
    }

    try {
      // Use the email for login (password not required in mock)
      await login(email);
    } catch {
      // Error is handled by the auth context
    }
  };

  const error = formError || authError;

  return (
    <div className="w-[401px] h-[600px] bg-white flex flex-col items-center px-9 py-13 font-inter overflow-hidden">
      {/* Sofya Logo */}
      <SofyaLogo />

      {/* Main heading */}
      <h2 className="text-base font-normal text-[#303A5A] text-center mb-19 leading-7">
        Faça login ou registre-se para continuar.
      </h2>

      {/* Login Form */}
      <form onSubmit={handleContinue} className="w-full max-w-[323px]">
        {/* Email Input */}
        <div className="relative mb-6">
          <div className="bg-white border border-[#365FD7] rounded-[5px] h-14 px-4 flex items-center">
            <div className="absolute -top-3 left-4 bg-white px-2">
              <label className="text-[15px] text-[#365FD7] font-normal">
                Endereço de email*
              </label>
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-lg text-[#4B5576] bg-transparent outline-none placeholder:text-[#4B5576]/75"
              placeholder="email@example.com"
              disabled={isLoading}
              required
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        {/* Continue Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            "w-full h-14 bg-[#6B86D6] text-white font-normal text-[17px] rounded-[5px] transition-opacity",
            "hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {isLoading ? "Carregando..." : "Continuar"}
        </button>

        {/* Sign up link */}
        <div className="text-center mt-6">
          <span className="text-base font-normal text-[#303A5A]">
            Não tem uma conta?{" "}
          </span>
          <button
            type="button"
            className="text-base font-normal text-[#6B86D6] hover:underline"
            disabled={isLoading}
          >
            Inscreva-se
          </button>
        </div>
      </form>
    </div>
  );
};
