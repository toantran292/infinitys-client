"use client";
import { Post } from "../profile-page";

export default function PostList({ data }: { data: Post[] | null }) {
  const posts = data || [];

  return (
    <div className="mt-6 p-6 bg-white shadow-lg rounded-lg max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">
        📝 Bài viết
      </h3>
      {posts.length === 0 ? (
        <p className="text-gray-500 text-center">Chưa có bài viết nào.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="flex items-start gap-4 mb-6">
            {/* Thanh thời gian bên trái */}
            <div className="border-l-4 border-blue-500 pl-4">
              <small className="text-blue-600 font-semibold">
                {new Date(post.createdAt).toLocaleDateString()}
              </small>
            </div>

            {/* Nội dung bài viết */}
            <div className="p-4 bg-gray-50 rounded-lg shadow-md flex-1">
              <small className="text-gray-500 italic block mt-2">
                {new Date(post.createdAt).toLocaleTimeString()}
              </small>
              <p className="text-gray-800">{post.content}</p>
              <div className="mt-2 flex items-center justify-between text-gray-500 text-sm">
                <span>❤️ {post.reacts || 0} lượt thích</span>
                <span>💬 {post.comments?.length || 0} bình luận</span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
