import { useMockedAuth } from "../contexts/MockedAuthContext";

export const LoginPage = () => {
  const { login, isLoading } = useMockedAuth();

  const handleLogin = async () => {
    try {
      await login("user@sofya.com");
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="w-[401px] h-[600px] bg-white flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-semibold text-[#08194D] mb-8">Sofya Extension</h1>
      
      <button
        onClick={handleLogin}
        disabled={isLoading}
        className="bg-[#6B86D6] text-white py-3 px-8 rounded-lg font-medium hover:bg-[#365FD7] transition-colors disabled:opacity-50"
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
};