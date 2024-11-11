import React from "react";
import * as S from "./pagination.styles";
import { useRouter } from "next/router";

interface IPaginationProps {
  pagination: {
    currentPage: number; // 현재 페이지 - (router.query.page의 값)
    totalPages: number; // 총 게시글 개수의 페이지 - (게시글 몇 개씩 총 n개의 게시물을 계산)
  };
}

const Pagination01 = (props: IPaginationProps) => {
  const { currentPage, totalPages } = props.pagination;
  const router = useRouter();

  // 현재 페이지 그룹의 시작과 끝 계산 (1~5 or 6~10) => pageGroupSize = 7 로 하면 1~7 or 8~14
  const pageGroupSize = 5;

  // 현재 그룹의 위치 계산 === 1~5 = 1 / 6~10 = 2 / 이전, 다음 페이지 위치 계산
  const currentGroup = Math.ceil(currentPage / pageGroupSize);
  console.log(currentGroup);

  // 그룹의 시작점 계산 === 다음 페이지 클릭 이동시 시작하는 페이지 번호 계산
  const start = (currentGroup - 1) * pageGroupSize + 1;
  console.log("start: ", start);
  // 그룹의 마지막 번호 계산
  const end = Math.min(currentGroup * pageGroupSize, totalPages);
  console.log("end: ", end);

  // 페이지 번호 배열 생성
  const pageNumbers = Array.from(
    { length: end - start + 1 },
    (_, i) => start + i
  );

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    // setQuery(String(page));
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, page },
      },
      undefined,
      { shallow: true }
    );
  };

  // 이전/다음 그룹으로 이동
  const handlePrevGroup = () => {
    const prevPage = Math.max(start - pageGroupSize, 1);
    handlePageChange(prevPage);
  };

  const handleNextGroup = () => {
    const nextPage = Math.min(end + 1, totalPages);
    handlePageChange(nextPage);
  };

  return (
    <S.Wrap>
      {/* 이전 그룹 버튼 */}
      {start > 1 && <S.Button onClick={handlePrevGroup}>이전</S.Button>}

      {/* 페이지 번호 버튼들 */}
      {pageNumbers.map((pageNum) => (
        <S.PageNum
          key={pageNum}
          onClick={() => handlePageChange(pageNum)}
          currentPage={currentPage}
          pageNum={pageNum}
        >
          {pageNum}
        </S.PageNum>
      ))}

      {/* 다음 그룹 버튼 */}
      {end < totalPages && <S.Button onClick={handleNextGroup}>다음</S.Button>}
    </S.Wrap>
  );
};

export default Pagination01;
