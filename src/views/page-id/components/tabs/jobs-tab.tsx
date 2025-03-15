interface JobsTabProps {
  jobs?: Array<any>;
}

export function JobsTab({ jobs = [] }: JobsTabProps) {
  if (!jobs.length) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-500 text-center">Chưa có việc làm.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Render jobs list here */}
    </div>
  );
}
