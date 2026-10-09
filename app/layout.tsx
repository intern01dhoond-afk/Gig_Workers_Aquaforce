import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter, Montserrat, Montserrat_Alternates, Open_Sans, Unbounded } from "next/font/google";
import "./globals.css";
import { OrderModalProvider } from "@/context/OrderModalContext";
import { BulkEnquiryProvider } from "@/context/BulkEnquiryContext";

import Preloader from "@/components/Preloader";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const montserratAlternates = Montserrat_Alternates({
  subsets: ["latin"],
  variable: "--font-montserrat-alternates",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const unbounded = Unbounded({
  subsets: ["latin"],
  variable: "--font-unbounded",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://promectools.in"),
  title: "Aquaforce® 1400 | Cordless. Powerful. Portable.",
  description:
    "Wash your car anywhere with the Aquaforce® 1400 - a powerful, battery-powered portable pressure washer. No cables, no power socket, no fixed setup needed.",
  verification: {
    google: "chwYmglPbeV2UvIMJ7y1GhjaKnfr8xfIUUIvRl5ekmI",
  },
  icons: {
    icon: [
      { url: "/aquaforceforgigworkers/images/favicon.ico" },
      { url: "/aquaforceforgigworkers/favicon.ico" },
    ],
    shortcut: "/aquaforceforgigworkers/images/favicon.ico",
    apple: "/aquaforceforgigworkers/images/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Meta Pixel Code */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '2138988830323885');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=2138988830323885&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes preloader-slide {
            0% { transform: translateX(-100%); opacity: 0; }
            15% { opacity: 1; }
            85% { opacity: 1; }
            100% { transform: translateX(260%); opacity: 0; }
          }
        ` }} />
      </head>
      <body className={`${inter.variable} ${montserrat.variable} ${montserratAlternates.variable} ${openSans.variable} ${unbounded.variable} antialiased font-sans`}>
        <Preloader />
        <OrderModalProvider>
          <BulkEnquiryProvider>{children}</BulkEnquiryProvider>
        </OrderModalProvider>
      </body>
    </html>
  );
}
