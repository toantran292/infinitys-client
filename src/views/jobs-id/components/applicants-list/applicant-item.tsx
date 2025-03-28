import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
interface ApplicantItemProps {
    applicant: {
        id: string;
        createdAt: string;
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
        };
    };
    profile?: any;
}

export function ApplicantItem({ applicant, profile }: ApplicantItemProps) {
    const router = useRouter();
    const appliedDate = new Date(applicant.createdAt).toLocaleDateString(
        "vi-VN",
        {
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );

    const avatarUrl = profile?.avatar?.url || "https://github.com/shadcn.png";

    return (
        <tr className="hover:bg-gray-50">
            <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarImage className="object-cover" src={avatarUrl} />
                        <AvatarFallback className="text-xl bg-gray-500 text-white">
                            {applicant.user.lastName.charAt(0)}
                            {applicant.user.firstName.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div onClick={() => router.push(`/profile/${applicant.user.id}`)}>
                        <p className="font-medium text-sm cursor-pointer hover:text-blue-500">
                            {applicant.user.lastName} {applicant.user.firstName}
                        </p>
                    </div>
                </div>
            </td>
            <td className="px-4 py-3 text-sm text-gray-600">
                {applicant.user.email}
            </td>
            <td className="px-4 py-3 text-sm text-gray-600">{appliedDate}</td>
        </tr>
    );
} 