'use client'

import { SignedIn, SignedOut } from '@clerk/nextjs';
import { Button } from '@heroui/button';
import { ChevronDown, CloudUpload, Menu, User, X } from 'lucide-react';
import React from 'react'
import Link from 'next/link';
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const router = useRouter();
  return (
<header
      className={`bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 dark:border-slate-700 border-b border-default-200 sticky top-0 z-50 transition-shadow`}
    >
      <div className="container mx-auto py-3 md:py-4 px-4 md:px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 z-10">
            <CloudUpload className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Droply</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-4 items-center">
            {/* Show these buttons when user is signed out */}
            <SignedOut>
              <Link href="/sign-in">
                <Button variant="flat" color="primary">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button variant="solid" color="primary">
                  Sign Up
                </Button>
              </Link>
            </SignedOut>

            {/* Show these when user is signed in */}
            <SignedIn>
              <div className="flex items-center gap-4">
                {/* {!isOnDashboard && (
                  <Link href="/dashboard">
                    <Button variant="flat" color="primary">
                      Dashboard
                    </Button>
                  </Link>
                )} */}
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      variant="flat"
                      className="p-0 bg-transparent min-w-0"
                      endContent={<ChevronDown className="h-4 w-4 ml-2" />}
                    >
                      <div className="flex items-center gap-2">
                        <Avatar
                        //   name={userDetails.initials}
                          size="sm"
                        //   src={user?.imageUrl || undefined}
                          className="h-8 w-8 flex-shrink-0"
                          fallback={<User className="h-4 w-4" />}
                        />
                        <span className="text-default-600 hidden sm:inline">
                          {/* {userDetails.displayName} */}
                        </span>
                      </div>
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="User actions">
                    <DropdownItem
                      key="profile"
                    //   description={userDetails.email || "View your profile"}
                      onClick={() => router.push("/dashboard?tab=profile")}
                    >
                      Profile
                    </DropdownItem>
                    <DropdownItem
                      key="files"
                      description="Manage your files"
                      onClick={() => router.push("/dashboard")}
                    >
                      My Files
                    </DropdownItem>
                    <DropdownItem
                      key="logout"
                      description="Sign out of your account"
                      className="text-danger"
                      color="danger"
                    //   onClick={handleSignOut}
                    >
                      Sign Out
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <SignedIn>
              <Avatar
                // name={userDetails.initials}
                size="sm"
                // src={user?.imageUrl || undefined}
                className="h-8 w-8 flex-shrink-0"
                fallback={<User className="h-4 w-4" />}
              />
            </SignedIn>
            <button
              className="z-50 p-2"
            //   onClick={toggleMobileMenu}
            //   aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              data-menu-button="true"
            >
              {/* {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-default-700" />
              ) : (
                <Menu className="h-6 w-6 text-default-700" />
              )} */}
            </button>
          </div>

          {/* Mobile Menu Overlay */}
          {/* {isMobileMenuOpen && (
            <div
              className="fixed inset-0 bg-black/20 z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />
          )} */}

            {/* todo */}
            {/* mobile  */}
        </div>
      </div>
    </header>
  )
}
