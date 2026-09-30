import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = { title: "로그인" };

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">로그인 / 가입</CardTitle>
          <CardDescription>
            이메일을 입력하면 로그인 링크를 보내드립니다. 비밀번호는 필요 없습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <LoginForm />
          <p className="text-xs text-muted-foreground">
            수집하는 개인정보는 이메일 주소뿐이며, 로그인과 북마크·좋아요 저장에만
            사용합니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
