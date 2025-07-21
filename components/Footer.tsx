export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="container py-6 text-center text-gray-500">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} IllusionTech. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}