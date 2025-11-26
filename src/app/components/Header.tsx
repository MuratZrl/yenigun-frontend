import React from "react";
import Head from "next/head";

interface OpenGraph {
  url: string;
  title: string;
  description: string;
  images: {
    url: string;
    width?: number;
    height?: number;
    alt: string;
  }[];
  site_name?: string;
}

interface Twitter {
  handle?: string;
  site?: string;
  cardType?: string;
}

interface HeaderProps {
  title?: string;
  description?: string;
  keywords?: string;
  openGraph?: OpenGraph;
  twitter?: Twitter;
}

const Header: React.FC<HeaderProps> = ({
  title = "Ana Sayfa",
  description = "Yenigün emlak",
  keywords = "aracı, iş ilanı",
  openGraph = {
    url: "https://www.yenigunemlak.com",
    title: "yenigunemlak.com",
    description: "Yenigün emlak",
    images: [
      {
        url: "https://www.yenigunemlak.com/logo.png",
        width: 1200,
        height: 630,
        alt: "yenigunemlak.com logo",
      },
    ],
    site_name: "yenigunemlak.com",
  },
  twitter = {
    handle: "@yenigunemlak",
    site: "@yenigunemlak",
    cardType: "summary_large_image",
  },
}) => {
  const fullTitle = `${title} | yenigunemlak.com - Sakarya'da Hayalinizdeki Evi Bulun`;
  const canonicalUrl = openGraph.url
    .replace(/\/$/, "")
    .replace(/([^:])(\/\/+)/g, "$1/");
  const primaryImage = openGraph.images[0];
  const imageWidth = primaryImage.width || 1200;
  const imageHeight = primaryImage.height || 630;

  const validatedImageUrl = primaryImage.url.startsWith("http")
    ? primaryImage.url
    : `https://www.yenigunemlak.com${primaryImage.url}`;
  console.log(canonicalUrl);
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <meta
          name="keywords"
          content={`
        ${keywords}, 
        yenigunemlak, yenigunemlak.com, Sakarya ev, emlak, sakarya daire
      `}
        />
        <meta name="robots" content="index, follow"></meta>
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={openGraph.title} />
        <meta property="og:description" content={openGraph.description} />
        <meta
          property="og:site_name"
          content={openGraph.site_name || "yenigunemlak.com"}
        />
        <meta property="og:image" content={validatedImageUrl} />
        <meta property="og:image:secure_url" content={validatedImageUrl} />
        <meta property="og:image:width" content={imageWidth.toString()} />
        <meta property="og:image:height" content={imageHeight.toString()} />
        <meta property="og:image:alt" content={primaryImage.alt} />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="fb:app_id" content="1626076231389253" />

        <meta
          name="twitter:card"
          content={twitter.cardType || "summary_large_image"}
        />
        <meta name="twitter:site" content={twitter.site} />
        <meta name="twitter:creator" content={twitter.handle} />
        <meta name="twitter:title" content={openGraph.title} />
        <meta name="twitter:description" content={openGraph.description} />
        <meta name="twitter:image" content={validatedImageUrl} />
        <meta name="twitter:image:alt" content={primaryImage.alt} />

        <meta name="author" content="yenigunemlak.com" />
        <meta name="theme-color" content="#007bff" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  );
};

export default Header;
