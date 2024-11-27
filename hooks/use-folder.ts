import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useFolders() {
  const { data, error, isLoading, mutate } = useSWR("/api/folders", fetcher);

  return {
    folders: data,
    isLoading,
    error,
    mutate, // データの再フェッチ用
  };
}
