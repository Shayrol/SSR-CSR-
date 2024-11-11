import Head from "next/head";
import { GetServerSidePropsContext } from "next";
import * as S from "../styles/index.styles";
import Pagination01 from "@/src/components/pagination/01/pagination";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface Meta {
  title: string;
  description: string;
}

interface IProps {
  data: Post[];
  pageMeta: Meta;
  pagination: {
    currentPage: number;
    totalPages: number;
  };
}

interface IPage {
  currentPage: number;
  totalPages: number;
}

function HybridPage({ data: initialData, pageMeta }: IProps) {
  const router = useRouter();
  const page = Number(router.query.page) || 1;
  const limit = 5;
  const start = (page - 1) * limit;
  const totalCount = 100; // 전체 게시물 개수
  const totalPages = Math.ceil(totalCount / limit);

  const pagination: IPage = {
    currentPage: page,
    totalPages,
  };

  // SSR 초기 데이터를 상태로 설정하고 CSR 데이터가 로드되면 덮어쓰기
  const [data, setData] = useState<Post[]>(initialData);

  const isFirstMount = useRef(true); // 첫 마운트 여부 추적

  useEffect(() => {
    // 첫 마운트 시에는 실행하지 않음
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    // CSR로 페이지가 변경될 때만 새로운 데이터를 불러옴
    const fetchData = async () => {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_start=${start}&_limit=${limit}`
      );
      const data = await res.json();
      setData(data);
    };
    fetchData();
    console.log("실행: CSR");
  }, [router.query.page, start]);

  return (
    <S.Wrap>
      <Head>
        <title>{pageMeta.title}</title>
        <meta name="description" content={pageMeta.description} />
      </Head>
      <S.BoardsWrap>
        <S.Boards>
          {data.map((el) => (
            <S.Board key={el.id}>
              <S.Title className="text-xl pb-[2px] font-semibold">
                {el.title}
              </S.Title>
              <S.Body className="w-[900px] overflow-hidden whitespace-nowrap truncate">
                {el.body}
              </S.Body>
              <S.UserId className="text-xs text-gray-400">
                userId: {el.userId}
              </S.UserId>
            </S.Board>
          ))}
        </S.Boards>
        <Pagination01 pagination={pagination} />
      </S.BoardsWrap>
    </S.Wrap>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const page = Number(context.query.page) || 1;
  const limit = 5;
  const start = (page - 1) * limit;
  const totalCount = 100; // 전체 게시물 개수
  const totalPages = Math.ceil(totalCount / limit);

  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_start=${start}&_limit=${limit}`
  );
  const data = await res.json();

  return {
    props: {
      data,
      pageMeta: {
        title: `Page ${page} - SSR Test`,
        description: `Displaying page ${page} of posts`,
      },
      pagination: {
        currentPage: page,
        totalPages,
      },
    },
  };
}

export default HybridPage;
