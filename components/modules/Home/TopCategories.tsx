import { getCategories } from "@/service/category.service";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Leaf,
  Wind,
  Sun,
  Droplets,
  Zap,
  Globe,
  Recycle,
  FolderTree,
  Car,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const ICON_MAP: Record<string, any> = {
  solar: Sun,
  sun: Sun,
  wind: Wind,
  water: Droplets,
  hydro: Droplets,
  waste: Recycle,
  recycle: Recycle,
  trash: Recycle,
  energy: Zap,
  power: Zap,
  zap: Zap,
  biodiversity: Leaf,
  forest: Leaf,
  nature: Leaf,
  tree: Leaf,
  transport: Car,
  car: Car,
  vehicle: Car,
  climate: Globe,
  earth: Globe,
  global: Globe,
};

function getCategoryIcon(slug: string) {
  const s = slug.toLowerCase();
  for (const key in ICON_MAP) {
    if (s.includes(key)) {
      return ICON_MAP[key];
    }
  }
  return FolderTree;
}

export default async function TopCategories() {
  const response = await getCategories({ limit: 6 });
  const categories = response?.success && response.data ? response.data : [];

  if (categories.length === 0) {
    return null; // Don't show the section if no categories exist
  }

  return (
    <section className="relative overflow-hidden py-24 px-4 md:px-6 lg:px-8 bg-linear-to-b from-background to-muted/20">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-1/4 -z-10 h-96 w-96 rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 -z-10 h-96 w-96 rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="size-3.5" />
              <span>Explore Topics</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground font-heading">
              Top Sustainability Categories
            </h2>
            <p className="text-muted-foreground text-base md:text-lg">
              Explore impact-driven sustainability ideas organized by sectors. Select a topic to browse approved ideas and solutions.
            </p>
          </div>
          <Button asChild variant="outline" size="lg" className="rounded-xl font-medium group border-primary/20 hover:bg-primary/5">
            <Link href="/categories">
              View All Categories
              <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {categories.map((category) => {
            const IconComponent = getCategoryIcon(category.slug);
            const ideaCount = category._count?.ideas ?? 0;

            return (
              <Link
                key={category.id}
                href={`/ideas?category=${encodeURIComponent(category.slug)}`}
                className="group relative block rounded-2xl transition-all duration-300"
              >
                {/* Glow border on hover */}
                <div className="absolute -inset-[1px] rounded-2xl bg-linear-to-r from-primary to-emerald-500 opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-100" />
                
                <Card className="relative h-full bg-card/60 backdrop-blur-md border border-border/80 rounded-2xl transition-all duration-300 group-hover:bg-card/90 group-hover:translate-y-[-4px] overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-[0.03] text-foreground transition-opacity duration-300 group-hover:opacity-[0.06]">
                    <IconComponent className="size-36" />
                  </div>
                  
                  <CardContent className="p-8 flex flex-col justify-between h-full min-h-[220px]">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground shadow-xs">
                          <IconComponent className="size-6" />
                        </div>
                        <Badge variant="secondary" className="px-3 py-1 rounded-full text-xs font-medium">
                          {ideaCount} {ideaCount === 1 ? "Idea" : "Ideas"}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground font-heading tracking-tight group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {category.description || `Explore eco-friendly innovations and projects focused on ${category.name.toLowerCase()}.`}
                        </p>
                      </div>
                    </div>

                    <div className="pt-6 mt-auto border-t border-border/30 flex items-center justify-between text-sm font-medium text-primary">
                      <span>Explore Ideas</span>
                      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
