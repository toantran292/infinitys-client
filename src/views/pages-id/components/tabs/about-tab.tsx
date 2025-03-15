interface AboutTabProps {
    page: {
        content: string;
        industry?: string;
        size?: string;
        address?: string;
        founded?: string;
    };
}

export function AboutTab({ page }: AboutTabProps) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Tổng quan</h2>
            <p className="text-gray-600">{page.content}</p>
            {page.industry && <p className="text-gray-500 mt-2">🌍 {page.industry}</p>}
            {page.size && <p className="text-gray-500">🏢 {page.size} nhân viên</p>}
            {page.address && <p className="text-gray-500">📍 {page.address}</p>}
            {page.founded && <p className="text-gray-500">📆 Thành lập: {page.founded}</p>}
        </div>
    );
} 