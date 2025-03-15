interface PeopleTabProps {
    people?: Array<any>; // Thay any bằng type cụ thể của person
}

export function PeopleTab({ people = [] }: PeopleTabProps) {
    if (!people.length) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-500 text-center">Chưa có nhân viên.</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            {/* Render people list here */}
        </div>
    );
} 