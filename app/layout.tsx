import { AccessibilityMenu } from "@/components/accessibility-menu";
import { KeyboardShortcutsHelp } from "@/components/keyboard-shortcuts-help";
import { LayoutWithSidebar } from "@/components/layout-with-sidebar";
import { PasswordChangeGuard } from "@/components/password-change-guard";
import { TermsGuard } from "@/components/terms-guard";
import { Toaster } from "@/components/ui/toaster";
import { AccessibilityProvider } from "@/contexts/accessibility-context";
import { AuthProvider } from "@/contexts/auth-context";
import { NavigationProvider } from "@/contexts/navigation-context";
import { NotificationProvider } from "@/contexts/notification-context";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./accessibility.css";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sistema AEE - IPAAGS",
  description: "Sistema de Atendimento Educacional Especializado",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={poppins.className}>
        <Providers>
          <LayoutWithSidebar>{children}</LayoutWithSidebar>
          <AccessibilityMenu />
          <KeyboardShortcutsHelp />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AccessibilityProvider>
        <NotificationProvider>
          <NavigationProvider>
            <PasswordChangeGuard>
              <TermsGuard>{children}</TermsGuard>
            </PasswordChangeGuard>
          </NavigationProvider>
        </NotificationProvider>
      </AccessibilityProvider>
    </AuthProvider>
  );
}
