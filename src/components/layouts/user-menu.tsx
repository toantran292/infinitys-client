import { Building2, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/providers/auth-provider";

export function UserMenu() {
  const { signOut, user } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Avatar className="bg-gray-500 text-white">
          <AvatarImage
            className="object-cover"
            src={user?.avatar?.url}
            alt="@shadcn"
          />
          <AvatarFallback>{user?.firstName.charAt(0)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white">
        <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User />
            <Link href={`/profile/${user?.id}`}>Hồ sơ cá nhân</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Building2 />
            <Link href={`/page`}>Trang công ty</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings />
            <span>Cài đặt</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
