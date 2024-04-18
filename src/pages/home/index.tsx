import React, { useRef } from "react";
import "./main.scss";
import QnaListPage from "../qnas";

export default function HomePage() {
  const sliderRef = useRef(null);

  const images = [
    "https://media.discordapp.net/attachments/635072892576464902/1230416773489102848/image.png?ex=66333dea&is=6620c8ea&hm=d50cefaa12530bca33e5dce2b81cb9a209f5dd85c498c12fd3b59d6eac059168&=&format=webp&quality=lossless&width=1100&height=470",
    "https://media.discordapp.net/attachments/635072892576464902/1230417412323676160/image.png?ex=66333e83&is=6620c983&hm=c36791ecda27f18cf9b67c23ef57bb429bed44b2fdc0c2994c73c8b7eb4bdb9f&=&format=webp&quality=lossless&width=1100&height=492",
    "https://media.discordapp.net/attachments/635072892576464902/1230417930190192731/image.png?ex=66333efe&is=6620c9fe&hm=11f85866bdfe78b9d731de998931533abb20502b210ed7cdc1b90b744d524703&=&format=webp&quality=lossless&width=1100&height=534",
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  return (
    <div className="main">
      <QnaListPage />;
    </div>
  );
}
