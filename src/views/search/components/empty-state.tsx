import { Users } from "lucide-react";

interface EmptyStateProps {
    icon?: React.ReactNode;
    title?: string;
    description?: string;
}

export const EmptyState = ({
    icon = <Users className="w-12 h-12 text-[#666666]" />,
    title = "Không tìm thấy kết quả nào",
    description = "Thử tìm kiếm với từ khóa khác"
}: EmptyStateProps) => {
    return (
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-8 text-center">
            <div className="w-24 h-24 rounded-full bg-[#f3f6f8] flex items-center justify-center mx-auto mb-4">
                {icon}
            </div>
            <h3 className="text-[#191919] font-medium">{title}</h3>
            <p className="text-[#666666] text-sm mt-1">{description}</p>
        </div>
    );
}; 