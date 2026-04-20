"use client";

import { Button } from "@heroui/button";
import { ChevronDown, CloudUpload, Menu, X } from "lucide-react";
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/contextApi/UserProvider";

export default function Navbar() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser, isSignedIn, refetch } = useUserContext();

  const handleSignOut = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    await refetch();
    router.push("/");
  };

  const displayName = currentUser?.userName || "User";
  const initials = displayName[0]?.toUpperCase() || "U";
  const email = currentUser?.email || "";

  const NavLinks = () => (
    <div className="flex flex-col md:flex-row gap-4">
      {!isSignedIn ? (
        <>
          <Link href="/sign-in">
            <Button color="primary" className="bg-[#132946]" variant="flat" fullWidth>
              Sign In
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button color="primary" className="bg-[#006fee] text-white" variant="solid" fullWidth>
              Sign Up
            </Button>
          </Link>
        </>
      ) : (
        <>
          <Button onClick={() => router.push("/dashboard?tab=profile")} variant="flat" fullWidth>
            Profile
          </Button>
          <Button onClick={() => router.push("/dashboard")} variant="flat" fullWidth>
            My Files
          </Button>
          <Button onClick={handleSignOut} color="danger" variant="flat" fullWidth>
            Sign Out
          </Button>
        </>
      )}
    </div>
  );

  return (
    <header className="bg-default-50 border-b-[0.5px] border-default-200 sticky top-0 z-50 transition-shadow">
      <div className="container mx-auto py-3 md:py-4 px-4 md:px-6">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <CloudUpload className="h-6 w-6 text-[#006fee]" />
            <h1 className="text-xl font-bold">Droply</h1>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            {isSignedIn ? (
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="flat" className="p-0 bg-transparent">
                    <div className="flex items-center gap-2">
                      <Avatar name={initials} size="sm" />
                      <span>{displayName}</span>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem key="profile" onClick={() => router.push("/dashboard?tab=profile")}>
                    Profile
                  </DropdownItem>
                  <DropdownItem key="file" onClick={() => router.push("/dashboard")}>
                    My Files
                  </DropdownItem>
                  <DropdownItem key="logout" className="text-danger" color="danger" onClick={handleSignOut}>
                    Sign Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ) : (
              <NavLinks />
            )}
          </div>

          <div className="md:hidden flex items-center gap-3">
            {isSignedIn && <Avatar name={initials} size="sm" />}
            <button className="p-2" onClick={() => setMobileOpen(true)}>
              <Menu className="h-7 w-7" />
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-[#18181b]">
          <div className="h-full w-72 p-5 shadow-xl animate-slide-left">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium">Menu</h2>
              <button onClick={() => setMobileOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <NavLinks />
          </div>
        </div>
      )}
    </header>
  );
}
