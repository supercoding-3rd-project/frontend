import React, { useRef } from "react";
import Slider from "react-slick";
import styled from "styled-components";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import QnaListPage from "../qnas";

const MainContainer = styled.div`
  width: 100%;
  overflow: hidden;
  margin-top: 60px;
  margin-bottom: 60px;
  height: 60vh;
`;

const SliderWrapper = styled.div`
  width: 100%;
  height: 100%;
  margin: 0 auto;
  text-align: center;
  overflow: hidden;
  position: relative;
`;

const SlideImage = styled.img`
  width: 100vw;
  height: 60vh;
`;

const SliderText = styled.p`
  font-size: 30px;
  font-weight: 600;
  letter-spacing: 5px;
  color: #ffffff;
  z-index: 1;
  position: absolute;
  top: 30%;
  left: 10%;
`;

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
    <MainContainer>
      <SliderWrapper>
        <Slider {...settings} ref={sliderRef}>
          {images.map((image, index) => (
            <div key={index}>
              <SlideImage src={image} alt={`slide-${index}`} />
            </div>
          ))}
        </Slider>
        <SliderText>알코에 오신 것을 환영합니다!</SliderText>
      </SliderWrapper>
      <QnaListPage />
    </MainContainer>
  );
}
