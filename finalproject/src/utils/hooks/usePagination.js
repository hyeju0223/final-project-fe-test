import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

/*
    [커스텀 훅] 데이터 더보기 기능 + 상태 업데이트 기능
*/
export const usePagination = (url, limit = 6) => {
    
    // 전체 데이터 (DB에서 가져온 원본)
    const [fullList, setFullList] = useState([]);
    
    // 화면에 보여줄 데이터 (잘라낸 것)
    const [list, setList] = useState([]);
    
    // 현재 페이지 번호
    const [page, setPage] = useState(1);
    
    // 더 보여줄 데이터가 있는지 여부
    const [hasMore, setHasMore] = useState(true);

    // 1. 최초 데이터 로드
    useEffect(() => {
        loadData();
    }, []);

    const loadData = useCallback(async () => {
        try {
            const resp = await axios.get(url);
            const allData = resp.data;
            
            setFullList(allData);
            setList(allData.slice(0, limit));
            setHasMore(allData.length > limit);
        } catch (err) {
            console.error("데이터 로드 실패", err);
        }
    }, [url, limit]);

    // 2. 페이지 변경 시 데이터 추가 표시 (fullList가 변해도 작동함)
    useEffect(() => {
        const nextEnd = page * limit;
        setList(fullList.slice(0, nextEnd));
        setHasMore(fullList.length > nextEnd);
    }, [page, fullList, limit]);

    // 3. 더보기 버튼 기능
    const nextPage = () => {
        setPage((prevPage) => prevPage + 1);
    };

    // [핵심] 4. 특정 아이템의 정보만 수정하는 함수 (좋아요 반영용)
    // targetId: 바꿀 일정의 ID (scheduleNo)
    // newFields: 바꿀 내용 객체 (예: { likeCount: 5, isLiked: true })
    const updateItem = (targetId, newFields) => {
        setFullList(prevFullList => 
            prevFullList.map(item => 
                // item의 ID 필드명이 scheduleNo라고 가정 (상황에 맞게 수정 필요)
                item.scheduleNo === targetId 
                    ? { ...item, ...newFields } 
                    : item
            )
        );
    };

    return { list, hasMore, nextPage, updateItem };
};