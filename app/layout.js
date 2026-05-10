import './globals.css';
import { Inter } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: 'Open Generative AI — Free AI Image & Video Studio',
  description: 'Generate AI images and videos using 200+ models — Flux, Midjourney, Kling, Veo, Seedance and more.',
};

export default function RootLayout({ children }) {
  const apiKey = process.env.NEXT_PUBLIC_MUAPI_KEY || '';
  return (
    <html lang="en">
      <head>
        {apiKey && (
          <script
            dangerouslySetInnerHTML={{
              __html: `window.__MUAPI_KEY__ = ${JSON.stringify(apiKey)};`,
            }}
          />
        )}
      </head>
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
