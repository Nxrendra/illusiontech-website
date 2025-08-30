import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Separator } from '@/components/ui/Separator';
import { IPriceBreakdownData } from '@/lib/models/PriceBreakdown';
import { CheckCircle } from 'lucide-react';
import { PrintButton } from './PrintButton';

interface PriceBreakdownDetailProps {
  breakdown: IPriceBreakdownData & { _id: string };
}

export function PriceBreakdownDetail({ breakdown }: PriceBreakdownDetailProps) {
  return (
    <div className="bg-background text-foreground">
      <div id="print-area" className="container mx-auto max-w-4xl py-12 sm:py-24 px-4">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{breakdown.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">{breakdown.summary}</p>
          <div className="mt-6 flex justify-center items-center gap-x-8 gap-y-2 flex-wrap">
            <div className="font-semibold">{breakdown.priceRange}</div>
            <div className="hidden sm:block w-px h-5 bg-border"></div>
            <div className="font-semibold">{breakdown.timeframe}</div>
          </div>
        </header>

        <PrintButton />

        <div className="space-y-8">
          {breakdown.sections.map((section, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
                {section.idealFor && <CardDescription>Ideal for: {section.idealFor}</CardDescription>}
              </CardHeader>
              <CardContent className="space-y-4">
                {section.description && <p className="text-muted-foreground">{section.description}</p>}
                <ul className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-4">
                      <CheckCircle className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                      <div>
                        <div className="flex justify-between items-baseline">
                          <span className="font-semibold">{item.name}</span>
                          <span className="text-sm font-mono text-muted-foreground">{item.price}</span>
                        </div>
                        {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="bg-muted/50 p-4 flex justify-end">
                <div className="text-lg font-bold">Total: {section.totalPrice}</div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {breakdown.notes && (
          <div className="mt-12">
            <Separator />
            <div className="mt-8 p-4 bg-muted/50 border rounded-lg">
              <h4 className="font-semibold mb-2">✅ Note:</h4>
              <p className="text-muted-foreground whitespace-pre-wrap">{breakdown.notes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
