interface HomeTabProps {
    page: {
        content: string;
        url: string;
        funding?: number;
    };
}

export function HomeTab({ page }: HomeTabProps) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Tổng quan</h2>
            <p className="text-gray-600">
                {page.content || "Chưa có mô tả về công ty này."}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Thông tin liên hệ</p>
                    <a
                        href={page.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                    >
                        {page.url}
                    </a>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Funding via Crunchbase</p>
                    <p className="text-lg font-semibold text-gray-800">
                        {page.funding ? `$${page.funding.toLocaleString()}` : "N/A"}
                    </p>
                </div>
            </div>
        </div>
    );
} 