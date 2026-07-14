export default function StatsCard({
  title,
  value,
  color,
}) {
  return (
    <div
      className={`${color} rounded-2xl shadow-lg p-6 text-white`}
    >
      <p className="text-sm opacity-90">
        {title}
      </p>

      <h2 className="text-3xl font-bold mt-3">
        {value}
      </h2>
    </div>
  );
}