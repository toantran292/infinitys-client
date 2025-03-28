import { JobDescriptionViewer } from "@/components/ui/editor/job-description-viewer";

interface JobDescriptionProps {
    description: string;
    author: {
        firstName: string;
        lastName: string;
    };
    createdAt: string;
}

export function JobDescription({ description, author, createdAt }: JobDescriptionProps) {
    const timeAgo = new Date(createdAt).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <JobDescriptionViewer content={description} />
            <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 text-right">
                    Được đăng bởi {author.lastName} {author.firstName} • {timeAgo}
                </p>
            </div>
        </div>
    );
} 