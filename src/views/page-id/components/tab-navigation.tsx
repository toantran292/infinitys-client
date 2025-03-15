import { TabKey } from "../constants";

interface TabNavigationProps {
  tabs: ReadonlyArray<{ readonly key: TabKey; readonly label: string }>;
  currentTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export function TabNavigation({
  tabs,
  currentTab,
  onTabChange
}: TabNavigationProps) {
  return (
    <div className="flex border-b px-6">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`px-4 py-2 font-semibold relative transition-all duration-200
                        ${
                          currentTab === tab.key
                            ? "text-green-700 font-bold after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-green-700"
                            : "text-gray-600 hover:text-green-700 hover:font-semibold hover:after:content-[''] hover:after:absolute hover:after:left-0 hover:after:bottom-0 hover:after:w-full hover:after:h-[2px] hover:after:bg-green-700"
                        }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
