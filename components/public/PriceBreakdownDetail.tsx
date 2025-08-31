'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { SerializedBreakdownWithService } from '@/lib/actions/priceBreakdown.actions';
import { Download, Tag, Clock } from 'lucide-react';
import { Button } from '../ui/Button';
import Link from 'next/link';

interface PriceBreakdownDetailProps {
  breakdown: SerializedBreakdownWithService;
}

export function PriceBreakdownDetail({ breakdown }: PriceBreakdownDetailProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      <main id="print-area" className="container mx-auto max-w-4xl py-12 sm:py-24 px-4 pb-32">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{breakdown.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">{breakdown.summary}</p>
          <Link href="/services" className="text-accent hover:underline mt-2 inline-block">
            Related Service: {breakdown.serviceId.name}
          </Link>
        </header>

        {/* Meta Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-card p-6 rounded-lg border border-border text-center"><Tag className="mx-auto h-8 w-8 text-accent mb-2" /><h3 className="text-lg font-semibold text-card-foreground">Price Range</h3><p className="text-2xl font-bold text-muted-foreground">{breakdown.priceRange}</p></div>
          <div className="bg-card p-6 rounded-lg border border-border text-center"><Clock className="mx-auto h-8 w-8 text-accent mb-2" /><h3 className="text-lg font-semibold text-card-foreground">Estimated Timeframe</h3><p className="text-2xl font-bold text-muted-foreground">{breakdown.timeframe}</p></div>
        </div>

        <div className="space-y-8">
          {breakdown.sections.map((section, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
                {section.idealFor && <CardDescription className="text-accent font-medium">Ideal for: {section.idealFor}</CardDescription>}
              </CardHeader>
              <CardContent className="space-y-4">
                {section.description && <p className="text-muted-foreground">{section.description}</p>}
                <div className="mt-6">
                  <h3 className="text-xl font-medium text-card-foreground mb-4 border-b border-border pb-2">Features & Items</h3>
                  <div className="space-y-4">
                    {section.items.map((item) => (
                      <div key={item.name} className="flex justify-between items-start py-2">
                      <div>
                          <p className="font-medium text-foreground">{item.name}</p>
                          {item.description && <p className="text-sm text-muted-foreground mt-1 max-w-prose">{item.description}</p>}
                      </div>
                        <p className="font-semibold text-foreground whitespace-nowrap ml-4">{item.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 p-4 flex justify-end items-baseline">
                <span className="text-lg font-semibold text-muted-foreground mr-4">Section Total:</span>
                <span className="text-2xl font-bold text-accent">{section.totalPrice}</span>
              </CardFooter>
            </Card>
          ))}
        </div>

        {breakdown.notes && (
          <div className="mt-12 bg-muted p-6 rounded-lg border border-border">
            <h2 className="text-xl font-semibold mb-2">Additional Notes</h2>
            <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap">
              {breakdown.notes}
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-border p-3 no-print z-40">
        <div className="container mx-auto flex items-center justify-end">
          <Button onClick={handlePrint}>
            <Download className="mr-2 h-4 w-4" />
            Download as PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
