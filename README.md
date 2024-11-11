## Hybrid-Rendering 사용
이전 Next.js-pagination-querystring-SSR에서 페이지 이동 마다 SSR로 처리를 했습니다. <br>
하지만 장점도 있지만 해당 게시물의 페이지 이동은 적합하지 못하다 생각하여 페이지 이동은 CSR로 처리를 하고 나머지 SSR로 처리를 하도록 했습니다. <br>
> SSR 처리에는 다음과 같습니다.
1. 첫 페이지 접속 시 SSR를 통해 SEO 조건 챙기기
2. URL을 직접 입력을 통해 접속 + 주소 공유 시 og 태그 사용하기

> CSR 처리에는 다음과 같습니다.
1. 페이지 전환에 있어 서버 부하 감소 및 화면 깜박임 없습니다.


## SSR 요청 함수
```bash
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
```
SSR로 초기 값 1 페이지의 데이터를 가져오고 context.query.page의 값이 있으면 해당 page의 데이터를 가져옵니다. <br>

## Pagination 함수 - router.push / shallow: true
```bash
const handlePageChange = (page: number) => {
  router.push(
    {
      pathname: router.pathname,
      query: { ...router.query, page },
    },
    undefined,
    { shallow: true }
  );
};
```
useRouter를 통해 페이지 이동을 하는데 그렇게 되면 페이지 전체가 리렌더링 되어 위와같이 사용을 했습니다. <br>
shallow: true 옵션을 사용을 해 해당 url만 수정을 하고 이후 useEffect로 해당 router.query.page의 값이 변경이 되면, <br>
즉 의존성 배열에 의해 실행하도록 했습니다.
```bash
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
```

> 정리
1. 페이지 초기 접속 및 url 직접 입력을 통해 접속(?page=3 등)으로 완전한 HTML 제공 받을 수 있어 초기 로딩이 빠르며 소셜 공유 시 OG 태그로 요약된 정보를 노출할 수 있습니다.
2. 페이지 이동을 CSR로 처리를 해 서버에 부하 감소와 SPA로 부분적 렌더링으로 화면 깜바임 없으며 부드럽게 페이지 전환이 가능합니다.
