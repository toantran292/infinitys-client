import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Mail, Users } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";

export const LeftSideInfo = () => {
  const { user } = useAuth();

  return (
    <Link
      href={`/profile/${user?.id}`}
      className="block transition-transform hover:-translate-y-0.5"
    >
      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative h-[80px] bg-gradient-to-r from-blue-100 to-cyan-100"></div>

        <div className="px-3 pb-3">
          <div className="flex justify-between items-end -mt-[30px] mb-2">
            <Avatar className="h-[60px] w-[60px] border-2 border-white">
              <AvatarImage className="object-cover" src={user?.avatar?.url} />
              <AvatarFallback className="text-xl bg-gray-500 text-white">
                {user?.firstName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="space-y-1">
            <h1 className="text-sm font-bold text-gray-900 truncate">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-xs text-gray-600 truncate">
              {"Software Engineer"}
            </p>

            <div className="flex flex-col gap-1 text-[11px] text-gray-500">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate">Cần Thơ, Việt Nam</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                <span className="truncate" title={user?.email}>
                  {user?.email}
                </span>
              </div>
            </div>

            <div className="mt-2 flex items-center gap-1 text-[11px]">
              <div className="flex items-center gap-0.5">
                <Users className="h-3 w-3" />
                <span className="font-semibold">78</span>
                <span className="text-gray-500">kết nối</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
