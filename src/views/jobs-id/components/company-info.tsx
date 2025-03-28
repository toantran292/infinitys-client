import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Page } from "@/types/job";
import { useRouter } from "next/navigation";

interface CompanyInfoProps {
    page?: Page;
}

export function CompanyInfo({ page }: CompanyInfoProps) {
    const router = useRouter();

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-base font-semibold mb-4">
                Thông tin công ty
            </h2>
            <div
                className="flex items-center gap-3 mb-4 cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
                onClick={() => router.push(`/page/${page?.id}`)}
            >
                <Avatar className="w-12 h-12 relative rounded-lg overflow-hidden">
                    <AvatarImage className="object-cover" src={page?.avatar?.url} />
                    <AvatarFallback className="text-xl bg-gray-500 text-white">
                        {page?.name?.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="font-medium text-blue-600 hover:underline">
                        {page?.name || "Tên công ty"}
                    </h3>
                    <p className="text-sm text-gray-600">
                        {page?.address || "Địa chỉ công ty"}
                    </p>
                </div>
            </div>
            <div className="space-y-3 text-sm">
                {page?.url && (
                    <p className="break-all">
                        <a
                            href={page?.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline inline-block max-w-full overflow-hidden text-ellipsis"
                        >
                            {page?.url}
                        </a>
                    </p>
                )}
            </div>
        </div>
    );
} 