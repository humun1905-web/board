import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PenSquare } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity">
          공인검사실 소통게시판
        </Link>
        <Link href="/posts/new">
          <Button size="sm" className="gap-1.5">
            <PenSquare className="h-4 w-4" />
            글쓰기
          </Button>
        </Link>
      </div>
    </header>
  );
}
