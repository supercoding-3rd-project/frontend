import "./intro.scss";

export default function IntroPage() {
  return (
    <div className="intro">
      <div className="intro__body">
        <h1 className="intro__title">알코(Al;Co) 뭐니?</h1>
        <div className="intro__flex">
          <div className="intro__logo">
            <img src="images/alco_logo.png" alt="" width={400} height={250} />
          </div>
          <div className="intro__sub">
            알코(AlCo)는 개발을 처음 시작하는 이들을 위한
            <br /> 온라인 커뮤니티 플랫폼입니다. 많은 개발자 커뮤니티가
            <br /> 주로 중급 이상의 개발자들을 대상으로 하고 있어,
            <br /> 초보 개발자들은 이해하기 어려운 내용이 많습니다.
            <br /> 알코는 이러한 초보 개발자들이 자주 겪는 질문과 팁을
            <br /> 공유하고, 서로를 이끌어주는 소통의 장을 마련하고자 합니다.
          </div>
        </div>
        <div className="intro__body__first">
          <h2 className="intro__body__title">질문방</h2>
          <div className="intro__flex">
            <div className="intro__sub">
              사용자들이 코드나 이미지를 통해 현재 상태를 공유하고,
              <br /> 개발 관련 질문을 할 수 있는 공간입니다.
            </div>
            <div className="intro__logo">
              <img src="images/alco_logo.png" alt="" width={400} height={250} />
            </div>
          </div>
          <h2 className="intro__body__title">1:1 채팅 (알톡)</h2>
          <div className="intro__flex">
            <div className="intro__logo">
              <img src="images/alco_logo.png" alt="" width={400} height={250} />
            </div>
            <div className="intro__sub">
              사용자들이 실시간으로 대화를 나눌 수 있는 기능입니다.
              <br /> 이를 통해 개발 관련 조언을 얻거나, <br /> 경험을 공유할 수
              있습니다.
            </div>
          </div>
        </div>
        <h3 className="intro__body__second">
          알코는 초보 개발자들이 경험 많은 개발자들로부터 조언을 받고,
          <br />
          지속적으로 기능을 개선하며 확장해 나갈 계획입니다.
          <br /> 개발자 여러분의 많은 참여와 독려를 부탁드립니다.
          <br /> - 알코 대표이사 : 주진성 -
        </h3>
        <div className="intro__body__third">
          <h2 className="intro__body__title">만든 녀석들</h2>
        </div>
      </div>
    </div>
  );
}
