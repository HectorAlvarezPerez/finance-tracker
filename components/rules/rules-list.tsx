"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Play, Pause, Wand2 } from "lucide-react"
import type { Database } from "@/types/database"
import { EditRuleDialog } from "./edit-rule-dialog"
import { DeleteRuleDialog } from "./delete-rule-dialog"
import { toggleRule } from "@/lib/actions/rules"
import { useToast } from "@/components/ui/use-toast"

type TransactionRule = Database["public"]["Tables"]["transaction_rules"]["Row"] & {
    categories: { id: string; name: string; color: string } | null
    accounts: { id: string; name: string; type: string } | null
}

type Account = Database["public"]["Tables"]["accounts"]["Row"]
type Category = Database["public"]["Tables"]["categories"]["Row"]

export function RulesList({
    rules,
    accounts,
    categories,
}: {
    rules: TransactionRule[]
    accounts: Account[]
    categories: Category[]
}) {
    const [editingRule, setEditingRule] = useState<TransactionRule | null>(null)
    const [deletingRule, setDeletingRule] = useState<TransactionRule | null>(null)
    const { toast } = useToast()

    const handleToggle = async (rule: TransactionRule) => {
        try {
            await toggleRule(rule.id, !rule.enabled)
            toast({
                title: "Success",
                description: `Rule ${rule.enabled ? "disabled" : "enabled"}`,
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update rule",
                variant: "destructive",
            })
        }
    }

    if (rules.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <Wand2 className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No rules yet</h3>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                        Create rules to automatically categorize your transactions.
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <>
            <div className="space-y-4">
                {rules.map((rule) => (
                    <Card key={rule.id} className={!rule.enabled ? "opacity-60" : ""}>
                        <CardHeader className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-lg">&quot;{rule.pattern}&quot;</span>
                                        {!rule.enabled && <Badge variant="secondary">Disabled</Badge>}
                                    </div>
                                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <span>Action:</span>
                                            <Badge variant="outline" className="capitalize">
                                                {rule.action}
                                            </Badge>
                                        </div>
                                        {rule.categories && (
                                            <div className="flex items-center gap-2">
                                                <span>Category:</span>
                                                <Badge
                                                    variant="outline"
                                                    style={{
                                                        borderColor: rule.categories.color,
                                                        color: rule.categories.color,
                                                    }}
                                                >
                                                    {rule.categories.name}
                                                </Badge>
                                            </div>
                                        )}
                                        {rule.accounts && (
                                            <div className="flex items-center gap-2">
                                                <span>Account:</span>
                                                <span className="font-medium text-foreground">
                                                    {rule.accounts.name}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleToggle(rule)}>
                                            {rule.enabled ? (
                                                <>
                                                    <Pause className="h-4 w-4 mr-2" />
                                                    Disable
                                                </>
                                            ) : (
                                                <>
                                                    <Play className="h-4 w-4 mr-2" />
                                                    Enable
                                                </>
                                            )}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setEditingRule(rule)}>
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => setDeletingRule(rule)}
                                            className="text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardHeader>
                    </Card>
                ))}
            </div>

            {editingRule && (
                <EditRuleDialog
                    rule={editingRule}
                    categories={categories}
                    accounts={accounts}
                    open={!!editingRule}
                    onOpenChange={(open) => !open && setEditingRule(null)}
                />
            )}

            {deletingRule && (
                <DeleteRuleDialog
                    rule={deletingRule}
                    open={!!deletingRule}
                    onOpenChange={(open) => !open && setDeletingRule(null)}
                />
            )}
        </>
    )
}
