import styled from "@emotion/styled";

export const Wrap = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const BoardsWrap = styled.div`
  width: 1200px;
`;

export const Boards = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-bottom: 8px;
`;

export const Board = styled.div`
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

export const Title = styled.div`
  font-size: 1.25rem; /* text-xl */
  padding-bottom: 2px; /* pb-[2px] */
  font-weight: 600; /* font-semibold */
`;

export const Body = styled.p`
  width: 900px; /* w-[900px] */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis; /* truncate */
`;

export const UserId = styled.div`
  font-size: 0.75rem; /* text-xs */
  color: #9ca3af; /* text-gray-400 */
`;
