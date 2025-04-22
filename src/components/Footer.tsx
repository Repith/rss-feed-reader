export function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-4 mt-auto">
      <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
        &copy; {new Date().getFullYear()} RSS Reader.
        All rights reserved.
      </div>
    </footer>
  );
}