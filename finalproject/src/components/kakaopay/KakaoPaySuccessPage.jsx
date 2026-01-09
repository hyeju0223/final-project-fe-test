import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function KakaoPaySuccessPage() {
  const navigate = useNavigate();
  const { partnerOrderId } = useParams();
  const { search } = useLocation(); // ?pg_token=...
  const query = new URLSearchParams(search);
  const pgToken = query.get("pg_token");

  useEffect(() => {
    // ✅ 여기서 백엔드 approve 호출을 프론트에서 하는 구조면 호출해도 됨
    // 지금은 "서버에서 이미 approve 처리 후 redirect" 구조라면 호출 필요 없음
    // console.log("partnerOrderId=", partnerOrderId, "pg_token=", pgToken);
  }, [partnerOrderId, pgToken]);

  return (
    <div className="container py-5" style={{ maxWidth: 720 }}>
      <div className="text-center mb-4">
        <h2 className="fw-bold">결제가 완료됐어요</h2>
        <div className="text-muted mt-2">
          주문번호: <b>{partnerOrderId}</b>
        </div>
      </div>

      <div className="card p-4 shadow-sm">
        <p className="mb-3">
          TripPlanner 결제가 정상적으로 처리되었습니다.
        </p>

        {/* ✅ 필요하면 pg_token도 보여주기(디버그용) */}
        {/* <div className="small text-muted">pg_token: {pgToken}</div> */}

        <div className="d-flex gap-2 justify-content-center mt-4">
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate(-1)}
          >
            이전으로
          </button>

          {/* ✅ “구매하기 전 페이지처럼” 보여주고 싶으면
              구매페이지 라우트로 보내면 됨 */}
          <button
            className="btn btn-primary"
            onClick={() => navigate("/payment")} // 너희 구매페이지 라우트로 변경
          >
            결제 페이지로 돌아가기
          </button>

          <button
            className="btn btn-success"
            onClick={() => navigate("/mypage")} // 원하면 마이페이지도
          >
            마이페이지
          </button>
        </div>
      </div>
    </div>
  );
}
