import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <p className="text-sm font-medium text-link">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">페이지를 찾을 수 없습니다</h1>
      <p className="mt-3 text-muted-foreground">
        주소가 바뀌었거나 삭제된 페이지일 수 있습니다.
      </p>
      <Link href="/" className={`${buttonVariants({ size: "lg" })} mt-8`}>
        홈으로 돌아가기
      </Link>
    </div>
  );
}
