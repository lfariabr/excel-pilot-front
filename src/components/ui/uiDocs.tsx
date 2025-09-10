
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loading } from "@/components/ui/loading"

// Design System Showcase
export const UI_DOCS = () => {
    return (
        <Card>
        <CardHeader>
        <CardTitle>Design System Components</CardTitle>
        <CardDescription>
            shadcn/ui components integrated and ready for use
        </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
        {/* Buttons */}
        <div className="space-y-2">
            <h4 className="text-sm font-medium">Buttons</h4>
            <div className="flex flex-wrap gap-2">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
            </div>
        </div>

        {/* Badges */}
        <div className="space-y-2">
            <h4 className="text-sm font-medium">Badges</h4>
            <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            </div>
        </div>

        {/* Loading States */}
        <div className="space-y-2">
            <h4 className="text-sm font-medium">Loading States</h4>
            <div className="flex items-center gap-4">
            <Loading variant="spinner" size="sm" />
            <Loading variant="dots" />
            <Loading variant="skeleton" className="w-32" />
            </div>
        </div>
        </CardContent>
        </Card>
    )
}