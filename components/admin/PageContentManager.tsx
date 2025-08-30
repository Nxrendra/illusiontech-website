'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { toast } from 'sonner';
import { Loader2, PlusCircle, Save, Trash2 } from 'lucide-react';
import { IPageContentData } from '@/lib/models/PageContent';
import OptionListManagement from './OptionListManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/Accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { iconNames } from '@/lib/get-icon';

interface PageContentManagerProps {
  initialContent: IPageContentData;
}

type ObjectArrayKey = 'coreBeliefs' | 'futureGoals' | 'homeWhyChooseUsPoints' | 'milestones' | 'principles' | 'processSteps' | 'digitalKnowledgeBase';

export default function PageContentManager({ initialContent }: PageContentManagerProps) {
  const [formData, setFormData] = useState<IPageContentData>(initialContent);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (listName: 'projectTimelines' | 'maintenanceContractLengths', index: number, field: 'value' | 'label', value: string) => {
    const list = [...(formData[listName] as { value: string; label: string }[] || [])];
    list[index] = { ...list[index], [field]: value };
    setFormData(prev => ({ ...prev, [listName]: list }));
  };

  const handleAddOption = (listName: 'projectTimelines' | 'maintenanceContractLengths') => {
    setFormData(prev => ({ ...prev, [listName]: [...(prev[listName] as any[] || []), { value: '', label: '' }] }));
  };

  const handleRemoveOption = (listName: 'projectTimelines' | 'maintenanceContractLengths', index: number) => {
    setFormData(prev => ({ ...prev, [listName]: (prev[listName] as any[] || []).filter((_, i) => i !== index) }));
  };

  const handleObjectArrayChange = (arrayName: ObjectArrayKey, index: number, field: string, value: string | number) => {
    const newArray = [...(formData[arrayName] as any[] || [])];
    newArray[index] = { ...newArray[index], [field]: value };
    setFormData(prev => ({ ...prev, [arrayName]: newArray }));
  };

  const addArrayItem = (arrayName: ObjectArrayKey) => {
    let newItem: any;
    switch (arrayName) {
      case 'coreBeliefs':
      case 'futureGoals':
      case 'homeWhyChooseUsPoints':
      case 'principles':
      case 'digitalKnowledgeBase':
        newItem = { icon: 'Zap', title: '', description: '' };
        break;
      case 'milestones':
        newItem = { icon: 'Star', value: 0, suffix: '', label: '' };
        break;
      case 'processSteps':
        newItem = { step: '01', title: '', description: '', icon: 'Search' };
        break;
      default:
        // This should not happen with TypeScript, but as a fallback:
        newItem = {};
    }
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...(prev[arrayName] as any[] || []), newItem],
    }));
  };

  const removeArrayItem = (arrayName: ObjectArrayKey, index: number) => {
    setFormData(prev => ({ ...prev, [arrayName]: (prev[arrayName] || []).filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save content.');
      }

      toast.success('Page content updated successfully!');
      setFormData(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Tabs defaultValue="home" className="space-y-4">
      <TabsList className="grid w-full grid-cols-3 bg-muted/80">
        <TabsTrigger value="home">Home Page</TabsTrigger>
        <TabsTrigger value="contact">Contact Page</TabsTrigger>
        <TabsTrigger value="about">About Page</TabsTrigger>
      </TabsList>
      <form onSubmit={handleSubmit}>
        <TabsContent value="home" className="mt-0">
          <div className="p-6 bg-background rounded-lg border">
            <h2 className="text-2xl font-bold mb-6 text-primary">Home Page Content</h2>
            <Accordion type="multiple" className="w-full space-y-4">
              <AccordionItem value="meta">
                <AccordionTrigger>Meta / SEO</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-2"><Label htmlFor="homeMetaTitle">Meta Title</Label><Input id="homeMetaTitle" name="homeMetaTitle" value={formData.homeMetaTitle || ''} onChange={handleInputChange} /></div>
                  <div className="space-y-2"><Label htmlFor="homeMetaDescription">Meta Description</Label><Textarea id="homeMetaDescription" name="homeMetaDescription" value={formData.homeMetaDescription || ''} onChange={handleInputChange} /></div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="hero">
                <AccordionTrigger>Hero Section</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-2"><Label htmlFor="homeHeroHeading">Heading</Label><Input id="homeHeroHeading" name="homeHeroHeading" value={formData.homeHeroHeading || ''} onChange={handleInputChange} /></div>
                  <div className="space-y-2"><Label htmlFor="homeHeroSubheading">Subheading</Label><Textarea id="homeHeroSubheading" name="homeHeroSubheading" value={formData.homeHeroSubheading || ''} onChange={handleInputChange} /></div>
                  <div className="space-y-2"><Label htmlFor="homeHeroCtaButtonText">CTA Button Text</Label><Input id="homeHeroCtaButtonText" name="homeHeroCtaButtonText" value={formData.homeHeroCtaButtonText || ''} onChange={handleInputChange} /></div>
                  <div className="space-y-2"><Label htmlFor="homeHeroSecondaryButtonText">Secondary Button Text</Label><Input id="homeHeroSecondaryButtonText" name="homeHeroSecondaryButtonText" value={formData.homeHeroSecondaryButtonText || ''} onChange={handleInputChange} /></div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="why-us">
                <AccordionTrigger>Why Choose Us Section</AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                  <div className="space-y-2"><Label htmlFor="homeWhyChooseUsHeading">Heading</Label><Input id="homeWhyChooseUsHeading" name="homeWhyChooseUsHeading" value={formData.homeWhyChooseUsHeading || ''} onChange={handleInputChange} /></div>
                  <div className="space-y-2"><Label htmlFor="homeWhyChooseUsSubheading">Subheading</Label><Textarea id="homeWhyChooseUsSubheading" name="homeWhyChooseUsSubheading" value={formData.homeWhyChooseUsSubheading || ''} onChange={handleInputChange} /></div>
                  <div className="space-y-2"><Label htmlFor="homeWhyChooseUsCtaButtonText">CTA Button Text</Label><Input id="homeWhyChooseUsCtaButtonText" name="homeWhyChooseUsCtaButtonText" value={formData.homeWhyChooseUsCtaButtonText || ''} onChange={handleInputChange} /></div>
                  <h4 className="font-semibold pt-4 border-t">Points</h4>
                  {(formData.homeWhyChooseUsPoints || []).map((point, index) => (
                    <div key={index} className="p-4 border rounded-md space-y-3 relative">
                      <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeArrayItem('homeWhyChooseUsPoints', index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      <div className="space-y-2"><Label>Icon</Label><Select value={point.icon} onValueChange={(val) => handleObjectArrayChange('homeWhyChooseUsPoints', index, 'icon', val)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{iconNames.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}</SelectContent></Select></div>
                      <div className="space-y-2"><Label>Title</Label><Input value={point.title} onChange={(e) => handleObjectArrayChange('homeWhyChooseUsPoints', index, 'title', e.target.value)} /></div>
                      <div className="space-y-2"><Label>Description</Label><Textarea value={point.description} onChange={(e) => handleObjectArrayChange('homeWhyChooseUsPoints', index, 'description', e.target.value)} /></div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('homeWhyChooseUsPoints')}><PlusCircle className="mr-2 h-4 w-4" /> Add Point</Button>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="parallax-1">
                <AccordionTrigger>Parallax Section 1</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-2"><Label htmlFor="homeParallax1Heading">Heading</Label><Input id="homeParallax1Heading" name="homeParallax1Heading" value={formData.homeParallax1Heading || ''} onChange={handleInputChange} /></div>
                  <div className="space-y-2"><Label htmlFor="homeParallax1Subheading">Subheading</Label><Textarea id="homeParallax1Subheading" name="homeParallax1Subheading" value={formData.homeParallax1Subheading || ''} onChange={handleInputChange} /></div>
                  <div className="space-y-2"><Label htmlFor="homeParallax1CtaButtonText">CTA Button Text</Label><Input id="homeParallax1CtaButtonText" name="homeParallax1CtaButtonText" value={formData.homeParallax1CtaButtonText || ''} onChange={handleInputChange} /></div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="services-preview">
                <AccordionTrigger>Services Preview Section</AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                  <div className="space-y-2"><Label htmlFor="homeServicesPreviewHeading">Heading</Label><Input id="homeServicesPreviewHeading" name="homeServicesPreviewHeading" value={formData.homeServicesPreviewHeading || ''} onChange={handleInputChange} /></div>
                  <div className="space-y-2"><Label htmlFor="homeServicesPreviewSubheading">Subheading</Label><Textarea id="homeServicesPreviewSubheading" name="homeServicesPreviewSubheading" value={formData.homeServicesPreviewSubheading || ''} onChange={handleInputChange} /></div>
                  <div className="space-y-2"><Label htmlFor="homeServicesPreviewCtaButtonText">"See All" Button Text</Label><Input id="homeServicesPreviewCtaButtonText" name="homeServicesPreviewCtaButtonText" value={formData.homeServicesPreviewCtaButtonText || ''} onChange={handleInputChange} /></div>
                  <p className="text-xs text-muted-foreground pt-2">The services themselves are managed from the "Services & Features" page and are pulled in automatically if flagged as "Featured".</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="milestones">
                <AccordionTrigger>Milestones Section</AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                  <div className="space-y-2"><Label htmlFor="homeMilestonesHeading">Heading</Label><Input id="homeMilestonesHeading" name="homeMilestonesHeading" value={formData.homeMilestonesHeading || ''} onChange={handleInputChange} /></div>
                  <div className="space-y-2"><Label htmlFor="homeMilestonesSubheading">Subheading</Label><Textarea id="homeMilestonesSubheading" name="homeMilestonesSubheading" value={formData.homeMilestonesSubheading || ''} onChange={handleInputChange} /></div>
                  <h4 className="font-semibold pt-4 border-t">Milestones</h4>
                  {(formData.milestones || []).map((milestone, index) => (
                    <div key={index} className="p-4 border rounded-md space-y-3 relative">
                      <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeArrayItem('milestones', index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Icon</Label><Select value={milestone.icon} onValueChange={(val) => handleObjectArrayChange('milestones', index, 'icon', val)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{iconNames.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}</SelectContent></Select></div>
                        <div className="space-y-2"><Label>Value</Label><Input type="number" value={milestone.value} onChange={(e) => handleObjectArrayChange('milestones', index, 'value', Number(e.target.value))} /></div>
                        <div className="space-y-2"><Label>Suffix</Label><Input value={milestone.suffix} onChange={(e) => handleObjectArrayChange('milestones', index, 'suffix', e.target.value)} /></div>
                        <div className="space-y-2"><Label>Label</Label><Input value={milestone.label} onChange={(e) => handleObjectArrayChange('milestones', index, 'label', e.target.value)} /></div>
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('milestones')}><PlusCircle className="mr-2 h-4 w-4" /> Add Milestone</Button>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="principles">
                <AccordionTrigger>Principles Section</AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                  <div className="space-y-2"><Label htmlFor="homePrinciplesHeading">Heading</Label><Input id="homePrinciplesHeading" name="homePrinciplesHeading" value={formData.homePrinciplesHeading || ''} onChange={handleInputChange} /></div>
                  <div className="space-y-2"><Label htmlFor="homePrinciplesSubheading">Subheading</Label><Textarea id="homePrinciplesSubheading" name="homePrinciplesSubheading" value={formData.homePrinciplesSubheading || ''} onChange={handleInputChange} /></div>
                  <h4 className="font-semibold pt-4 border-t">Principles</h4>
                  {(formData.principles || []).map((principle, index) => (
                    <div key={index} className="p-4 border rounded-md space-y-3 relative">
                      <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeArrayItem('principles', index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      <div className="space-y-2"><Label>Icon</Label><Select value={principle.icon} onValueChange={(val) => handleObjectArrayChange('principles', index, 'icon', val)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{iconNames.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}</SelectContent></Select></div>
                      <div className="space-y-2"><Label>Title</Label><Input value={principle.title} onChange={(e) => handleObjectArrayChange('principles', index, 'title', e.target.value)} /></div>
                      <div className="space-y-2"><Label>Description</Label><Textarea value={principle.description} onChange={(e) => handleObjectArrayChange('principles', index, 'description', e.target.value)} /></div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('principles')}><PlusCircle className="mr-2 h-4 w-4" /> Add Principle</Button>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="newsletter">
                <AccordionTrigger>Newsletter Section</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-2"><Label htmlFor="homeNewsletterHeading">Heading</Label><Input id="homeNewsletterHeading" name="homeNewsletterHeading" value={formData.homeNewsletterHeading || ''} onChange={handleInputChange} /></div>
                  <div className="space-y-2"><Label htmlFor="homeNewsletterSubheading">Subheading</Label><Textarea id="homeNewsletterSubheading" name="homeNewsletterSubheading" value={formData.homeNewsletterSubheading || ''} onChange={handleInputChange} /></div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="process">
                <AccordionTrigger>Process Section</AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                  <div className="space-y-2"><Label htmlFor="homeProcessHeading">Heading</Label><Input id="homeProcessHeading" name="homeProcessHeading" value={formData.homeProcessHeading || ''} onChange={handleInputChange} /></div>
                  <div className="space-y-2"><Label htmlFor="homeProcessSubheading">Subheading</Label><Textarea id="homeProcessSubheading" name="homeProcessSubheading" value={formData.homeProcessSubheading || ''} onChange={handleInputChange} /></div>
                  <h4 className="font-semibold pt-4 border-t">Process Steps</h4>
                  {(formData.processSteps || []).map((step, index) => (
                    <div key={index} className="p-4 border rounded-md space-y-3 relative">
                      <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeArrayItem('processSteps', index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Step Number</Label><Input value={step.step} onChange={(e) => handleObjectArrayChange('processSteps', index, 'step', e.target.value)} /></div>
                        <div className="space-y-2"><Label>Icon</Label><Select value={step.icon} onValueChange={(val) => handleObjectArrayChange('processSteps', index, 'icon', val)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{iconNames.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}</SelectContent></Select></div>
                      </div>
                      <div className="space-y-2"><Label>Title</Label><Input value={step.title} onChange={(e) => handleObjectArrayChange('processSteps', index, 'title', e.target.value)} /></div>
                      <div className="space-y-2"><Label>Description</Label><Textarea value={step.description} onChange={(e) => handleObjectArrayChange('processSteps', index, 'description', e.target.value)} /></div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('processSteps')}><PlusCircle className="mr-2 h-4 w-4" /> Add Step</Button>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="knowledge">
                <AccordionTrigger>Digital Knowledge Section</AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                  <div className="space-y-2"><Label htmlFor="homeKnowledgeHeading">Heading</Label><Input id="homeKnowledgeHeading" name="homeKnowledgeHeading" value={formData.homeKnowledgeHeading || ''} onChange={handleInputChange} /></div>
                  <div className="space-y-2"><Label htmlFor="homeKnowledgeSubheading">Subheading</Label><Textarea id="homeKnowledgeSubheading" name="homeKnowledgeSubheading" value={formData.homeKnowledgeSubheading || ''} onChange={handleInputChange} /></div>
                  <h4 className="font-semibold pt-4 border-t">Knowledge Points</h4>
                  {(formData.digitalKnowledgeBase || []).map((point, index) => (
                    <div key={index} className="p-4 border rounded-md space-y-3 relative">
                      <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeArrayItem('digitalKnowledgeBase', index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      <div className="space-y-2"><Label>Icon</Label><Select value={point.icon} onValueChange={(val) => handleObjectArrayChange('digitalKnowledgeBase', index, 'icon', val)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{iconNames.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}</SelectContent></Select></div>
                      <div className="space-y-2"><Label>Title</Label><Input value={point.title} onChange={(e) => handleObjectArrayChange('digitalKnowledgeBase', index, 'title', e.target.value)} /></div>
                      <div className="space-y-2"><Label>Description (allows HTML)</Label><Textarea value={point.description} onChange={(e) => handleObjectArrayChange('digitalKnowledgeBase', index, 'description', e.target.value)} /></div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('digitalKnowledgeBase')}><PlusCircle className="mr-2 h-4 w-4" /> Add Point</Button>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tech-stack">
                <AccordionTrigger>Tech Stack Section</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-2"><Label htmlFor="homeTechStackHeading">Heading</Label><Input id="homeTechStackHeading" name="homeTechStackHeading" value={formData.homeTechStackHeading || ''} onChange={handleInputChange} /></div>
                  <div className="space-y-2"><Label htmlFor="homeTechStackSubheading">Subheading</Label><Textarea id="homeTechStackSubheading" name="homeTechStackSubheading" value={formData.homeTechStackSubheading || ''} onChange={handleInputChange} /></div>
                  <p className="text-xs text-muted-foreground pt-2">The tech stack icons are managed statically in the code and are not editable here.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="parallax-2">
                <AccordionTrigger>Parallax Section 2 (Final CTA)</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-2"><Label htmlFor="homeParallax2Heading">Heading</Label><Input id="homeParallax2Heading" name="homeParallax2Heading" value={formData.homeParallax2Heading || ''} onChange={handleInputChange} /></div>
                  <div className="space-y-2"><Label htmlFor="homeParallax2Subheading">Subheading</Label><Textarea id="homeParallax2Subheading" name="homeParallax2Subheading" value={formData.homeParallax2Subheading || ''} onChange={handleInputChange} /></div>
                  <div className="space-y-2"><Label htmlFor="homeParallax2CtaButtonText">CTA Button Text</Label><Input id="homeParallax2CtaButtonText" name="homeParallax2CtaButtonText" value={formData.homeParallax2CtaButtonText || ''} onChange={handleInputChange} /></div>
                </AccordionContent>
              </AccordionItem>

            </Accordion>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-8 mt-0">
          <div className="p-6 bg-background rounded-lg border">
            <h2 className="text-2xl font-bold mb-6 text-primary">Contact Page</h2>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-muted-foreground pt-2 border-t">Hero Section</h3>
              <div><Label htmlFor="contactHeroHeading">Hero Heading</Label><Input id="contactHeroHeading" name="contactHeroHeading" value={formData.contactHeroHeading || ''} onChange={handleInputChange} /></div>
              <div><Label htmlFor="contactHeroSubheading">Hero Subheading</Label><Textarea id="contactHeroSubheading" name="contactHeroSubheading" value={formData.contactHeroSubheading || ''} onChange={handleInputChange} /></div>
              
              <h3 className="text-lg font-semibold text-muted-foreground pt-4 border-t mt-6">Contact Info Section</h3>
              <div><Label htmlFor="contactInfoHeading">Info Section Heading</Label><Input id="contactInfoHeading" name="contactInfoHeading" value={formData.contactInfoHeading || ''} onChange={handleInputChange} /></div>
              <div><Label htmlFor="contactInfoSubheading">Info Section Subheading</Label><Textarea id="contactInfoSubheading" name="contactInfoSubheading" value={formData.contactInfoSubheading || ''} onChange={handleInputChange} /></div>
              <div><Label htmlFor="contactEmail">Email Address</Label><Input id="contactEmail" name="contactEmail" type="email" value={formData.contactEmail || ''} onChange={handleInputChange} /></div>
              <div><Label htmlFor="contactPhone">Phone Number</Label><Input id="contactPhone" name="contactPhone" value={formData.contactPhone || ''} onChange={handleInputChange} /></div>
              <div><Label htmlFor="contactAddress">Address / Location</Label><Input id="contactAddress" name="contactAddress" value={formData.contactAddress || ''} onChange={handleInputChange} /></div>
              <div><Label htmlFor="contactWorkingHours">Working Hours</Label><Textarea id="contactWorkingHours" name="contactWorkingHours" value={formData.contactWorkingHours || ''} onChange={handleInputChange} placeholder="Mon - Fri: 9am - 5pm..." rows={3} /><p className="text-xs text-muted-foreground">Use line breaks for multiple lines.</p></div>

              <h3 className="text-lg font-semibold text-muted-foreground pt-4 border-t mt-6">Contact Form Steps</h3>
              <div><Label htmlFor="contactFormStep1Heading">Step 1 Heading</Label><Input id="contactFormStep1Heading" name="contactFormStep1Heading" value={formData.contactFormStep1Heading || ''} onChange={handleInputChange} /></div>
              <div><Label htmlFor="contactFormStep2Heading">Step 2 Heading</Label><Input id="contactFormStep2Heading" name="contactFormStep2Heading" value={formData.contactFormStep2Heading || ''} onChange={handleInputChange} /></div>
              <div><Label htmlFor="contactFormStep3Heading">Step 3 Heading</Label><Input id="contactFormStep3Heading" name="contactFormStep3Heading" value={formData.contactFormStep3Heading || ''} onChange={handleInputChange} /></div>
            </div>
          </div>

          <OptionListManagement
            title="Project Timelines"
            description="Options for the 'Project Timeline' dropdown in the contact form."
            options={formData.projectTimelines || []}
            onOptionChange={(index, field, value) => handleOptionChange('projectTimelines', index, field, value)}
            onAddOption={() => handleAddOption('projectTimelines')}
            onRemoveOption={(index) => handleRemoveOption('projectTimelines', index)}
          />

          <OptionListManagement
            title="Maintenance Contract Lengths"
            description="Options for the 'Contract Length' dropdown for maintenance plans."
            options={formData.maintenanceContractLengths || []}
            onOptionChange={(index, field, value) => handleOptionChange('maintenanceContractLengths', index, field, value)}
            onAddOption={() => handleAddOption('maintenanceContractLengths')}
            onRemoveOption={(index) => handleRemoveOption('maintenanceContractLengths', index)}
          />
        </TabsContent>

        <TabsContent value="about" className="mt-0">
          <div className="p-6 bg-background rounded-lg border">
            <h2 className="text-2xl font-bold mb-6 text-primary">About Page</h2>
            <Accordion type="multiple" className="w-full space-y-4">
              <AccordionItem value="meta">
                <AccordionTrigger>Meta / SEO</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-2"><Label htmlFor="aboutMetaTitle">Meta Title</Label><Input id="aboutMetaTitle" name="aboutMetaTitle" value={formData.aboutMetaTitle || ''} onChange={handleInputChange} /></div>
                  <div className="space-y-2"><Label htmlFor="aboutMetaDescription">Meta Description</Label><Textarea id="aboutMetaDescription" name="aboutMetaDescription" value={formData.aboutMetaDescription || ''} onChange={handleInputChange} /></div>
                  <div className="space-y-2"><Label htmlFor="aboutMetaName">Schema Name</Label><Input id="aboutMetaName" name="aboutMetaName" value={formData.aboutMetaName || ''} onChange={handleInputChange} /></div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="hero">
                <AccordionTrigger>Hero Section</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-2"><Label htmlFor="aboutHeroHeading">Hero Heading</Label><Input id="aboutHeroHeading" name="aboutHeroHeading" value={formData.aboutHeroHeading || ''} onChange={handleInputChange} /></div>
                  <div className="space-y-2"><Label htmlFor="aboutHeroSubheading">Hero Subheading</Label><Textarea id="aboutHeroSubheading" name="aboutHeroSubheading" value={formData.aboutHeroSubheading || ''} onChange={handleInputChange} /></div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="story">
                <AccordionTrigger>Story Section</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-2"><Label htmlFor="aboutStoryHeading">Story Heading</Label><Input id="aboutStoryHeading" name="aboutStoryHeading" value={formData.aboutStoryHeading || ''} onChange={handleInputChange} /></div>
                  <div className="space-y-2"><Label htmlFor="aboutStorySubheading">Story Subheading</Label><Textarea id="aboutStorySubheading" name="aboutStorySubheading" value={formData.aboutStorySubheading || ''} onChange={handleInputChange} /></div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="beliefs">
                <AccordionTrigger>Core Beliefs</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  {(formData.coreBeliefs || []).map((belief, index) => (
                    <div key={index} className="p-4 border rounded-md space-y-3 relative">
                      <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeArrayItem('coreBeliefs', index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>                      <div className="space-y-2"><Label>Icon</Label><Select value={belief.icon} onValueChange={(val) => handleObjectArrayChange('coreBeliefs', index, 'icon', val)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{iconNames.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}</SelectContent></Select></div>
                      <div className="space-y-2"><Label>Title</Label><Input value={belief.title} onChange={(e) => handleObjectArrayChange('coreBeliefs', index, 'title', e.target.value)} /></div>                      <div className="space-y-2"><Label>Description</Label><Textarea value={belief.description} onChange={(e) => handleObjectArrayChange('coreBeliefs', index, 'description', e.target.value)} /></div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('coreBeliefs')}><PlusCircle className="mr-2 h-4 w-4" /> Add Belief</Button>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="webapp">
                <AccordionTrigger>Web App Section</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-2"><Label htmlFor="aboutWebAppHeading">Heading</Label><Input id="aboutWebAppHeading" name="aboutWebAppHeading" value={formData.aboutWebAppHeading || ''} onChange={handleInputChange} /></div>
                  <div className="space-y-2"><Label htmlFor="aboutWebAppParagraph1">Paragraph 1</Label><Textarea id="aboutWebAppParagraph1" name="aboutWebAppParagraph1" value={formData.aboutWebAppParagraph1 || ''} onChange={handleInputChange} /></div>
                  <div className="space-y-2"><Label htmlFor="aboutWebAppParagraph2">Paragraph 2 (allows HTML)</Label><Textarea id="aboutWebAppParagraph2" name="aboutWebAppParagraph2" value={formData.aboutWebAppParagraph2 || ''} onChange={handleInputChange} /></div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tech">
                <AccordionTrigger>Tech In Action Section</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-2"><Label htmlFor="aboutTechActionHeading">Heading</Label><Input id="aboutTechActionHeading" name="aboutTechActionHeading" value={formData.aboutTechActionHeading || ''} onChange={handleInputChange} /></div>
                  <div className="space-y-2"><Label htmlFor="aboutTechActionParagraph">Paragraph</Label><Textarea id="aboutTechActionParagraph" name="aboutTechActionParagraph" value={formData.aboutTechActionParagraph || ''} onChange={handleInputChange} /></div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="pricing">
                <AccordionTrigger>Pricing Section</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-2"><Label htmlFor="aboutPricingHeading">Heading</Label><Input id="aboutPricingHeading" name="aboutPricingHeading" value={formData.aboutPricingHeading || ''} onChange={handleInputChange} /></div>
                  <div className="space-y-2"><Label htmlFor="aboutPricingSubheading">Subheading</Label><Textarea id="aboutPricingSubheading" name="aboutPricingSubheading" value={formData.aboutPricingSubheading || ''} onChange={handleInputChange} /></div>
                  <div className="space-y-2"><Label htmlFor="aboutPremiumHeading">Premium Quality Heading</Label><Input id="aboutPremiumHeading" name="aboutPremiumHeading" value={formData.aboutPremiumHeading || ''} onChange={handleInputChange} /></div>
                  <div className="space-y-2"><Label htmlFor="aboutPremiumSubheading">Premium Quality Subheading</Label><Textarea id="aboutPremiumSubheading" name="aboutPremiumSubheading" value={formData.aboutPremiumSubheading || ''} onChange={handleInputChange} /></div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="future">
                <AccordionTrigger>Future Goals</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-2"><Label htmlFor="aboutFutureHeading">Heading</Label><Input id="aboutFutureHeading" name="aboutFutureHeading" value={formData.aboutFutureHeading || ''} onChange={handleInputChange} /></div>
                  <div className="space-y-2"><Label htmlFor="aboutFutureSubheading">Subheading</Label><Textarea id="aboutFutureSubheading" name="aboutFutureSubheading" value={formData.aboutFutureSubheading || ''} onChange={handleInputChange} /></div>
                  {(formData.futureGoals || []).map((goal, index) => (
                    <div key={index} className="p-4 border rounded-md space-y-3 relative">
                      <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeArrayItem('futureGoals', index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      <div className="space-y-2"><Label>Icon</Label><Select value={goal.icon} onValueChange={(val) => handleObjectArrayChange('futureGoals', index, 'icon', val)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{iconNames.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}</SelectContent></Select></div>
                      <div className="space-y-2"><Label>Title</Label><Input value={goal.title} onChange={(e) => handleObjectArrayChange('futureGoals', index, 'title', e.target.value)} /></div>
                      <div className="space-y-2"><Label>Description</Label><Textarea value={goal.description} onChange={(e) => handleObjectArrayChange('futureGoals', index, 'description', e.target.value)} /></div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('futureGoals')}><PlusCircle className="mr-2 h-4 w-4" /> Add Goal</Button>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="cta">
                <AccordionTrigger>Final CTA Section</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-2"><Label htmlFor="aboutCtaHeading">CTA Heading</Label><Input id="aboutCtaHeading" name="aboutCtaHeading" value={formData.aboutCtaHeading || ''} onChange={handleInputChange} /></div>
                  <div className="space-y-2"><Label htmlFor="aboutCtaSubheading">CTA Subheading</Label><Textarea id="aboutCtaSubheading" name="aboutCtaSubheading" value={formData.aboutCtaSubheading || ''} onChange={handleInputChange} /></div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </TabsContent>

        <div className="flex justify-end p-4 sm:px-6 sticky bottom-0 bg-background/80 backdrop-blur-sm border-t -mx-6 -mb-6 rounded-b-lg">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save All Content
          </Button>
        </div>
      </form>
    </Tabs>
  );
}