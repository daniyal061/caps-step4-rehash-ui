module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        detail: "var(--detail-font-family)",
        "text-base-leading-normal-bold":
          "var(--text-base-leading-normal-bold-font-family)",
        "text-base-leading-normal-regular":
          "var(--text-base-leading-normal-regular-font-family)",
        "text-extra-large-leading-normal-semibold":
          "var(--text-extra-large-leading-normal-semibold-font-family)",
        "text-extra-small-leading-normal-regular":
          "var(--text-extra-small-leading-normal-regular-font-family)",
        "text-extra-small-leading-normal-underlined":
          "var(--text-extra-small-leading-normal-underlined-font-family)",
        "text-large-leading-normal-regular":
          "var(--text-large-leading-normal-regular-font-family)",
        "text-large-leading-normal-semibold":
          "var(--text-large-leading-normal-semibold-font-family)",
        "text-small-leading-none-medium":
          "var(--text-small-leading-none-medium-font-family)",
        "text-small-leading-none-underlined":
          "var(--text-small-leading-none-underlined-font-family)",
        "text-small-leading-normal-medium":
          "var(--text-small-leading-normal-medium-font-family)",
        "text-small-leading-normal-regular":
          "var(--text-small-leading-normal-regular-font-family)",
        "text-small-leading-normal-semibold":
          "var(--text-small-leading-normal-semibold-font-family)",
        sans: [
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      boxShadow: {
        "shadow-base": "var(--shadow-base)",
        "shadow-sm": "var(--shadow-sm)",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
  },
  plugins: [],
  darkMode: ["class"],
};
