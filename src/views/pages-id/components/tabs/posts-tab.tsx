interface PostsTabProps {
    posts?: Array<any>; // Thay any bằng type cụ thể của post
}

export function PostsTab({ posts = [] }: PostsTabProps) {
    if (!posts.length) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-500 text-center">Chưa có bài đăng.</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            {/* Render posts list here */}
        </div>
    );
} 