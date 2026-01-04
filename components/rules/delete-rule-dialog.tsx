"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteRule } from "@/lib/actions/rules"
import { useToast } from "@/components/ui/use-toast"
import type { Database } from "@/types/database"

type TransactionRule = Database["public"]["Tables"]["transaction_rules"]["Row"]

export function DeleteRuleDialog({
    rule,
    open,
    onOpenChange,
}: {
    rule: TransactionRule
    open: boolean
    onOpenChange: (open: boolean) => void
}) {
    const { toast } = useToast()

    async function onDelete() {
        try {
            await deleteRule(rule.id)
            toast({
                title: "Success",
                description: "Rule deleted successfully",
            })
            onOpenChange(false)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete rule",
                variant: "destructive",
            })
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the rule
                        for &quot;{rule.pattern}&quot;.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
