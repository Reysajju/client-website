import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://thedancingqueenbook.com";

export const metadata: Metadata = {
  title: {
    default: "The Dancing Queen — A Bedtime Story by Mémère",
    template: "%s | The Dancing Queen by Mémère",
  },
  description:
    "A whimsical bedtime picture book about a tiny winged fairy who dances in children's hair and guards their dreams. Written by Mémère for ages 2–6.",
  keywords: [
    "The Dancing Queen",
    "Mémère",
    "bedtime story",
    "children's book",
    "picture book",
    "fairy tale",
    "bedtime ritual",
    "whimsical fantasy",
    "guardian fairy",
    "children's mythology",
    "bedtime reading",
    "grandmother author",
    "ages 2-6",
    "rhyming bedtime book",
  ],
  authors: [{ name: "Mémère", url: siteUrl + "/#author" }],
  creator: "Mémère",
  publisher: "Mémère",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "The Dancing Queen",
    title: "The Dancing Queen — A Bedtime Story by Mémère",
    description:
      "A whimsical bedtime picture book about a tiny winged fairy who dances in children's hair and guards their dreams. For ages 2–6.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Dancing Queen — A whimsical bedtime picture book by Mémère",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Dancing Queen — A Bedtime Story by Mémère",
    description:
      "A whimsical bedtime picture book about a tiny winged fairy who dances in children's hair and guards their dreams.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here
    // google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "The Dancing Queen",
        description:
          "A whimsical bedtime picture book by Mémère about a tiny winged guardian fairy.",
        inLanguage: "en-US",
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Book",
        "@id": `${siteUrl}/#book`,
        name: "The Dancing Queen",
        author: {
          "@type": "Person",
          name: "Mémère",
          url: `${siteUrl}/#author`,
        },
        description:
          "A whimsical bedtime picture book about a tiny, light, fairy-like being with wings who lives in a child's hair. By day she plays in backyards; as evening falls, she tucks her wings in close and stands guard over their dreams.",
        isbn: "978-0-000000-00-0",
        bookFormat: "https://schema.org/Paperback",
        numberOfPages: 32,
        audience: {
          "@type": "PeopleAudience",
          suggestedMinAge: "2",
          suggestedMaxAge: "6",
        },
        genre: ["Children's Book", "Bedtime Story", "Fairy Tale", "Picture Book"],
        illustration: "The Dancing Queen features watercolor illustrations that carry the reader through a day-to-night visual arc.",
        publisher: {
          "@type": "Organization",
          name: "Mémère",
        },
        url: `${siteUrl}/#book`,
        image: `${siteUrl}/og-image.png`,
      },
      {
        "@type": "Person",
        "@id": `${siteUrl}/#author`,
        name: "Mémère",
        description:
          "Mémère — the French word for grandmother — wrote The Dancing Queen as a bedtime gift for her grandsons George and Myles, affectionately called 'Critter and Bug.'",
        url: `${siteUrl}/#author`,
        image: `${siteUrl}/author-image.png`,
        sameAs: [],
      },
      {
        "@type": "VideoObject",
        name: "The Dancing Queen — Book Trailer",
        description:
          "Watch the Dancing Queen come to life — from sunlit backyard dances to the quiet magic of a child's pillow at night.",
        contentUrl: `${siteUrl}/trailer.mp4`,
        thumbnailUrl: `${siteUrl}/og-image.png`,
        uploadDate: "2025-01-01",
        duration: "PT32S",
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What age range is The Dancing Queen for?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The Dancing Queen is designed for children aged 2 to 6 — young readers and listeners who still look for a little magic before saying good night.",
            },
          },
          {
            "@type": "Question",
            name: "What is The Dancing Queen about?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The Dancing Queen invents a new piece of children's mythology — a tiny, winged, fairy-like being who lives in a child's hair, dances on curls and ponytails, and stands watch over their pillow as they sleep.",
            },
          },
          {
            "@type": "Question",
            name: "Who wrote The Dancing Queen?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The Dancing Queen was written by Mémère — the French word for grandmother — as a bedtime gift for her grandsons George and Myles.",
            },
          },
        ],
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#6B3A6B" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[999] focus:px-4 focus:py-2 focus:rounded-lg focus:text-white focus:no-underline"
          style={{ background: "var(--primary, #6B3A6B)" }}
        >
          Skip to main content
        </a>
        {children}
        <Toaster />
      </body>
    </html>
  );
}