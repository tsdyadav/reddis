"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "../ui/button";
import ReddishLogo from "@/images/Reddish Full.png";
import ReddishLogoOnly from "@/images/Reddish Logo Only.png";
import { ChevronLeftIcon, MenuIcon, SearchIcon } from "lucide-react";
import Image from "next/image";
import { useSidebar } from "../ui/sidebar";
import CreatePost from "../post/CreatePost";
import { ThemeToggle } from "./ThemeToggle";
import Link from "next/link";

function Header() {
  const { toggleSidebar, open, isMobile } = useSidebar();

  return (
    <header className="flex items-center justify-between p-4 border-b border-border">
      {/* Left Side */}
      <div className="h-10 flex items-center gap-2">
        <MenuIcon 
          className="w-6 h-6 cursor-pointer hover:text-primary transition-colors" 
          onClick={toggleSidebar} 
        />
        <Link href="/">
          <Image
            src={ReddishLogo}
            alt="logo"
            width={150}
            height={150}
            className={`hidden md:block transition-opacity duration-300 ${open ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}
          />
          <Image
            src={ReddishLogoOnly}
            alt="logo"
            width={40}
            height={40}
            className={`block md:hidden transition-opacity duration-300 ${open ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}
          />
        </Link>
      </div>

      {/* Middle - Search on mobile */}
      <div className="md:hidden">
        <Link href="/search">
          <Button variant="ghost" size="icon">
            <SearchIcon className="h-5 w-5" />
          </Button>
        </Link>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <CreatePost />

        <SignedIn>
          <UserButton />
        </SignedIn>

        <SignedOut>
          <Button asChild variant="outline">
            <SignInButton mode="modal" />
          </Button>
        </SignedOut>
      </div>
    </header>
  );
}

export default Header;
