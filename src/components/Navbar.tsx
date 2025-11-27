"use client";

import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import { Button } from "@heroui/button";
import { ChevronDown, CloudUpload, Menu, X } from "lucide-react";
import { Avatar,Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserContext } from "@/contextApi/UserProvider";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { currentUser } = useUserContext();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isOnDashboard = pathname === "/dashboard" || pathname?.startsWith("/dashboard/");

  const userDetails = {
    fullName: currentUser
      ?
      `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim() :
      "",
    initials: currentUser
      ?
      `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`
      .trim()
      .split(" ")
      .map((name) => name?.[0] || "")
      .join("")
      .toUpperCase() || "U" :
      "U",
    displayName: currentUser ?
      currentUser?.firstName && currentUser?.lastName ?
      `${currentUser?.firstName} ${currentUser?.lastName}` :
      currentUser?.firstName ||
      currentUser?.userName ||
      currentUser?.emailAddress ||
      "User" :
      "User",
    email: currentUser?.emailAddress || ""
  };

  const NavLinks = () => (
    <div className="flex flex-col md:flex-row gap-4">

      <SignedOut>
        <Link href="/sign-in">
          <Button color="primary" variant="flat" fullWidth>
            Sign In
          </Button>
        </Link>

        <Link href="/sign-up">
          <Button color="primary" variant="solid" fullWidth>
            Sign Up
          </Button>
        </Link>
      </SignedOut>

      <SignedIn>
        {!isOnDashboard && (
          <Link href="/dashboard">
            <Button color="primary" variant="flat" fullWidth>
              Dashboard
            </Button>
          </Link>
        )}

        <Button
          onClick={() => router.push("/dashboard?tab=profile")}
          variant="flat"
          fullWidth
        >
          Profile
        </Button>

        <Button
          onClick={() => router.push("/dashboard")}
          variant="flat"
          fullWidth
        >
          My Files
        </Button>

        <Button
          onClick={() => signOut(() => router.push("/"))}
          color="danger"
          variant="flat"
          fullWidth
        >
          Sign Out
        </Button>
      </SignedIn>

    </div>
  );

  return (
    <header className="bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 
    border-b dark:border-slate-700 border-default-200 sticky top-0 z-50 transition-shadow">

      <div className="container mx-auto py-3 md:py-4 px-4 md:px-6">
        <div className="flex justify-between items-center">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <CloudUpload className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Droply</h1>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4">
            <SignedIn>
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="flat" className="p-0 bg-transparent">
                    <div className="flex items-center gap-2">
                      <Avatar
                        name={userDetails.initials}
                        size="sm"
                        src={currentUser?.imageUrl || undefined}
                      />
                      <span>{userDetails.displayName}</span>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </Button>
                </DropdownTrigger>

                <DropdownMenu>
                  <DropdownItem key='profile' onClick={() => router.push("/dashboard?tab=profile")}>
                    Profile
                  </DropdownItem>
                  <DropdownItem key='file' onClick={() => router.push("/dashboard")}>
                    My Files
                  </DropdownItem>
                  <DropdownItem
                    key='logout'
                    className="text-danger"
                    color="danger"
                    onClick={() => signOut(() => router.push("/"))}
                  >
                    Sign Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </SignedIn>

            <SignedOut>
              <NavLinks />
            </SignedOut>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <SignedIn>
              <Avatar
                name={userDetails.initials}
                size="sm"
                src={currentUser?.imageUrl || undefined}
              />
            </SignedIn>

            <button
              className="p-2"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-7 w-7" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Panel */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/40">
          <div className="bg-white dark:bg-slate-900 h-full w-72 p-5 shadow-xl animate-slide-left">
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
