interface NotificationProps {
  message: string;
  time: string;
  status?: 'danger' | 'waiting' | 'confirmed';
  className?: string;
}

export default function Notification({
  message,
  time,
  status = 'confirmed',
  className = ''
}: NotificationProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'danger':
        return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
      case 'waiting':
        return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'confirmed':
        return 'border-l-green-500 bg-green-50 dark:bg-green-900/20';
      default:
        return 'border-l-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <div
      className={`p-4 border-l-4 rounded-r-lg ${getStatusColor()} ${className}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {message}
          </p>
        </div>
        <div className="ml-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">{time}</p>
        </div>
      </div>
    </div>
  );
}
