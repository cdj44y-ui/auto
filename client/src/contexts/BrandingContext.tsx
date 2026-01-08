import React, { createContext, useContext, useEffect, useState } from "react";

interface BrandingSettings {
  logoUrl: string | null;
  primaryColor: string;
  companyName: string;
  loginBackgroundUrl: string | null;
  welcomeMessage: string;
}

interface BrandingContextType {
  branding: BrandingSettings;
  updateBranding: (newSettings: Partial<BrandingSettings>) => void;
  resetBranding: () => void;
}

const defaultSettings: BrandingSettings = {
  logoUrl: null,
  primaryColor: "#007AFF", // Default Apple Blue
  companyName: "ATTENDANCE ENTERPRISE SYSTEM",
  loginBackgroundUrl: null,
  welcomeMessage: "근태관리 시스템 접속",
};

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export function BrandingProvider({ children }: { children: React.ReactNode }) {
  const [branding, setBranding] = useState<BrandingSettings>(() => {
    const saved = localStorage.getItem("branding_settings");
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem("branding_settings", JSON.stringify(branding));
    applyTheme(branding.primaryColor);
  }, [branding]);

  const applyTheme = (color: string) => {
    // Convert hex to OKLCH for Tailwind theme
    // Note: This is a simplified conversion or direct usage if supported
    // For now, we will set a CSS variable that overrides the primary color
    // Since our index.css uses oklch, we might need a helper or just inject styles
    
    // Simple approach: Inject a style tag to override root variables
    // We need to convert Hex to OKLCH or just use the hex if we change the CSS definition
    // But our CSS uses oklch(0.55 0.22 260). Let's try to update the root style directly.
    
    // However, since Tailwind 4 uses static CSS generation mostly, dynamic values need style attributes or CSS variables.
    // Our index.css defines --primary as oklch(...).
    // We will update the document.documentElement.style to set --primary to the hex value (if browser supports mixing)
    // or we need a hex-to-oklch converter.
    
    // For simplicity and robustness, we will use a small helper to set the hex color
    // and let the browser handle it if we change the CSS to use a variable that accepts hex
    // OR we just set the hex directly and hope the browser/tailwind setup respects it.
    
    // Let's assume we can set --primary-hex and update index.css to use it, 
    // OR we just set the --primary variable to the hex value. 
    // Tailwind's `bg-primary` uses `var(--primary)`.
    
    // IMPORTANT: The current index.css uses oklch values. 
    // To support hex, we should probably update index.css to allow a variable that can be a hex color.
    // But `oklch()` expects numbers.
    
    // Strategy: We will set a new variable --primary-color-override
    // and update index.css to use it if present, or fallback.
    // BUT, the easiest way for a "working" solution without complex color math in JS
    // is to set the style property on :root.
    
    const root = document.documentElement;
    
    // We need to convert Hex to RGB/HSL/OKLCH to match the theme system perfectly,
    // but for now, let's try setting the variable directly.
    // Since Tailwind 4 config in index.css maps --primary to a value,
    // if we change that value on :root, it should update.
    
    // However, the current value is `oklch(0.55 0.22 260)`.
    // If we replace it with `#ff0000`, it might break if Tailwind expects oklch components.
    // Let's check index.css: `--primary: oklch(0.55 0.22 260);`
    // It seems it expects a color value. So a hex string should work if we just replace the whole value.
    
    root.style.setProperty("--primary", color);
    root.style.setProperty("--sidebar-primary", color);
    root.style.setProperty("--ring", color);
    
    // We also need to update the foreground color for contrast if needed,
    // but for now we assume the user picks a color that works with white text (primary-foreground is white).
  };

  const updateBranding = (newSettings: Partial<BrandingSettings>) => {
    setBranding((prev) => ({ ...prev, ...newSettings }));
  };

  const resetBranding = () => {
    setBranding(defaultSettings);
  };

  return (
    <BrandingContext.Provider value={{ branding, updateBranding, resetBranding }}>
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  const context = useContext(BrandingContext);
  if (context === undefined) {
    throw new Error("useBranding must be used within a BrandingProvider");
  }
  return context;
}
