"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { updateRule } from "@/lib/actions/rules"
import { useToast } from "@/components/ui/use-toast"
import type { Database } from "@/types/database"

type Category = Database["public"]["Tables"]["categories"]["Row"]
type Account = Database["public"]["Tables"]["accounts"]["Row"]
type TransactionRule = Database["public"]["Tables"]["transaction_rules"]["Row"]

const formSchema = z.object({
    pattern: z.string().min(1, "Pattern is required"),
    action: z.enum(["categorize", "rename"]),
    category_id: z.string().optional(),
    default_account_id: z.string().optional(),
}).refine((data) => {
    if (data.action === "categorize" && !data.category_id) {
        return false
    }
    return true
}, {
    message: "Category is required for categorize action",
    path: ["category_id"],
})

export function EditRuleDialog({
    rule,
    categories,
    accounts,
    open,
    onOpenChange,
}: {
    rule: TransactionRule
    categories: Category[]
    accounts: Account[]
    open: boolean
    onOpenChange: (open: boolean) => void
}) {
    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            pattern: rule.pattern,
            action: rule.action as "categorize" | "rename",
            category_id: rule.default_category_id || undefined,
            default_account_id: rule.default_account_id || undefined,
        },
    })

    const action = form.watch("action")

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await updateRule(rule.id, {
                pattern: values.pattern,
                action: values.action,
                default_category_id: values.category_id || null,
                default_account_id: values.default_account_id || null,
            })

            toast({
                title: "Success",
                description: "Rule updated successfully",
            })

            onOpenChange(false)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update rule",
                variant: "destructive",
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Transaction Rule</DialogTitle>
                    <DialogDescription>
                        Modify the rule settings.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="pattern"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pattern</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Netflix, Uber, Salary" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Text to match in the transaction description (case-insensitive).
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="action"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Action</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select action" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="categorize">Categorize</SelectItem>
                                            <SelectItem value="rename">Rename (Coming Soon)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {action === "categorize" && (
                            <FormField
                                control={form.control}
                                name="category_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="default_account_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Account (Optional)</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value || "any"}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Any account" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="any">Any account</SelectItem>
                                            {accounts.map((account) => (
                                                <SelectItem key={account.id} value={account.id}>
                                                    {account.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Only apply this rule to transactions from a specific account.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="submit">Save Changes</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
