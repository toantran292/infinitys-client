import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    total: number;
    take: number;
    onPrevPage: () => void;
    onNextPage: () => void;
    onPageChange: (page: number) => void;
}

export function Pagination({
    currentPage,
    totalPages,
    total,
    take,
    onPrevPage,
    onNextPage,
    onPageChange
}: PaginationProps) {
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;
        const halfVisible = Math.floor(maxVisiblePages / 2);

        // Always show first page
        pageNumbers.push(1);

        let startPage = Math.max(2, currentPage - halfVisible);
        let endPage = Math.min(totalPages - 1, currentPage + halfVisible);

        // Adjust start and end if we're near the edges
        if (currentPage <= halfVisible + 1) {
            endPage = Math.min(maxVisiblePages - 1, totalPages - 1);
        } else if (currentPage >= totalPages - halfVisible) {
            startPage = Math.max(2, totalPages - maxVisiblePages + 1);
        }

        // Add dots after first page if needed
        if (startPage > 2) {
            pageNumbers.push("...");
        }

        // Add middle pages
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        // Add dots before last page if needed
        if (endPage < totalPages - 1) {
            pageNumbers.push("...");
        }

        // Always show last page if there is more than one page
        if (totalPages > 1) {
            pageNumbers.push(totalPages);
        }

        return pageNumbers;
    };

    return (
        <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-2">
                <p className="text-sm text-gray-700">
                    Hiển thị{" "}
                    <span className="font-medium">
                        {(currentPage - 1) * take + 1}
                    </span>{" "}
                    đến{" "}
                    <span className="font-medium">
                        {Math.min(currentPage * take, total)}
                    </span>{" "}
                    trong <span className="font-medium">{total}</span> ứng viên
                </p>
            </div>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onPrevPage}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1">
                    {getPageNumbers().map((pageNumber, index) =>
                        pageNumber === "..." ? (
                            <span key={`dots-${index}`} className="px-2">
                                {pageNumber}
                            </span>
                        ) : (
                            <Button
                                key={pageNumber}
                                variant={
                                    pageNumber === currentPage ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => onPageChange(pageNumber as number)}
                                className="min-w-[32px] text-white"
                            >
                                {pageNumber}
                            </Button>
                        )
                    )}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onNextPage}
                    disabled={currentPage === totalPages}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
} 