import { useCallback, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"
import Modal from 'react-modal';

// 1. 모달 스타일 정의 (이 파일 내의 모달에만 적용됨)
const customModalStyles = {
    overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        width: "100%",
        height: "100vh",
        zIndex: "10",
        position: "fixed",
        top: "0",
        left: "0",
    },
    content: {
        width: "600px", // 모달 너비 (원하는 대로 조절 가능)
        height: "fit-content", // 내용물에 맞춰 높이 자동 조절
        maxHeight: "90vh", // 화면을 넘어가지 않도록 제한
        zIndex: "150",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)", // 정확한 중앙 정렬 핵심 코드
        borderRadius: "10px",
        boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.25)",
        backgroundColor: "white",
        justifyContent: "center",
        overflow: "auto", // 내용이 길어지면 스크롤 생김
        padding: "0", // 부트스트랩 클래스가 패딩을 관리하므로 여기선 0
        border: "none", // 기본 테두리 제거
    },
};

const TermsModal = () => {
    // 이동도구
    const navigate = useNavigate();

    // ref
    const subtitleRef = useRef(null);

    // state
    const [modalOpen, setModalOpen] = useState(false);
    //체크여부
    const [check, setCheck] = useState({
        all: false,
        service: false,
        privacy: false,
        marketing: false,
    });
    // 다음 버튼 활성화
    const [nextButton, setNextButton] = useState(false);

    // callback
    const openModal = useCallback(() => {
        setModalOpen(true);
        // 모달 열 때 체크상태 초기화
        setCheck({ all: false, service: false, privacy: false, marketing: false })
    }, []);

    const closeModal = useCallback(() => {
        setModalOpen(false);
    }, []);

    // 체크박스 (전체선택, 개별선택)
    const handleCheck = useCallback(e => {
        const { name, checked } = e.target;

        if (name === "all") {//전체항목 체크
            setCheck({
                all: checked,
                service: checked,
                privacy: checked,
                marketing: checked
            });
        }
        else {
            setCheck(prev => {
                const newState = { ...prev, [name]: checked };

                // 모든 개별항목 선택을 하면 전체동의가 활성화, 하나라도 빠지면 전체동의가 비활성화
                const allChecked = newState.service && newState.privacy && newState.marketing;
                return { ...newState, all: allChecked }
            })
        }
    }, [check]);

    // 버튼 활성화 여부
    const isNextEnabled = check.service && check.privacy;

    // 동의하기 버튼을 누르면 회원가입 페이지로 이동
    const moveToAccountJoin = useCallback(() => {
        if (check.privacy && check.service) {
            navigate("/account/join");
            closeModal();
        }
    }, [check]);

    return (
        <>
            <span onClick={openModal} style={{ cursor: "pointer" }} className="nav-link">
                회원가입
            </span>

            <Modal
                isOpen={modalOpen}
                onRequestClose={closeModal}
                style={customModalStyles} // 2. 여기서 스타일 적용!
                contentLabel="약관 동의 모달"
                ariaHideApp={false} 
                // 중요: className="modal-dialog..." 제거! 
                // 이유: 위에서 만든 customModalStyles와 충돌하여 위치가 깨집니다.
                // 스타일은 customModalStyles에서 관리하고, 내부는 Bootstrap 클래스를 그대로 씁니다.
            >
                {/* 내부 div에 modal-content 클래스는 그대로 둡니다 */}
                <div className="modal-content bg-white border-0"> 

                    {/* Header: 제목과 닫기 버튼 */}
                    <div className="modal-header border-0 pb-0 pt-4 px-4 d-flex justify-content-between">
                         {/* 제목 중앙 정렬을 위해 w-100과 text-center 추가 혹은 flex 조절 */}
                        <h1 className="modal-title fs-2 fw-bold w-100 text-center ps-4" ref={subtitleRef}>약관 동의</h1>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={closeModal}
                        ></button>
                    </div>
                    <div className="text-center text-muted mb-4 px-4 mt-2">
                        회원가입을 계속하려면, 이용약관 및 정책에 동의해주세요
                    </div>

                    {/* Body: 약관 리스트 */}
                    <div className="modal-body pt-0 px-4">
                        {/* 전체 동의 섹션 */}
                        <div className="form-check d-flex align-items-center mb-2 p-3 bg-light rounded">
                            <input
                                className="form-check-input mt-0" type="checkbox" id="checkAll" name="all"
                                checked={check.all} onChange={handleCheck}
                                style={{ transform: 'scale(1.2)', marginLeft: '0' }}
                            />
                            <label className="form-check-label fw-bold ms-3 fs-5 cursor-pointer" htmlFor="checkAll">
                                모두 동의합니다
                            </label>
                        </div>

                        {/* 개별 약관 동의 */}
                        <ul className="list-group list-group-flush mt-3">
                            {/* 서비스 이용약관 */}
                            <li className="list-group-item border-0 px-0 py-2 d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <input className="form-check-input" type="checkbox" id="checkService" name="service" checked={check.service} onChange={handleCheck} />
                                    <label className="form-check-label ms-2" htmlFor="checkService">
                                        <span className="text-primary fw-bold">(필수)</span> 서비스 이용약관
                                    </label>
                                </div>
                                <span className="view-link text-muted small" style={{cursor:'pointer'}}>보기 &gt;</span>
                            </li>

                            {/* 개인정보 */}
                            <li className="list-group-item border-0 px-0 py-2 d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <input className="form-check-input" type="checkbox" id="checkPrivacy" name="privacy" checked={check.privacy} onChange={handleCheck} />
                                    <label className="form-check-label ms-2" htmlFor="checkPrivacy">
                                        <span className="text-primary fw-bold">(필수)</span> 개인정보 수집 및 이용
                                    </label>
                                </div>
                                <span className="view-link text-muted small" style={{cursor:'pointer'}}>보기 &gt;</span>
                            </li>

                            {/* 마케팅 */}
                            <li className="list-group-item border-0 px-0 py-2 d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <input className="form-check-input" type="checkbox" id="checkMarketing" name="marketing" checked={check.marketing} onChange={handleCheck} />
                                    <label className="form-check-label ms-2" htmlFor="checkMarketing">
                                        <span className="text-secondary fw-bold">(선택)</span> 마케팅 정보 수신 동의
                                    </label>
                                </div>
                                <span className="view-link text-muted small" style={{cursor:'pointer'}}>보기 &gt;</span>
                            </li>
                        </ul>
                    </div>

                    {/* Footer: 동의하기 버튼 */}
                    <div className="modal-footer border-0 p-4 pt-2">
                        <button type="button" className="btn btn-primary w-100 py-3 fs-5 fw-bold" onClick={moveToAccountJoin} disabled={!isNextEnabled} >
                            동의하기
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    )

}

export default TermsModal;