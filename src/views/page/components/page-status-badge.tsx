interface PageStatusBadgeProps {
    status: string;
}

export function PageStatusBadge({ status }: PageStatusBadgeProps) {
    const getStatusClass = (status: string) => {
        switch (status) {
            case "approved":
                return "bg-green-100 text-green-700 border border-green-500";
            case "rejected":
                return "bg-red-100 text-red-700 border border-red-500";
            default:
                return "bg-yellow-100 text-yellow-700 border border-yellow-500";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "approved":
                return "Đã duyệt";
            case "rejected":
                return "Bị từ chối";
            default:
                return "Chờ duyệt";
        }
    };

    return (
        <span
            className={`px-4 py-1 rounded-full text-sm font-medium ${getStatusClass(status)}`}
        >
            {getStatusText(status)}
        </span>
    );
} 