interface PageHeaderProps {
  page: {
    banner?: { url: string };
    avatar?: { url: string };
    name: string;
    content?: string;
    address?: string;
  };
  children?: React.ReactNode;
}

export function PageHeader({ page, children }: PageHeaderProps) {
  return (
    <>
      <div className="relative">
        {page.banner?.url ? (
          <div
            className="h-40 w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${page.banner?.url})` }}
          />
        ) : (
          <div className="h-40 w-full bg-gradient-to-r from-[#004182] to-[#0077b5] rounded-lg" />
        )}

        <div className="absolute -bottom-10 left-6 bg-white p-2 rounded-full border border-gray-200">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
            <img
              src={page.avatar?.url || "/default-avatar.png"}
              alt={page.name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="p-6 pt-12">
        <h1 className="text-2xl font-bold">{page.name}</h1>
        <p className="text-gray-600">{page.content || "Không có nội dung"}</p>
        <p className="text-gray-500 mt-1">{page.address}</p>
        {children}
      </div>
    </>
  );
}
