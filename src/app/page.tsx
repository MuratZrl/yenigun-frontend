"use client";

import Quality from "@/app/components/layout/Quality";
import Types from "@/app/components/layout/Types";
import WhyUs from "@/app/components/layout/WhyUs";
import Highlights from "@/app/components/layout/Highlights";
import Locations from "@/app/components/layout/Locations";
import Representatives from "@/app/components/layout/Representatives";
import Comments from "@/app/components/layout/Comments";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import GoToTop from "@/app/components/GoToTop";
import ImageSlider from "@/app/components/layout/ImageSlider";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import HeroSection from "@/app/components/layout/Hero";
import Popup from "@/app/components/PopUp";
import Header from "@/app/components/Header";
import api from "./lib/api";

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api
      .get("/advert/adverts?page=1&limit=6")
      .then((response) => {
        console.log(response.data.data);
        setData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <main className="bg-background">
      <Navbar />
      <Header
        title={"Anasayfa"}
        description={"Yenigün Emlak ile Sakarya'da Hayalinizdeki Evi Bulun"}
        keywords={`yenigunemlak`}
        openGraph={{
          url: `https://www.yenigunemlak.com/`,
          title: "Yenigün Emlak",
          description: "Yenigün Emlak ile Sakarya'da Hayalinizdeki Evi Bulun",
          images: [
            {
              url: "https://www.yenigunemlak.com/logo.png?v=2" as string,
              width: 1200,
              height: 630,
              alt: "Yenigün Emlak",
            },
          ],
        }}
      />
      {/* <HeroSection /> */}
      <Highlights data={data} />
      <Quality />
      <WhyUs />
      <Locations data={data} />
      <Types data={data} />
      <Comments />
      <ImageSlider />
      <Representatives />
      <Footer />
      <GoToTop />
      <Popup />
    </main>
  );
}
