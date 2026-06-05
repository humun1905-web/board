import { Badge } from "@/components/ui/badge";

const categoryColors: Record<string, string> = {
  공지사항: "bg-red-100 text-red-700 hover:bg-red-100",
  자유게시판: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  질문게시판: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
  정보공유: "bg-green-100 text-green-700 hover:bg-green-100",
};

interface CategoryBadgeProps {
  category: string;
}

export default function CategoryBadge({ category }: CategoryBadgeProps) {
  const colorClass = categoryColors[category] ?? "bg-gray-100 text-gray-700 hover:bg-gray-100";
  return (
    <Badge variant="secondary" className={`text-xs font-medium ${colorClass}`}>
      {category}
    </Badge>
  );
}
