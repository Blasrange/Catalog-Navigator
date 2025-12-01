import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ProductDisplaySkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <Skeleton className="h-8 w-3/4 rounded-md" />
        <Skeleton className="mt-2 h-4 w-1/2 rounded-md" />
      </CardHeader>
      <CardContent className="grid gap-8 pt-2 md:grid-cols-5">
        <div className="md:col-span-2">
          <Skeleton className="aspect-square w-full rounded-lg" />
        </div>
        <div className="space-y-6 md:col-span-3">
          <div className="space-y-2">
            <Skeleton className="h-6 w-1/3 rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-5/6 rounded-md" />
          </div>
          <Skeleton className="h-px w-full" />
          <div className="space-y-3">
            <Skeleton className="h-6 w-1/2 rounded-md" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Skeleton className="h-8 w-full rounded-md" />
              <Skeleton className="h-8 w-full rounded-md" />
              <Skeleton className="h-8 w-full rounded-md" />
              <Skeleton className="h-8 w-full rounded-md" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
