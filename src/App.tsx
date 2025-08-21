import { useMockedAuth } from "./contexts/MockedAuthContext";
import { LoginPage } from "./pages/LoginPage";
import { HomePage } from "./pages/HomePage";

export const App = () => {
  const { user, isLoading } = useMockedAuth();

  // Loading state
  if (isLoading) {
    return (
      <div className="w-[401px] h-[600px] bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#6B86D6]/30 border-t-[#6B86D6] rounded-full animate-spin"></div>
          <p className="text-sm text-[#303A5A]">Carregando...</p>
        </div>
      </div>
    );
  }

  return user ? <HomePage /> : <LoginPage />;
};
