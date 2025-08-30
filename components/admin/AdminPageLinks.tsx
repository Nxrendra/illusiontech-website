'use client';

import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { Button } from '@/components/ui/Button';
import { Globe } from 'lucide-react';
import { subNavServices } from '@/lib/data/services';

const mainLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Contact', href: '/contact' },
];

export default function AdminPageLinks() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span>View Site</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Main Pages</DropdownMenuLabel>
        {mainLinks.map((link) => (
          <DropdownMenuItem key={link.href} asChild>
            <Link href={link.href} target="_blank" rel="noopener noreferrer">{link.name}</Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Service Pages</DropdownMenuLabel>
        {subNavServices.map((service) => (
          <DropdownMenuItem key={service.link} asChild>
            <Link href={service.link} target="_blank" rel="noopener noreferrer">{service.name}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

