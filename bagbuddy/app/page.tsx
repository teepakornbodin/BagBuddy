import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col gap-6 w-full max-w-xs">
        <Link
          href="/register"
          className="w-full py-3 rounded-lg text-white text-lg font-semibold text-center transition bg-[#1F41BB] hover:bg-[#17337e] focus:outline-none focus:ring-2 focus:ring-[#1F41BB] focus:ring-offset-2"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Register
        </Link>
        <Link
          href="/login"
          className="w-full py-3 rounded-lg text-[#1F41BB] border border-[#1F41BB] text-lg font-semibold text-center transition bg-white hover:bg-[#f0f4ff] focus:outline-none focus:ring-2 focus:ring-[#1F41BB] focus:ring-offset-2"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Login
        </Link>
        <Link
          href="/shop_profile"
          className="w-full py-3 rounded-lg text-[#1F41BB] border border-[#1F41BB] text-lg font-semibold text-center transition bg-white hover:bg-[#eaf0fa] focus:outline-none focus:ring-2 focus:ring-[#1F41BB] focus:ring-offset-2"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Shop Profile
        </Link>
        <Link
          href="/location"
          className="w-full py-3 rounded-lg text-[#1F41BB] border border-[#1F41BB] text-lg font-semibold text-center transition bg-white hover:bg-[#eaf0fa] focus:outline-none focus:ring-2 focus:ring-[#1F41BB] focus:ring-offset-2"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Location
        </Link>
        <Link
          href="/Payment"
          className="w-full py-3 rounded-lg text-[#1F41BB] border border-[#1F41BB] text-lg font-semibold text-center transition bg-white hover:bg-[#eaf0fa] focus:outline-none focus:ring-2 focus:ring-[#1F41BB] focus:ring-offset-2"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Payment
        </Link>
      </div>
    </div>
  );
}
