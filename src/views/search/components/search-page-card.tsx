import { Building2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { PageSearchResult } from "../types";

interface PageCardProps {
    page: PageSearchResult;
}

export const PageCard = ({ page }: PageCardProps) => {
    return (
        <div className="p-4 hover:bg-[#f9fafb]">
            <div className="flex gap-4">
                <div className="flex-shrink-0">
                    <Avatar className="h-16 w-16">
                        <AvatarImage
                            src={page.avatar?.url}
                            alt={page.name}
                            className="object-cover"
                        />
                        <AvatarFallback className="bg-[#f3f6f8] text-[#666666] text-xl">
                            {page.name?.[0]}
                        </AvatarFallback>
                    </Avatar>
                </div>
                <div>
                    <h3 className="text-[#191919] font-medium hover:text-[#0a66c2] hover:underline">
                        {page.name}
                    </h3>
                    <p className="text-[#666666] text-sm mt-1">
                        {page.address}
                    </p>
                    {page.content && (
                        <p className="text-[#666666] text-sm mt-2 line-clamp-2">
                            {page.content}
                        </p>
                    )}
                    <a
                        href={page.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center mt-3 text-sm text-[#0a66c2] font-medium hover:underline"
                    >
                        Truy cập trang
                        <Building2 className="ml-1 w-4 h-4" />
                    </a>
                </div>
            </div>
        </div>
    );
}; 