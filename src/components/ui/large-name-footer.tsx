"use client";
import Link from "next/link";

import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";

function Footer() {
  return (
    <footer className="py-12 px-4 md:px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:mb-0">
            <Link href="/" className="flex items-center gap-2">
              <Icons.logo className="icon-class w-8" />
              <h2 className="text-lg font-bold text-black">Carbon Credits</h2>
            </Link>

            <h1 className="text-black/80 mt-4">
              Build by{" "}
              <span className="text-black">
                <Link href="https://github.com/akshitasrivastava20">@Akshita Srivastava</Link>
              </span>
            </h1>
            
            <p className="text-sm text-black/60 mt-5">
              © {new Date().getFullYear()} CarbonCredits. All rights reserved.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4 text-black">Pages</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-black/70 hover:text-black">
                   About
                  </Link>
                </li>
                <li>
                  <Link href="/projects" className="text-black/70 hover:text-black">
                    Projects
                  </Link>
                </li>
                <li>
                  <Link href="/credits" className="text-black/70 hover:text-black">
                    Credits
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-black/70 hover:text-black">
                    Pricing
                  </Link>
                </li>
                
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-black">Socials</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="https://github.com/akshitasrivastava20" className="text-black/70 hover:text-black">
                    Github
                  </Link>
                </li>
                <li>
                  <Link href="www.linkedin.com/in/akshitasrivastava20-520822322" className="text-black/70 hover:text-black">
                    LinkedIn
                  </Link>
                </li>
               
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-black">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy-policy" className="text-black/70 hover:text-black">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/tos" className="text-black/70 hover:text-black">
                    Terms of Service
                  </Link>
                </li>
              
              </ul>
            </div>
          </div>
        </div>
        <div className=" w-full flex mt-4 items-center justify-center   ">
          <h3 className="text-center text-xl md:text-3xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-700 to-neutral-900 select-none">
            Empowering Green Investments
          </h3>
        </div>
      
      </div>
    </footer>
  );
}

export { Footer };
