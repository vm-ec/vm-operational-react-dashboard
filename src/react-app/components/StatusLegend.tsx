export function StatusLegend() {
  const legendItems = [
    { color: 'bg-green-500', label: 'Running (2xx & fast)', bgColor: 'bg-green-50', textColor: 'text-green-700' },
    { color: 'bg-yellow-500', label: 'Not certain (slow / borderline)', bgColor: 'bg-yellow-50', textColor: 'text-yellow-700' },
    { color: 'bg-red-500', label: 'Down (error / timeout)', bgColor: 'bg-red-50', textColor: 'text-red-700' },
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {legendItems.map((item) => (
        <div
          key={item.label}
          className={`inline-flex items-center gap-2 px-3 py-2 ${item.bgColor} rounded-full text-sm border border-gray-200`}
        >
          <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
          <span className={`font-medium ${item.textColor}`}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
