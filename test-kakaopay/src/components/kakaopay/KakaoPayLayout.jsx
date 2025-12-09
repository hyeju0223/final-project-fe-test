import "./KakaoPay.css";
import { FaComment } from "react-icons/fa";

export default function KakaoPayLayout({ title, children }) {
  return (
    <div className="child-fullscreen">
      <div className="kakaopay-background">
        <div className="kakao-wrap">
          <div className="kakao-box">
            <h2 className="kakao-title">{title}</h2>
            <div className="kakao-content">{children}</div>
            {/* <FaComment /> */}
          </div>
        </div>
      </div>
    </div>
  );
}